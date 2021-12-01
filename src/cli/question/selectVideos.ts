import { ChoiceOptions, ListQuestionOptions } from 'inquirer';
import { Answer, YoutubeVideoAnswer } from '@/types';
import { prefix, suffix } from './options';

const choices = (): ChoiceOptions[] => {
	return [
		{ value: 0, name: '1st video' },
		{ value: 1, name: '2nd video' },
		{ value: -1, name: 'none, just skip this song' }
	];
};

const selectVideosQuestion = (song: string): ListQuestionOptions<YoutubeVideoAnswer> => ({
	type: 'list',
	name: 'index',
	message: `Which video do you choose for song "${song}"`,
	choices,
	prefix,
	suffix
});

export default selectVideosQuestion;
