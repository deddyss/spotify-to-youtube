import { InputQuestionOptions } from 'inquirer';
import chalk from 'chalk';
import { prefix } from './options';

const URL_REGEX_1 = /^http[s]*:\/\/open.spotify.com\/playlist\/[a-zA-Z0-9]+[?]*.*$/gi;
const URL_REGEX_2 = /^http[s]*:\/\/spoti.fi\/[a-zA-Z0-9]+[?]*.*$/gi;

const validate = (url: string): boolean => {
	return URL_REGEX_1.test(url) || URL_REGEX_2.test(url);
};

const spotifyPlaylistUrlQuestion: InputQuestionOptions = {
	type: 'input',
	name: 'spotifyPlaylistUrl',
	message: `Type or paste the ${chalk.bold.yellow('Spotify playlist URL')} here`,
	validate: (input?: string) => {
		if (input) {
			return validate(input) || 'Invalid Spotify playlist URL';
		}
		return 'You must provide Spotify playlist URL before proceeding';
	},
	suffix: chalk.bold.cyan(':'),
	prefix
};

export default spotifyPlaylistUrlQuestion;
