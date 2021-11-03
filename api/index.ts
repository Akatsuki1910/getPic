import express from 'express'
import puppeteer from 'puppeteer'
const app: express.Express = express()

app.get('/getText', async (req: express.Request, res: express.Response) => {
  const browser = await puppeteer.launch()
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
