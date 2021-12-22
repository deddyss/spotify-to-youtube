import { InputQuestionOptions } from 'inquirer';
import chalk from 'chalk';
import { prefix, suffix } from './options';

const DEFAULT_PORT = '9222';

const validate = (input?: string): boolean | string => {
	const port = input?.trim() ?? '';
	if (port.length === 0) {
		return 'You must provide port number';
	}

	const portNumber = parseInt(port, 10);
	// eslint-disable-next-line no-useless-escape
	const isValidPortNumber = portNumber >= 1024 && portNumber <= 65535;
	return isValidPortNumber || 'Invalid port number';
};

const chromeRemoteDebuggingPortQuestion: InputQuestionOptions = {
	type: 'input',
	name: 'chromeRemoteDebuggingPort',
	message: `What is the ${chalk.bold.yellow('remote debugging port')} number that you've set for Chrome browser`,
	default: DEFAULT_PORT,
	validate,
	suffix,
	prefix
};

export default chromeRemoteDebuggingPortQuestion;
