import puppeteer from 'puppeteer';
import fs from 'fs';

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://www.traversymedia.com');

  const courses = await page.$$eval('#cscourses .card', (elements) =>
    elements.map((e) => ({
      title: e.querySelector('.card-body h3').innerText,
      level: e.querySelector('.card-body .level').innerText,
      url: e.querySelector('.card-footer a').href,
    }))
  );
  console.log(courses);

  // save as JSON file
  fs.writeFile('courses.json', JSON.stringify(courses), (error) => {
    if (error) throw error;
    console.log('File saved!');
  });

  await browser.close();
}

run();
