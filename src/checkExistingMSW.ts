import process from "node:process"
import { isCancel, select } from "@clack/prompts"
import pc from "picocolors"
import { commonOutro, hasDevDependency } from "./utils"

/**
 * Whether user already has MSW installed and setup
 */
async function hasMSWInstallation() {
  return hasDevDependency("msw")
}

export async function checkExistingMSW() {
  if (await hasMSWInstallation()) {
    const doFreshSetup = await select({
      message: `You already have ${pc.cyan(
        "msw",
      )} installed. Are you going to force do a fresh setup?`,
      options: [
        {
          label: "Yes",
          value: "yes",
        },
        {
          label: "No",
          value: "no",
        },
      ],
    })

    if (isCancel(doFreshSetup) || doFreshSetup === "no") {
      commonOutro()
      process.exit(0)
    }
  }
}
