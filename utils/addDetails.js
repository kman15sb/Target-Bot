const fs = require('fs')
const request = require('request-promise')
const inquirer = require('inquirer')
const clear = require('clear');
const chalk = require('chalk') 
const figlet = require('figlet');
const puppeteer = require('puppeteer')

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
        console.log('Fetching Access Token')
        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage()
        await page.goto('https://www.target.com/account/orders')
        await page.waitForSelector('#username')
        await page.type('#username', this.email)
        await page.type('#password', this.password)
        await page.click('#login')
        const cookies = await page.cookies()
        const accessTokenCookie = cookies.filter((cookie) => cookie.name == "accessToken");
        this.accessToken = accessTokenCookie[0].value; 
        const loginSessionCookie = cookies.filter((cookie) => cookie.name == "login-session");
        this.loginSession = loginSessionCookie[0].value; 
        await browser.close()
        console.log(this.accessToken)
        this.getDetails()
    }
    getDetails = async () => {
        clear()
        console.log(
            chalk.magenta(
                figlet.textSync('KmanAIO', {horizontalLayout: 'full'})
            )
        )
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
                name: 'phoneNumber',
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
        request({ 
            method: 'POST',
            url: `https://profile.target.com/WalletWEB/wallet/v5/tenders?type=PC`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
                'Cookie': `accessToken=${this.accessToken}`+'; '+`login-session=${this.loginSession}`
            },
            gzip: true,
            json: true,
            body: {
                "cardName": answer.cardName,
                "expiryMonth": answer.expiryMonth,
                "expiryYear": answer.expiryYear,
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
                "zipCode": answer.zipCode,
                "addressType": "R",
                "skipAddressValidation": true,
                "cardNumber": answer.cardNumber,
                "cardType": answer.cardType,
                "cardSubType": answer.cardType
            },
            resolveWithFullResponse: true
        })
    }   
}

module.exports = { 
    addDetails: async () => {
        new addDetails() 
    }
}