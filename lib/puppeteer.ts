import puppeteer from 'puppeteer';

export const initBrowser = async (defaultTimeout: number = 120000) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--lang=en-US,en'],
    timeout: defaultTimeout,
    defaultViewport: {
      width: 1280,  // Set the desired width
      height: 800,  // Set the desired height
    },
  });
  return browser;
};
