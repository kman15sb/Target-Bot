const puppeteer = require('puppeteer');
const faker = require('faker')
const generator = require('generate-password')
const fs = require('fs')
const inquirer = require('inquirer')
const signale = require('signale');

class genAcc {
    constructor(catchAll){
        this.firstName = faker.name.firstName()
        this.lastName = faker.name.lastName()
        this.email = this.firstName+this.lastName+faker.random.number(999)+'@'+catchAll
        this.password = generator.generate({
            length: 10,
            numbers: true
        })
        this.newAcc()
    }
    newAcc = async () => 
    {
        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage();
        await page.goto('https://www.target.com/account/orders');
        await page.waitForSelector('#createAccount')
        await page.click('#createAccount')
        await page.type('#username', this.email)
        await page.type('#firstname', this.firstName)
        await page.type('#lastname', this.lastName)
        await page.type('#password', this.password)
        await page.click('#createAccount')
        await browser.close();
        const acc = this.email+':'+this.password+':'+this.firstName+':'+this.lastName
        // signale.success('Generated acount')
        fs.appendFileSync('./settings/accounts', acc+'\n')
     };
}

const genAccs = async () => {
    const Run = require('../index.js')

    inquirer.prompt([
        {
            name: 'catchAll',
            type: 'input',
            message: 'Input Catchall (Do not include @)',
        },
        {
            name: 'numAccs',
            type: 'number',
            message: 'How Many Accounts?'
        }
    ]).then(answer => {        
        const catchAll = answer.catchAll
        signale.info('Generating',answer.numAccs,'Accounts')
        for(let i = 0; i < answer.numAccs; i++){
           new genAcc(catchAll)
        }
        Run()
    })
}



module.exports = { genAccs }
