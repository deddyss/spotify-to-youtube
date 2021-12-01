import chalk from 'chalk';
import { CheckboxChoiceOptions, CheckboxQuestionOptions, Separator } from 'inquirer';
import { Answer, Song } from '@/types';
import { prefix } from './options';

const setPrefixNumber = (choices: CheckboxChoiceOptions[]): void => {
	const padLength = choices.length.toString().length;
	choices.forEach((choice: CheckboxChoiceOptions, index: number) => {
		const number = ((index + 1) + '').padStart(padLength, '0');
		choice.name = `${number}. ${choice.name}`;
	});
};

const songsToChoiceOptions = (songs: Song[]): CheckboxChoiceOptions[] => {
	const choices: any[] = [];
	songs.forEach((song: Song) => {
		choices.push({
			name: `${song.artists.join(', ')} - ${song.title}`,
			value: `${song.artists.join(', ')} - ${song.title}`,
			short: song.title
		} as CheckboxChoiceOptions);
	});
	setPrefixNumber(choices);
	choices.push(new Separator('─'.repeat(80)));
	return choices;
};

const message = (songs: Song[], playlistTitle: string): string => {
	return `There are ${chalk.bold.yellow(songs.length)} songs on the "${playlistTitle}" playlist. ` 
		+ `Please ${chalk.bold.yellow('select')} the ${chalk.bold.yellow('song')} you want to export to Youtube`;
};

const selectSongsQuestion = (songs: Song[], answer: Answer): CheckboxQuestionOptions<Answer> => ({
	type: 'checkbox',
	name: 'selectedSongs',
	message: message(songs, answer.spotifyPlaylistTitle),
	choices: songsToChoiceOptions(songs),
	suffix: chalk.bold.cyan('!'),
	validate: (input?: string[]) => {
		return input?.length === 0 ? 'You must select at least one song before continue' : true;
	},
	prefix
});

export default selectSongsQuestion;
