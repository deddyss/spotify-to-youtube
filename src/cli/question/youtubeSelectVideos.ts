import { ChoiceOptions, ListQuestionOptions } from 'inquirer';
import { YoutubeVideoAnswer } from '@/types';
import { prefix, suffix } from './options';

const choices = (): ChoiceOptions[] => {
	return [
		{ value: 0, name: '1st video' },
		{ value: 1, name: '2nd video' },
		{ value: -1, name: 'none, just skip this song' }
	];
};

const youtubeSelectVideoQuestion = (song: string): ListQuestionOptions<YoutubeVideoAnswer> => ({
	type: 'list',
	name: 'index',
	message: `Which video do you choose for song "${song}"`,
	choices,
	prefix,
	suffix
});

export default youtubeSelectVideoQuestion;
