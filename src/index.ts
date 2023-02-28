#!/usr/bin/env node
import { intro, outro } from "@clack/prompts"
import boxen from "boxen"
import { emphasize } from "emphasize"
import pc from "picocolors"
import { setupMSW } from "./setupMSW"
import { promptForParameters } from "./promptForParameters"

const startWorkerScript = `if (process.env.NODE_ENV === 'development') {
       const { worker } = require('./mocks/browser')
       worker.start()
     }`

const setupTestsScript = `import { server } from './mocks/server'

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
  
     ${emphasize.highlight("javascript", startWorkerScript).value}
     
   You should see a successful activation message in your browser's console

${boxen(pc.red("[MSW] Mocking enabled"), {
  padding: 1,
  margin: { left: 3, top: 0, right: 3, bottom: 0 },
})}`)
    } else if (parameters.integrationType === "nodejs") {
      outro(`Now add the following script into your setting-up test script then you're all set!
    
     ${emphasize.highlight("javascript", setupTestsScript).value}`)
    } else if (parameters.integrationType === "both") {
      outro(`Now add the following script into your entry script,
    
     ${emphasize.highlight("javascript", startWorkerScript).value}

   and add the following script into your setting-up test script then you're all set!
    
     ${emphasize.highlight("javascript", setupTestsScript).value}
     
   You should see a successful activation message in your browser's console

${boxen(pc.red("[MSW] Mocking enabled"), {
  padding: 1,
  margin: { left: 3, top: 0, right: 3, bottom: 0 },
})}`)
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
