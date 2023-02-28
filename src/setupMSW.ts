import path from "node:path"
import { execa } from "execa"
import pc from "picocolors"
import { copyTemplate, runAsyncWithSpinner } from "./utils"

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
  await runAsyncWithSpinner(`Installing ${pc.cyan(`msw`)}...`, async () => {
    await execa("npm", ["install", "--save-dev", "msw"])
  })

  // Create mocks/handlers.js

  await runAsyncWithSpinner(
    `Generating ${pc.green(`mocks/handlers.js`)}...`,
    async () => {
      await copyTemplate(
        options.apiType + "-handlers.js",
        path.join(mocksDirectoryPath, "handlers.js"),
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

  // Cerate mocks/browser.js or/and mocks/server.js

  if (options.integrationType === "browser") {
    await runAsyncWithSpinner(
      `Generating ${pc.green("mocks/browser.js")}...`,
      async () => {
        await copyTemplate(
          "browser.js",
          path.join(mocksDirectoryPath, "browser.js"),
        )
      },
    )
  }

  if (options.integrationType === "nodejs") {
    await runAsyncWithSpinner(
      `Generating ${pc.green("mocks/server.js")}...`,
      async () => {
        await copyTemplate(
          "server.js",
          path.join(mocksDirectoryPath, "server.js"),
        )
      },
    )
  }

  if (options.integrationType === "both") {
    await runAsyncWithSpinner(
      `Generating ${pc.green("mocks/browser.js")} and ${pc.green(
        "mocks/server.js",
      )}...`,
      async () => {
        await Promise.all([
          copyTemplate(
            "browser.js",
            path.join(mocksDirectoryPath, "browser.js"),
          ),
          copyTemplate("server.js", path.join(mocksDirectoryPath, "server.js")),
        ])
      },
    )
  }
}
