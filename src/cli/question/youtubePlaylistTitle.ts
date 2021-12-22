import { InputQuestionOptions } from 'inquirer';
import chalk from 'chalk';
import { Answer } from '@/types';
import { prefix } from './options';

const validate = (input?: string): boolean | string => {
	const title = input?.trim() ?? '';
	if (title.length === 0) {
		return 'You must provide playlist title';
	}
	else if (title.length > 150) {
		return 'Use 150 characters or less';
	}

	// eslint-disable-next-line no-useless-escape
	const isInputValid = /^[ a-zA-Z0-9.,\/?;:"'`~!@#$%^&*()\[\]{}_+=|\\-]+$/.test(title);
	return isInputValid || 'Invalid playlist title';
};

const youtubePlaylistTitleQuestion = (defaultPlaylistTitle: string): InputQuestionOptions<Answer> => ({
	type: 'input',
	name: 'youtubePlaylistTitle',
	default: defaultPlaylistTitle,
	message: `Save selected songs to ${chalk.bold.yellow('Youtube playlist')} with ${chalk.bold.yellow('title')}`,
	suffix: chalk.bold.cyan(':'),
	prefix,
	validate
});

export default youtubePlaylistTitleQuestion;
