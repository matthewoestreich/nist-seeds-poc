import { open, type FileHandle } from "node:fs/promises";
import { createReadStream } from "node:fs";
import readline from "node:readline";

export default class PersistentFileRW {
  private fileHandle: FileHandle | null = null;
  private filePath: string;
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async initialize(): Promise<void> {
    if (this.fileHandle) return;
    // 'a+' ensures the file is created if missing and allows reading/appending
    this.fileHandle = await open(this.filePath, "a+");
  }

  async *readLines(): AsyncIterableIterator<string> {
    const fileStream = createReadStream(this.filePath, { encoding: "utf8" });

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      yield line;
    }
  }

  async appendLine(data: string): Promise<void> {
    if (!this.fileHandle) {
      throw new Error("Cache writer not initialized! Call initialize() first.");
    }

    this.writeQueue = this.writeQueue.then(async () => {
      await this.fileHandle!.appendFile(`${data}\n`, "utf-8");
    });

    return this.writeQueue;
  }

  async close(): Promise<void> {
    if (this.fileHandle) {
      await this.writeQueue;
      await this.fileHandle.close();
      this.fileHandle = null;
    }
  }
}
