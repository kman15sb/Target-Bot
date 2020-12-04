const fs = require('fs')
const inquirer = require('inquirer');
const taskFile = require('../settings/tasks.json')

let names = []
taskFile.forEach(task => {
    names.push(task.name)
})

const editTask = async () => {
    const Run = require('../index.js')
    inquirer.prompt([
        {
            name: 'choseTask',
            type: 'list',
            message: 'Chose Task',
            choices: names
        },
        {
            name: 'newToken',
            type: 'input',
            message: 'Insert New Access Token'
        }
    ]).then(answer => {        
        const newTaskFile = []
        taskFile.filter(task => {
            if (task.name == answer.choseTask) {
                const newTask = {
                        "name": task.name,
                        "cookies": answer.newToken,
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

module.exports = editTask