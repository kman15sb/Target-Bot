const fs = require('fs')
const inquirer = require('inquirer');


module.exports = { 
    createTask: async () => {
        inquirer.prompt([
            {
                name: 'profileName',
                type: 'input',
                message: 'Input Task Name'
            },
            {
                name: 'email',
                type: 'input',
                message: 'Input Account Email'      
            },
            {
                name: 'password',
                type: 'input',
                mask: '*',
                message: 'Input Account Password'
            },
            {
                name: 'productId',
                type: 'input',
                message: 'Input Product Id'      
            },
            {
                name: 'cvv',
                type: 'input',
                message: 'Input CVV'      
            },
            {
                name: 'instore',
                type: 'confirm',
                message: 'Pickup Instore'
            },
            {
                name: 'locationId',
                type: 'input',
                message: 'Input Location Id (if shipping online click enter)'      
            },
            {
                name: 'giftCard',
                type: 'confirm',
                message: 'Use a Giftcard?' 
            },
            {
                name: 'giftCardId',
                type: 'input',
                message: 'Input Giftcard Id (if not using giftcard click enter)'      
            }
        ]).then(answer => {
            const { Run } = require('../index.js')
            getToken = async (answer) => {
                signale.success('Fetching Access Token...')
                const browser = await puppeteer.launch({
                    headless: true
                });
                const page = await browser.newPage()
                await page.goto('https://www.target.com/account/orders')
                await page.waitForSelector('#username')
                await page.type('#username', answer.email)
                await page.type('#password', answer.password)
                await page.click('#login')
                await page.waitForNavigation({ waitUntil: 'networkidle0' })
                const cookies = await page.cookies()
                const accessTokenCookie = cookies.filter((cookie) => cookie.name == "accessToken");
                this.accessToken = accessTokenCookie[0].value; 
                await browser.close()
                signale.success('Succesfully Got Access Token!')
                console.log(this.accessToken)
                return this.accessToken
            }
            let data = {
                "name": answer.profileName,
                "cookies": getToken(),
                "prodId": answer.productId,
                "cvv": answer.cvv,
                "instore": answer.instore,
                "locationId": answer.locationId,
                "giftCard": answer.giftCard,
                "giftCardId": answer.giftCardId
            }
            const taskRaw = fs.readFileSync('./settings/tasks.json', 'utf-8')
            const tasks = JSON.parse(taskRaw)
            tasks.push(data)
            fs.writeFileSync('./settings/tasks.json', JSON.stringify(tasks))
            Run()
        })
    }
 }