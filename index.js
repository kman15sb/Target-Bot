const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const files = require('./lib/files');
const inquirer  = require('./lib/inquirer');
const { startTasks } = require('./classes/Target');

clear();

console.log(
    chalk.magenta(
        figlet.textSync('KmanAIO', {horizontalLayout: 'full'})
    )
)
const run = async () => {
    const whatDo = await inquirer.whatDo();
    return whatDo
  };
  
  run();