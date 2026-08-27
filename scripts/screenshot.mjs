import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots')

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function captureScreenshot(page, name, selector) {
  try {
    const element = await page.waitForSelector(selector, { timeout: 5000 })
    if (!element) {
      console.log(`⚠️  Селектор "${selector}" не найден, пропускаем ${name}`)
      return
    }

    await element.scrollIntoView({ behavior: 'instant', block: 'start' })
    await sleep(800)

    const filename = path.join(SCREENSHOTS_DIR, `${name}.png`)
    await element.screenshot({ path: filename, type: 'png' })
    console.log(`📸 Сохранён: ${name}.png`)
  } catch (err) {
    console.log(`❌ Ошибка при скриншоте ${name}: ${err.message}`)
  }
}

async function main() {
  await ensureDir(SCREENSHOTS_DIR)

  console.log('🚀 Запускаем браузер...')
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  console.log('🌐 Открываем http://localhost:3000 ...')
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(2000)

  // Полный скриншот всей страницы
  const fullPagePath = path.join(SCREENSHOTS_DIR, '00-full-page.png')
  await page.screenshot({ path: fullPagePath, type: 'png', fullPage: true })
  console.log('📸 Сохранён: 00-full-page.png')

  console.log('📸 Делаем скриншоты всех секций...\n')

  await captureScreenshot(page, '01-hero', '#hero')
  await captureScreenshot(page, '02-categories', '#categories')
  await captureScreenshot(page, '03-quiz', '#quiz')
  await captureScreenshot(page, '04-bestsellers', '#bestsellers')
  await captureScreenshot(page, '05-new-arrivals', '#new-arrivals')
  await captureScreenshot(page, '06-collections', '#collections')
  await captureScreenshot(page, '07-stories', '#stories')
  await captureScreenshot(page, '08-similar', 'section')
  await captureScreenshot(page, '09-blog', '#blog')
  await captureScreenshot(page, '10-comparison', '#comparison')
  await captureScreenshot(page, '11-discovery', 'section')
  await captureScreenshot(page, '12-newsletter', '#newsletter')
  await captureScreenshot(page, '13-catalog', '#catalog')

  const files = fs.readdirSync(SCREENSHOTS_DIR).sort()
  console.log(`\n✅ Готово! Всего ${files.length} скриншотов`)
  console.log('📁 Папка:', SCREENSHOTS_DIR)
  console.log('Файлы:', files.join(', '))

  await browser.close()
}

main().catch(err => {
  console.error('❌ Ошибка:', err)
  process.exit(1)
})
