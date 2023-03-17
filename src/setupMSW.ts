import path from "node:path"
import { execa } from "execa"
import pc from "picocolors"
import { copyTemplate, isTsProject, runAsyncWithSpinner } from "./utils"
import { installMSW } from "./installMSW"

type SetupMSWOptions =
  | {
      apiType: "rest" | "graphql" | "both"
      integrationType: "browser" | "both"
      publicDirectory: string
    }
  | {
      apiType: "rest" | "graphql" | "both"
      integrationType: "nodejs"
    }

const mocksDirectoryPath = path.join(process.cwd(), "src/mocks")

export async function setupMSW(options: SetupMSWOptions) {
  // Install msw
  await installMSW()

  // Create mocks/handlers.js
  const generatedFileExtension = (await isTsProject()) ? ".ts" : ".js"

  await runAsyncWithSpinner(
    `Generating ${pc.green("mocks/handlers" + generatedFileExtension)}...`,
    async () => {
      await copyTemplate(
        options.apiType + "-handlers.js",
        path.join(mocksDirectoryPath, "handlers" + generatedFileExtension),
      )
    },
  )

  // Run msw init
  if (
    options.integrationType === "browser" ||
    options.integrationType === "both"
  ) {
    await runAsyncWithSpinner(
      `Executing ${pc.cyan(`msw init ${options.publicDirectory} --save`)}...`,
      async () => {
        await execa("npx", ["msw", "init", options.publicDirectory, "--save"])
      },
    )
  }

  // Cerate mocks/browser.js or/and mocks/server.js

  if (options.integrationType === "browser") {
    await runAsyncWithSpinner(
      `Generating ${pc.green("mocks/browser" + generatedFileExtension)}...`,
      async () => {
        await copyTemplate(
          "browser.js",
          path.join(mocksDirectoryPath, "browser" + generatedFileExtension),
        )
      },
    )
  }

  if (options.integrationType === "nodejs") {
    await runAsyncWithSpinner(
      `Generating ${pc.green("mocks/server" + generatedFileExtension)}...`,
      async () => {
        await copyTemplate(
          "server.js",
          path.join(mocksDirectoryPath, "server" + generatedFileExtension),
        )
      },
    )
  }

  if (options.integrationType === "both") {
    await runAsyncWithSpinner(
      `Generating ${pc.green(
        "mocks/browser" + generatedFileExtension,
      )} and ${pc.green("mocks/server" + generatedFileExtension)}...`,
      async () => {
        await Promise.all([
          copyTemplate(
            "browser.js",
            path.join(mocksDirectoryPath, "browser" + generatedFileExtension),
          ),
          copyTemplate(
            "server.js",
            path.join(mocksDirectoryPath, "server" + generatedFileExtension),
          ),
        ])
      },
    )
  }
}
