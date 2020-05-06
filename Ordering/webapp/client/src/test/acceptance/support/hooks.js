// Hooks are fired before and after each cucumber scenario and are used
// for context setups and teardowns.

const { After, Before, AfterAll } = require("cucumber");
const scope = require("./scope");
const {URL, localHostUrl} = require('../common/pageObjects')
const commonObjects = require('../common/pageObjects');
const stepDefinitions = require('../common/stepDefinitions')
const puppeteer = require('puppeteer');

let counter = 0;
Before( async () => {
  // You can clean up database models here
  const isDebugging = () =>
        true  // process.env.NODE_ENV === "debug"
            ? {
                headless: false,
                slowMo: 80,
                executablePath:'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                //devtools: true
                args: [`--window-size=1534,998`]
            }
            : {};

            
            if (!scope.browser) scope.browser = await scope.driver.launch(isDebugging());

              scope.context.currentPage = await scope.browser.newPage();
            scope.context.currentPage.emulate({
                      viewport: {
                          // width: 500,
                          // height: 2400
                          width: 1334,
                          height: 898
                      },
                      userAgent: ""
                  });
                  await scope.context.currentPage.goto(URL);

          if(counter==0) {
            const { ID_X_PATH, ID_X_VALUE, PASSWORD_X_PATH, PASSWORD_X_VALUE, SUBMIT_X_PATH } = commonObjects;
            await stepDefinitions.login(ID_X_PATH, ID_X_VALUE, PASSWORD_X_PATH, PASSWORD_X_VALUE, SUBMIT_X_PATH);                  

          }                 
          counter++;

  // puppeteer.launch({headless: false}).then(async browser => {
  //   const page = await browser.newPage();
  //   await page.emulate({
  //                       viewport: {
  //                             width: 2134,
  //                             height: 898
  //                     },
  //                     userAgent: ""
  //                   });
  //   await page.goto(URL);

  //   if(counter==0) {
  //     const { ID_X_PATH, ID_X_VALUE, PASSWORD_X_PATH, PASSWORD_X_VALUE, SUBMIT_X_PATH } = commonObjects;
  //     await stepDefinitions.login(page, ID_X_PATH, ID_X_VALUE, PASSWORD_X_PATH, PASSWORD_X_VALUE, SUBMIT_X_PATH);                  
  //   }                 
  //             counter++;
    // await browser.close();
  // });


});

After(async () => {
  // Here we check if a scenario has instantiated a browser and a current page
  if (scope.browser && scope.context.currentPage) {
    // if it has, find all the cookies, and delete them
    const cookies = await scope.context.currentPage.cookies();
    if (cookies && cookies.length > 0) {
      await scope.context.currentPage.deleteCookie(...cookies);
    }
    // close the web page down
    await scope.context.currentPage.close();
    // wipe the context's currentPage value
    scope.context.currentPage = null;
    //if (scope.browser) await scope.browser.close();
  //  setTimeout(() => { scope.browser.close(); }, 1000);
  }
});

AfterAll(async () => {
  // If there is a browser window open, then close it
//  if (scope.browser) await scope.browser.close();
   setTimeout(() => { scope.browser.close(); }, 3000);
});
