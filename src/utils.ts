import process from "node:process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { spinner } from "@clack/prompts"
import { copy, exists } from "fs-extra"

// @see https://stackoverflow.com/a/72462507
const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

const s = spinner()

export async function runAsyncWithSpinner(
  message: string,
  task: () => Promise<void>,
) {
  s.start(message)
  await task()
  s.stop(message + " Done.")
}

const templateDirectoryPath = path.resolve(__dirname, "../templates")
export async function copyTemplate(
  templateFileName: string,
  destination: string,
) {
  await copy(path.join(templateDirectoryPath, templateFileName), destination)
}

export async function isTsProject() {
  return await exists(path.join(process.cwd(), "tsconfig.json"))
}
