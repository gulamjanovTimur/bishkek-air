import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // JSON-фикстуры WAQI, общие для unit- и e2e-тестов
      "@fixtures": fileURLToPath(new URL("./fixtures", import.meta.url)),
      // Настоящий server-only бросает ошибку вне условия react-server; в тестах серверный код выполняется в Node
      "server-only": fileURLToPath(
        new URL("./node_modules/server-only/empty.js", import.meta.url),
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
