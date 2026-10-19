import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/main.ts"),
      formats: ["es"],
      fileName: "main",
    },
    rolldownOptions: {
      external: [/^node:/],
    },
    target: "node26",
    sourcemap: true,
  },
});
