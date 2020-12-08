const fs = require('fs')
const request = require('request-promise')
const inquirer = require('inquirer')
const clear = require('clear');
const chalk = require('chalk') 
const figlet = require('figlet');
const puppeteer = require('puppeteer')
const signale = require('signale')

class addDetails {
    constructor(){
        this.accessToken = ''     
        this.getTokens()
    }
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
            headless: false
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
        this.getDetails()
    }
    getDetails = async () => {
        clear()
        console.log(
            chalk.magenta(
                figlet.textSync('KmanAIO', {horizontalLayout: 'full'})
            )
        )
        console.log(this.accessToken)
        inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'Input First Name',
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'Insert Last Name'
            },
            {
                name: 'addressLine1',
                type: 'input',
                message: 'Insert Address Line 1'
            },
            {
                name: 'addressLine2',
                type: 'input',
                message: 'Insert Address Line 2 (if need not apply press enter)'
            },
            {
                name: 'country',
                type: 'input',
                message: 'Insert Country (Ex. US)'
            },
            {
                name: 'state',
                type: 'input',
                message: 'Insert State (Ex. CA)'
            },
            {
                name: 'city',
                type: 'input',
                message: 'Insert City'
            },
            {
                name: 'zipcode',
                type: 'number',
                message: 'Insert Zipcode'
            },
            {
                name: 'phone',
                type: 'number',
                message: 'Insert Phone Number'
            },
            {
                name: 'cardName',
                type: 'input',
                message: 'Insert Name on Card'
            },
            {
                name: 'cardType',
                type: 'choice',
                message: 'Select Card Type',
                choices: ['Visa', 'mastercard']
            },
            {
                name: 'cardNumber',
                type: 'number',
                message: 'Insert Card Number'
            },
            {
                name: 'expMonth',
                type: 'number',
                message: 'Insert Expiry Month (do not add 0 infront of number)'
            },
            {
                name: 'expYear',
                type: 'number',
                message: 'Insert Expiry Year (Ex. 2020)'
            },
            {
                name: 'defaultPayment',
                type: 'confirm',
                message: 'Would You Like This To Be Your Default Payment Method?'
            }
        ]).then(answer => {
            this.addDetail(answer)
        })
    }
    async addDetail (answer) {
        const Run = require('../index.js')
        request({ 
            method: 'POST',
            url: `https://profile.target.com/WalletWEB/wallet/v5/tenders?type=PC`,
            headers: {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36',
                'cookie': `accessToken=${this.accessToken};`,
                'content-type': 'application/json'
            },
            gzip: true,
            json: true,
            body: {
                "cardName": answer.cardName,
                "expiryMonth": answer.expMonth,
                "expiryYear": answer.expYear,
                "defaultPayment": answer.defaultPayment,
                "shiptCard": false,
                "firstName": answer.firstName,
                "lastName": answer.lastName,
                "addressLine1": answer.addressLine1,
                "addressLine2": answer.addressLine2,
                "country": answer.country,
                "phone": answer.phone,
                "state": answer.state,
                "city": answer.city,
                "zipCode": answer.zipcode,
                "addressType": "R",
                "skipAddressValidation": true,
                "cardNumber": answer.cardNumber,
                "cardType": answer.cardType,
                "cardSubType": answer.cardType
            },
            resolveWithFullResponse: true
        }).then(() => {
            signale.success('Details Added Successfuly')
            Run()
        })
    }   
}

module.exports = { 
    addDetails: async () => {
        new addDetails() 
    }
}