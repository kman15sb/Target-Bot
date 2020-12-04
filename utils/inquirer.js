const inquirer = require('inquirer');
const { startTasks } = require('../classes/Target');
const clear = require('clear');
const chalk = require('chalk') 
const figlet = require('figlet');
const { createTask } = require('./tasks');
const editTask = require('./editTasks')
const { genAccs } = require('./accGen.js')

module.exports = {
    whatDo: async () => {
    inquirer.prompt([
            {
            name: 'start',
            type: 'list',
            message: 'What do you want to do?',
            choices: ['Start Tasks', 'Create Tasks', 'Edit Task Access Token', 'Generate Accounts']
            },
        ])
        .then(answers => {
            if(answers.start == 'Start Tasks'){
                clear()
                console.log(
                    chalk.magenta(
                        figlet.textSync('KmanAIO', {horizontalLayout: 'full'})
                    )
                )
                console.log(chalk.magenta('Starting Tasks'))
                startTasks()
            } else if (answers.start == 'Create Tasks') {
                createTask()
            } else if (answers.start == 'Edit Task Access Token') {
                editTask()
            } else {
                genAccs()
            }
        });
    }
}