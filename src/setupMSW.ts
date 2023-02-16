import path from "node:path"
import { execa } from "execa"
import pc from "picocolors"
import { copyTemplate, isTsProject, runAsyncWithSpinner } from "./utils"

type SetupMSWOptions =
  | {
      apiType: "rest" | "graphql"
      integrationType: "browser"
      publicDirectory: string
    }
  | {
      apiType: "rest" | "graphql"
      integrationType: "nodejs"
    }

const mocksDirectoryPath = path.join(process.cwd(), "src/mocks")

export async function setupMSW(options: SetupMSWOptions) {
  // Install msw
  await runAsyncWithSpinner(`Installing ${pc.cyan(`msw`)}...`, async () => {
    await execa("npm", ["install", "--save-dev", "msw"])
  })

  // Create mocks/handlers.js
  const generatedFileExtension = (await isTsProject()) ? ".ts" : ".js"

  await runAsyncWithSpinner(
    `Generating ${pc.green(`mocks/handlers.${generatedFileExtension}`)}...`,
    async () => {
      await copyTemplate(
        options.apiType + "-handlers.js",
        path.join(mocksDirectoryPath, "handlers" + generatedFileExtension),
      )
    },
  )

  // Run msw init
  if (options.integrationType === "browser") {
    await runAsyncWithSpinner(
      `Executing ${pc.cyan(`msw init`)}...`,
      async () => {
        await execa("npx", ["msw", "init", options.publicDirectory, "--save"])
      },
    )
  }

  // Cerate mocks/browser.js or mocks/server.js

  const integrationFileName = {
    browser: "browser",
    nodejs: "server",
  }[options.integrationType]

  await runAsyncWithSpinner(
    `Generating ${pc.green(
      "mocks/" + integrationFileName + generatedFileExtension,
    )}...`,
    async () => {
      await copyTemplate(
        integrationFileName + ".js",
        path.join(
          mocksDirectoryPath,
          integrationFileName + generatedFileExtension,
        ),
      )
    },
  )
}
