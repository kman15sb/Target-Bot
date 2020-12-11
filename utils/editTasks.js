const fs = require('fs')
const inquirer = require('inquirer');
const taskFile = require('../settings/tasks.json')

let names = []
taskFile.forEach(task => {
    names.push(task.name)
})

module.exports = { 
    editTask: async () => {
        const Run = require('../index.js')
        inquirer.prompt([
            {
                name: 'choseTask',
                type: 'list',
                message: 'Chose Task',
                choices: names
            },
            {
                name: 'email',
                type: 'input',
                message: 'Input Account Email'
            },
            {
                name: 'password',
                type: 'password',
                message: 'Input Account Password'
            }
        ]).then(answer => {    
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
                const accessToken = accessTokenCookie[0].value; 
                await browser.close()
                signale.success('Succesfully Got Access Token!')
                console.log(accessToken)
            }
            const newTaskFile = []
            taskFile.filter(task => {
                if (task.name == answer.choseTask) {
                    const newTask = {
                            "name": task.name,
                            "cookies": accessToken,
                            "prodId": task.productId,
                            "cvv": task.cvv,
                            "instore": task.instore,
                            "locationId": task.locationId,
                            "giftCard": task.giftCard,
                            "giftCardId": task.giftCardId
                    }
                    task = newTask
                }
                newTaskFile.push(task)
            })
        fs.writeFileSync('./settings/tasks.json', JSON.stringify(newTaskFile))
        Run()
        })
    
    }
 }