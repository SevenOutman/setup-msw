import { detect, type PM } from "detect-package-manager"
import { execa } from "execa"
import pc from "picocolors"
import { runAsyncWithSpinner } from "./utils"

const installCommandArgs = {
  npm: ["install", "--save-dev"],
  yarn: ["add", "--dev"],
  pnpm: ["add", "--save-dev"],
}

export async function installMSW() {
  let pm: PM

  try {
    pm = await detect()
  } catch {
    pm = "npm"
  }
  const args = installCommandArgs[pm]

  return await runAsyncWithSpinner(
    `Running ${pc.cyan([pm, ...args, "msw"].join(" "))}...`,
    async () => {
      await execa(pm, [...args, "msw"])
    },
  )
}
