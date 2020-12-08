const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer  = require('./utils/inquirer.js');

const Run = async () => {
    clear();

    console.log(
        chalk.magenta(
            figlet.textSync('KmanAIO', {horizontalLayout: 'full'})
        )
    )
    const whatDo = await inquirer.whatDo();
    return whatDo
};
  
Run();

module.exports = { Run }