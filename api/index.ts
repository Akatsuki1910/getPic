import express from 'express'
const playwright = require(process.env.AWS_LAMBDA_FUNCTION_VERSION
  ? 'playwright-aws-lambda'
  : 'playwright-core')

const app: express.Express = express()

app.get('/getText', async (req: express.Request, res: express.Response) => {
  const browser = process.env.AWS_LAMBDA_FUNCTION_VERSION
    ? await playwright.launchChromium({
        channel: 'chrome',
        headless: true,
      })
    : await playwright.chromium.launch({ channel: 'chrome', headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.waitForTimeout(20000)
  const webData = await page.goto(req.query.url as string)
  const text = await webData!.text()
  await browser.close()
  res.send(text)
})

module.exports = {
  path: '/api',
  handler: app,
}
