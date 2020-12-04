const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer  = require('./utils/inquirer.js');

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