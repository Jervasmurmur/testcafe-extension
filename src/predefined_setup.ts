import * as puppeteer from 'puppeteer';


// NOTE: Används final_page när testning är klar
export async function setup_1(final_page:string) {
    const browser = await puppeteer.launch({headless:true});   // TEST: Icke headless vid debugging 
    const page = await browser.newPage();
    try {
    
        // TODO: Fixa till så funktionen funkar med en lambda

        // !!!! LADDA INTE UPP TILL GIT MED LÖSENORD OCH ANVÄNDARNAMN !!!!
        let anv = "";
        let pass = "";

        // await page.goto('file:///C:/Users/anton/Documents/kod%20mapp/Web/Typescript%20test/start_site.html');    // TEST

        // await page.goto('file:///C:/Users/AntonEnglundEXT/Documents/VScode%20projects/Typescript_test/ssg-company-test.html');
        await page.goto('https://ssg-utv-sales-app.azurewebsites.net/');
        // await page.goto('https://ssg-utv-sales-app.azurewebsites.net/companies');
        // await page.goto('https://ssg-utv-sales-app.azurewebsites.net/subscriptionOrder/1876');
        
        await page.waitForTimeout(4000); // TEST
        
        await page.setViewport({width: 1080, height: 1024});
        
        await page.waitForSelector("#signInName");
        await page.type("#signInName", anv);
        await page.click("#next");
        
        await page.waitForSelector("#password");
        await page.type("#password", pass);
        await page.click("#next");
        
        // <a class="frame-module_frame__nav-item__42-eu" href="/companies"><span>Företag</span></a>
        // #root > div.frame-module_frame__MmY3E > div.frame-module_frame__nav__-bd5K
        // #root > div.frame-module_frame__MmY3E > div.frame-module_frame__nav__-bd5K
        // #tab--27--0
        // #root > div.frame-module_frame__MmY3E > div.frame-module_frame__body__6EUSp > div > div.display-flex > div > div > input
        
        await page.waitForSelector("#tab--1--1");
        await page.click("#tab--1--1");
        // await page.waitForSelector("#root > div.frame-module_frame__MmY3E > div.frame-module_frame__body__6EUSp > div > div.display-flex > div > div > input");
        await page.type("#root > div.frame-module_frame__MmY3E > div.frame-module_frame__body__6EUSp > div > div.display-flex > div > div > input", "test");
        // <a class="" href="/subscriptionOrder/1876">Testföretaget AB</a>
        await page.waitForSelector("a[href='/subscriptionOrder/1876']");
        await page.click("a[href='/subscriptionOrder/1876']");
        // <a class="" href="/subscriptionOrder/1876">Testföretaget AB</a>
        // document.querySelector("#panel--1--1 > div > div > table > tbody > tr:nth-child(50) > td:nth-child(1) > a")
        // #panel--1--1 > div > div > table > tbody > tr:nth-child(8) > td:nth-child(1) > a
        // #panel--1--1 > div > div > table > tbody > tr:nth-child(50) > td:nth-child(1) > a

        
        await page.waitForTimeout(4000); // TEST
        // await page.waitForSelector("#root > div.frame-module_frame__MmY3E > div.frame-module_frame__nav__-bd5K.frame-module_frame__nav--active__wEd0G > div.frame-module_frame__nav-list__ferqU > div > a:nth-child(2) > span");
        // await page.click("#root > div.frame-module_frame__MmY3E > div.frame-module_frame__nav__-bd5K.frame-module_frame__nav--active__wEd0G > div.frame-module_frame__nav-list__ferqU > div > a:nth-child(2) > span");
        // await page.waitForTimeout(4000); // TEST
        // await page.goto('file:///C:/Users/anton/Documents/kod mapp/test/testCafé testing/fancy_site.html');      // TEST
        
        let html = await page.content();
        
        // await page.waitForTimeout(20000);
        await browser.close();
        return html;
        
    } catch (error) {
        await browser.close();
        // console.log(error);
        throw error;
    }
}

export async function setup_2(final_page:string) {
    const browser = await puppeteer.launch({headless:false});   // TEST: Icke headless vid debugging 
    const page = await browser.newPage();
    try {

        await page.goto('https://devexpress.github.io/testcafe/example/');
        // await page.goto('https://developer.chrome.com/', {waitUntil: "domcontentloaded" });


        // await page.waitForSelector("a[class='bg-blue-medium button-filled button-round color-bg display-inline-flex gap-top-400 material-button']");
        // await page.waitForTimeout(4000);
        // await page.focus("a[class='bg-blue-medium button-filled button-round color-bg display-inline-flex gap-top-400 material-button']");
        // await page.waitForTimeout(4000);
        
        let html = await page.content();
        
        // await page.waitForTimeout(20000);
        await browser.close();
        return html;
        
    } catch (error) {
        await browser.close();
        // console.log(error);
        throw error;
    }
}