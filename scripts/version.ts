import { readFile } from "node:fs/promises"
import * as path from "node:path"
import * as process from "node:process"

const pkgPath = path.resolve(process.cwd(), "package.json")
const pkg = JSON.parse(await readFile(pkgPath, "utf8"))

console.log(`Current version: ${pkg.version}`)

console.log("Post-version script completed.")
