import { isCancel, select, text } from "@clack/prompts"

export async function promptForParameters() {
  const apiType = await select({
    message: "What type of API would you like to mock?",
    options: [
      {
        value: "rest",
        label: "REST API",
      },
      {
        value: "graphql",
        label: "GraphQL API",
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
    placeholder: "./public",
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
