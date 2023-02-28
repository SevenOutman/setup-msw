#!/usr/bin/env node
import { intro, outro } from "@clack/prompts"
import { emphasize } from "emphasize"
import pc from "picocolors"
import { setupMSW } from "./setupMSW"
import { promptForParameters } from "./promptForParameters"

const startWorkerScript = `if (process.env.NODE_ENV === 'development') {
       const { worker } = require('./mocks/browser')
       worker.start()
     }`

const setupTestsScript = `import { server } from './mocks/server.js'

     beforeAll(() => server.listen())
     afterEach(() => server.resetHandlers())
     afterAll(() => server.close())`

console.log()

intro(
  `${pc.underline(
    pc.bold(pc.green("setup-msw")),
  )} helps you add MSW into your app`,
)

promptForParameters().then(
  async (parameters) => {
    await setupMSW(parameters)

    if (parameters.integrationType === "browser") {
      outro(`Now add the following script into your entry script then you're all set!
  
     ${emphasize.highlight("javascript", startWorkerScript).value}`)
    } else if (parameters.integrationType === "nodejs") {
      outro(`Now add the following script into your setting-up test script then you're all set!
    
     ${emphasize.highlight("javascript", setupTestsScript).value}`)
    } else if (parameters.integrationType === "both") {
      outro(`Now add the following script into your entry script,
    
     ${emphasize.highlight("javascript", startWorkerScript).value}

   and add the following script into your setting-up test script then you're all set!
    
     ${emphasize.highlight("javascript", setupTestsScript).value}`)
    }
    console.log(`   Happy mocking!`)
    console.log()
  },
  // User aborts
  () => {
    outro(
      `You can setup msw yourself following the official guide at:
   ${pc.cyan("https://mswjs.io/docs/getting-started")}
`,
    )
  },
)
