import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createInterface } from "node:readline";
import { PendingRequest } from "./types.ts";

export default class PariGP {
  private readonly child: ChildProcessWithoutNullStreams;
  private readonly pending: PendingRequest[] = [];
  private output: string[] = [];
  private stderr = "";
  private closed = false;

  constructor() {
    this.child = spawn(
      "gp",
      ["-q", "-f", "--default", "parisizemax=2000000000"],
      { stdio: ["pipe", "pipe", "pipe"] },
    );

    const stdout = createInterface({ input: this.child.stdout });

    stdout.on("line", (line) => {
      if (line === "__GP_DONE__") {
        const request = this.pending.shift();
        const result = this.output.join("\n").trim();
        this.output = [];

        if (!request) {
          return;
        }

        if (!/^\d+$/.test(result)) {
          request.reject(
            new Error(`Unexpected PARI/GP output: ${result}\n${this.stderr}`),
          );
        } else {
          request.resolve(BigInt(result));
        }

        return;
      }

      this.output.push(line);
    });

    this.child.stderr.on("data", (chunk: Buffer) => {
      this.stderr = (this.stderr + chunk.toString()).slice(-8192);
    });

    this.child.on("error", (error) => {
      this.failAll(error);
    });

    this.child.on("close", (code) => {
      this.closed = true;
      this.failAll(
        new Error(`PARI/GP exited with code ${code}\n${this.stderr}`),
      );
    });
  }

  curveOrder(p: bigint, b: bigint): Promise<bigint> {
    if (this.closed) {
      return Promise.reject(new Error("PARI/GP process is closed"));
    }

    return new Promise<bigint>((resolve, reject) => {
      this.pending.push({ resolve, reject });

      this.child.stdin.write(
        `print(ellsea(ellinit([-3, ${b}], ${p}), 1))\n` +
          'print("__GP_DONE__")\n',
        (error) => {
          if (error) this.failAll(error);
        },
      );
    });
  }

  close(): void {
    this.child.stdin.end();
  }

  private failAll(error: Error): void {
    for (const request of this.pending.splice(0)) {
      request.reject(error);
    }

    this.output = [];
  }
}
