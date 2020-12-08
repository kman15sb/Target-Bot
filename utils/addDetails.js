const fs = require('fs')
const request = require('request-promise')
const inquirer = require('inquirer')
const { getToken } = require('./getAccessToken')

class addDetails {
    constructor(){
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
                message: 'Input Account Password'
            }
        ]).then(answer => {
            getToken(answer.email, answer.password)
        })
    }
    getDetails = async () => {
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
    async addDetail () {
        request({ 
            method: 'POST',
            url: `https://profile.target.com/WalletWEB/wallet/v5/tenders?type=PC`,
            proxy,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
                'Cookie': cookies
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