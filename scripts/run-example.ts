import { spawn } from "child_process"

const example = process.argv[2]
if (!example) {
  console.error("Usage: pnpm run-example <example-name>")
  process.exit(1)
}

spawn("vite", ["--config", "examples/vite.config.ts"], {
  stdio: "inherit",
  env: { ...process.env, EXAMPLE: example }
})
