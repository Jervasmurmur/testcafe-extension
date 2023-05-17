import * as puppeteer from 'puppeteer';


export async function setup(final_page:string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
    
        await page.goto('file:///C:/Users/anton/Documents/kod%20mapp/Web/Typescript%20test/start_site.html');
        
        await page.setViewport({width: 1080, height: 1024});
        
        await page.goto('file:///C:/Users/anton/Documents/kod mapp/test/testCafé testing/fancy_site.html');
    
        let html = await page.content();

        await browser.close();
        return html;
        
    } catch (error) {
        await browser.close();
        // console.log(error);
        throw error;
    }
}