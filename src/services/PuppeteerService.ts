import puppeteer from 'puppeteer';


export class PuppeteerService {


    async getCallbackData(urlLogin: string, spotifyUser: string, spotifyPassword: string): Promise<string> {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage();


        await page.goto(urlLogin, {
            waitUntil: 'networkidle0'
        })

        await page.type("#login-username", spotifyUser)
        await page.type("#login-password", spotifyPassword)

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

