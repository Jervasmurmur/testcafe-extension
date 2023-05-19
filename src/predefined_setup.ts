import * as puppeteer from 'puppeteer';


// NOTE: Används final_page när testning är klar
export async function setup(final_page:string) {
    const browser = await puppeteer.launch({headless:false});   // TEST: Icke headless vid debugging 
    const page = await browser.newPage();
    try {
    
        // TODO: Fixa till så funktionen funkar med en lambda

        // !!!! LADDA INTE UPP TILL GIT MED LÖSENORD OCH ANVÄNDARNAMN !!!!
        let anv = "";
        let pass = "";

        // await page.goto('file:///C:/Users/anton/Documents/kod%20mapp/Web/Typescript%20test/start_site.html');    // TEST

        // NOTE: Kan nog låta den gå till angiven sida direkt, kommer ju till inloggning hur som helst
        await page.goto('https://login-utv.ssgsolutions.com/d923a467-48cc-4b99-96ce-1a312ce4a1e3/b2c_1a_profilesigninphoneemailpassword/oauth2/v2.0/authorize?client_id=8142daa1-8fbc-4748-b966-d7e4655455e4&redirect_uri=https%3A%2F%2Fssg-utv-sales-app.azurewebsites.net%2Fsignin-oidc&response_type=id_token&scope=openid%20profile%20email&response_mode=form_post&nonce=638199277395409507.Mzg1NWJmZWUtYTAyNy00ZWQ3LThhZWUtYzAwNzlhYTMzNGNkMGUzMTUxMmYtMThjZi00OGY2LWE3ZTgtMzA0Y2JmZTdkMjQw&state=CfDJ8Iar7jqh_bRLjrCmMixccrxeWbskBYBSn_0121CeOq1ZpXh22MjYRkOcMfu4fMzJzplWTWxw4kK2T6OC6dxOMtUnPuJgg7zdRyOJQNKCT4tWCBUwI0JY51BUJQDOwCT4GubNfbitsVDBXFkjmex7LBqzcJAe-4C9zfxlVPihmKarP8c4KUQ81R3xlrWFuwL9kwu0uwqVvG4l2TL85JesxIcZmPAb_0WG-8ZZ_kM5SRVWMCXv2yRWo54nE0IWWSuPKx_uNOZg1783MJFfmwvm6SJeNX3aBeeYvaArofBz6v7FLncNmNIxhGIGb4-TDhUblQG1MrmlJGijZnoZ35EN3aUgNVsiil931WXHsLBO2qrod-hP-BV4Zq55vW30CcrJDA&x-client-SKU=ID_NET6_0&x-client-ver=6.21.0.0');
        
        // await page.waitForTimeout(4000); // TEST
        
        await page.setViewport({width: 1080, height: 1024});

        await page.waitForSelector("#signInName");
        await page.type("#signInName", anv);
        await page.click("#next");

        await page.waitForSelector(pass);
        await page.type("#password", "");
        await page.click("#next");
        
        await page.goto('https://ssg-utv-sales-app.azurewebsites.net/');
        // await page.goto('file:///C:/Users/anton/Documents/kod mapp/test/testCafé testing/fancy_site.html');      // TEST
        
        let html = await page.content();
        
        await page.waitForTimeout(20000);
        await browser.close();
        return html;
        
    } catch (error) {
        await browser.close();
        // console.log(error);
        throw error;
    }
}