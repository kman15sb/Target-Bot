const fs = require('fs')
const inquirer = require('inquirer');

module.exports = { 
    createTask: async () => {
        const Run = require('../index.js')
        inquirer.prompt([
            {
                name: 'profileName',
                type: 'input',
                message: 'Input Task Name'
            },
            {
                name: 'accessToken',
                type: 'input',
                message: 'Input Access Token'      
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
            let data = {
                "name": answer.profileName,
                "cookies": answer.accessToken,
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