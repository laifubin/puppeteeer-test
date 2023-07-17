const puppeteer = require('puppeteer');

module.exports = async () => {
  const browser = await puppeteer.launch({headless: false});

  const page = await browser.newPage();
  
  await page.goto('https://www.amazon.com/s?me=A1DKT9HYDCSRL&language=en_US&marketplaceID=ATVPDKIKX0DER');

  // Set screen size
  // await page.setViewport({width: 1080, height: 1024});

  let data = []
  const result = await page.evaluate(async() => {
    data = []
    const els = document.querySelectorAll('.s-desktop-content .a-section>.sg-row')
    for(let i = 0; i < els.length; i++) {
      const el = els[i]
      
      const item = {}
      const title = el.querySelector('.s-title-instructions-style span.a-text-normal')?.innerText
      if(!title) continue
      const listing = title.split(' ')[1]
      const url = el.querySelector('.s-image')?.src
      const price = el.querySelector('.a-price .a-offscreen')?.innerText
      let stock = el.querySelector('.a-spacing-top-micro>div.a-row.a-size-base.a-color-secondary span[aria-label]')?.getAttribute('aria-label')
      stock && (stock = stock.replace(/([^0-9]+)/g, ''))
      const startAndComment = el.querySelectorAll('.a-spacing-top-micro>div.a-row.a-size-small span[aria-label]')
      for(let j = 0; j < startAndComment.length; j++) {
        item[j === 0 ? 'start' : 'commentCount'] = startAndComment[j]?.getAttribute('aria-label')
      }

      console.log(url)
      data.push({ url, listing, title, price, stock, ...item })
    }
    return data
  })
  console.log(result)

  browser.close();
  return result
};