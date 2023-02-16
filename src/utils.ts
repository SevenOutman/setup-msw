import path from "node:path"
import { fileURLToPath } from "node:url"
import { spinner } from "@clack/prompts"
import { copy } from "fs-extra"
import { listFrameworks, type FrameworkId } from "@netlify/framework-info"

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

/**
 * @see https://mswjs.io/docs/getting-started/integrate/browser#where-is-my-public-directory
 */
const commonPublicDirectories = {
  'create-react-app': "./public",
  gatsby: "./static",
  next: "./public",
  vue: "./public",
  angular: "./src",
  // preact: "./src/static",
  ember: "./public",
  svelte: "./public",
  'svelte-kit': "./static",
  vite: "./public",
} satisfies {
  [id in FrameworkId]: string
}

/**
 * Guess the public directory based on what framework user is using
 */
export async function guessPublicDirectory(): Promise<string> {
  const frameworks = await listFrameworks()

  const knownFramework = frameworks.find(framework => framework.id in commonPublicDirectories)

  return knownFramework? commonPublicDirectories[knownFramework.id] : './public'
}
