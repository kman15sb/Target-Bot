const inquirer = require('inquirer');
const { startTasks } = require('../classes/Target');
const clear = require('clear');
const chalk = require('chalk') 
const figlet = require('figlet');
const { createTask } = require('./tasks');
const editTask = require('./editTasks')

module.exports = {
    whatDo: async () => {
    inquirer.prompt([
            {
            name: 'start',
            type: 'list',
            message: 'What do you want to do?',
            choices: ['Start Tasks', 'Create Tasks', 'Edit Task Access Token']
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
            } else {
                editTask()
            }
        });
    }
}