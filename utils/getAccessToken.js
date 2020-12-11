const puppeteer = require('puppeteer')
const signale = require('signale')

class getToken {
    getTokens = async () => {
        inquirer.prompt([
            {
                name: 'email',
                type: 'input',
                message: 'Input Account Email'
            },
            {
                name: 'password',
                type: 'password',
                mask: '*',
                message: 'Input Accout Password'
            }
        ]).then(answer => {
            this.email = answer.email
            this.password = answer.password
            this.getToken()
        })
    }
    async getToken() {
        signale.success('Fetching Access Token...')
        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage()
        await page.goto('https://www.target.com/account/orders')
        await page.waitForSelector('#username')
        await page.type('#username', this.email)
        await page.type('#password', this.password)
        await page.click('#login')
        await page.waitForNavigation({ waitUntil: 'networkidle0' })
        const cookies = await page.cookies()
        const accessTokenCookie = cookies.filter((cookie) => cookie.name == "accessToken");
        this.accessToken = accessTokenCookie[0].value; 
        await browser.close()
        signale.success('Succesfully Got Access Token!')
        console.log(this.accessToken)
    }
}


module.exports = { 
    getAccessToken: async () => {
        new getToken() 
    }
}