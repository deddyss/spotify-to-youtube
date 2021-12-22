import chalk from 'chalk';

const greeting = `${chalk.bold('='.repeat(81))}\n`
	+ 'Before proceeding, make sure you:\n'
	+ `1. Open Chrome browser with ${chalk.bold.yellow('remote debugging enabled')} on specified port, i.e: 9222\n`
	+ `2. ${chalk.bold.yellow('Login')} to Youtube or Google\n` 
	+ `3. ${chalk.bold.yellow('Split the screen')} vertically:\n`
	+ '   a. Snap the Chrome window to the screen\'s top: Window key + up arrow\n'
	+ '   b. Snap this app window to the screen\'s bottom: Window key + down arrow\n'
	+ `${chalk.bold('='.repeat(81))}\n`;

export default greeting;
