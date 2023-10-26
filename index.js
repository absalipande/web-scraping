import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import fs, { writeFileSync } from 'fs';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();

  await page.goto('https://www.deped.gov.ph/category/procurement/notices-of-award/');

  const depEdProjects = await page.content();
  const $ = cheerio.load(depEdProjects);

  const linkContent = [];
  $('article div header h2 a').each((i, el) => {
    const value = $(el).attr('href');
    linkContent.push(value);
  });

  for (let i = 0; i < linkContent.length; i++) {
    await page.goto(linkContent[i]);
    const depEdProjects = await page.content();
    const $ = cheerio.load(depEdProjects);
    const title = $('article > div > table > tbody > tr:nth-child(2) > td:nth-child(2)').text();
    const abc = $('article > div > table > tbody > tr:nth-child(3) > td:nth-child(2)').text();
    writeFileSync('details.txt', `Project: ${title} \n ABC: ${abc} \n`, {
      flag: 'a',
    });
  }

  await browser.close();
})();
