import path from "node:path"
import { defineConfig } from "vite"

const example = process.env.EXAMPLE || "counter"

export default defineConfig({
  root: path.resolve(__dirname, example),
  server: {
    open: true
  }
})
