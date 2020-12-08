const puppeteer = require('puppeteer')
const inquirer = require('inquirer')

class getTokens {
    constructor() {
        this.email = ''
        this.password = ''
        this.getInfo()
    }

    async getToken() {
        console.log('Fetching Access Token')
        const browser = await puppeteer.launch({
            headless: false
        });
        const page = await browser.newPage()
        await page.goto('https://www.target.com/account/orders')
        await page.waitForSelector('#username')
        await page.type('#username', this.email)
        await page.type('#password', this.password)
        await page.click('#login')
        const cookies = await page.cookies()
        const accessTokenCookie = cookies.filter((cookie) => cookie.name == "accessToken");
        const accessToken = accessTokenCookie[0].value; 
        console.log(accessToken)
        return accessToken
    }
}

module.exports = { 
    getTokens: () => {
        return new getTokens
    }
}