import * as path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [],
  test: {
    environment: "jsdom",
    setupFiles: [path.join(__dirname, "setupTests.ts")],
    include: ["./test/**/*.test.ts", "./examples/**/*.test.ts"],
    globals: true
  }
})
