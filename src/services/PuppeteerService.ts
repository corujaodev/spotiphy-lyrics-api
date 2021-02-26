import puppeteer from 'puppeteer';


export class PuppeteerService {


    async getCallbackData(urlLogin: string): Promise<string> {
        const browser = await puppeteer.launch({ headless: true })
        const page = await browser.newPage();


        await page.goto(urlLogin, {
            waitUntil: 'networkidle0'
        })

        const userSpotify = "josericardodainese@gmail.com"
        const passwordSpotify = "Jr142022@#$"

        await page.type("#login-username", userSpotify)
        await page.type("#login-password", passwordSpotify)

        page.click("#login-button")
        await page.waitForNavigation()

        if (page.url().includes("accounts")) {
            page.click("#auth-accept")
            await page.waitForNavigation();
        }

        const url = page.url();
        await browser.close();

        return url;
    }

}

