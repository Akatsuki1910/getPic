import express from 'express'
const chrome = process.env.AWS_LAMBDA_FUNCTION_VERSION
  ? require('chrome-aws-lambda')
  : {}
const puppeteer = require(process.env.AWS_LAMBDA_FUNCTION_VERSION
  ? 'puppeteer-core'
  : 'puppeteer')
const app: express.Express = express()

app.get('/getText', async (req: express.Request, res: express.Response) => {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  })
  const page = await browser.newPage()
  const webData = await page.goto(req.query.url as string)
  const text = await webData.text()
  await browser.close()
  res.send(text)
})

module.exports = {
  path: '/api',
  handler: app,
}
