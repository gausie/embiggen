import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    setupFiles: ["./test/setupTests.ts"],
    // libram's published ESM uses extensionless relative imports; let Vite
    // resolve them instead of Node's stricter node_modules resolver.
    server: { deps: { inline: ["libram"] } },
  },
});
