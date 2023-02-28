import { isCancel, select, text } from "@clack/prompts"
import { guessPublicDirectory } from "./utils"

export async function promptForParameters() {
  // There're not yet many options to select among so single-select is enough
  // multi-select leads to additional keyboard actions
  const apiType = await select({
    message: "What type(s) of API would you like to mock?",
    options: [
      {
        value: "rest",
        label: "REST API",
      },
      {
        value: "graphql",
        label: "GraphQL API",
      },
      {
        value: "both",
        label: "Both REST API and GraphQL API",
      },
    ],
  })

  if (isCancel(apiType)) {
    throw new Error("")
  }

  const integrationType = await select({
    message: "Choose where to run the mocks",
    options: [
      {
        value: "browser",
        label: "Browser",
      },
      {
        value: "nodejs",
        label: "Node",
      },
    ],
  })

  if (isCancel(integrationType)) {
    throw new Error("")
  }

  if (integrationType === "nodejs") {
    return {
      apiType,
      integrationType,
    }
  }

  const publicDirectory = await text({
    message: "Your public directory",
    placeholder: await guessPublicDirectory(),
  })

  if (isCancel(publicDirectory)) {
    throw new Error("")
  }

  return {
    apiType,
    integrationType,
    publicDirectory,
  }
}
