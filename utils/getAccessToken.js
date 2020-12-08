const puppeteer = require('puppeteer')

class getToken {
    constructor() {
        
    }
}

module.exports = {
    getToken: async () => {
        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage()
        await page.goto('https://www.target.com/account/orders')
        await page.type('#username', answer.email)
        await page.type('#password', answer.password)
        const accessTokenCookie = cookies.filter((cookie) => cookie.name == "accessToken");
        const accessToken = accessTokenCookie[0].value; 
        console.log(accessToken)
    }
}