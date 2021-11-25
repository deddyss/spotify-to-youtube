import { prompt, QuestionCollection } from 'inquirer';
import { Browser, Page } from 'puppeteer-core';
import { close, launchBrowser } from '@/api/browser';
import Spotify from '@/api/spotify';
import { selectSongsQuestion, spotifyPlaylistUrlQuestion } from '@/cli/question';
import spinner from '@/cli/spinner';
import greeting from '@/cli/greeting';
import { Answer, Song } from '@/types';
import { sleep } from '@/util';

const showGreeting = async () => {
	console.clear();
	console.log(greeting);
	await sleep(500);
};

const ask = (questions: QuestionCollection, initialAnswer?: Answer): Promise<Answer> => {
	return prompt<Answer>(questions, initialAnswer);
};

const retrieveSpotifyPlaylistSongs = async (spotify: Spotify, answer: Answer): Promise<Array<Song>> => {
	spinner.start('Retrieving songs from Spotify playlist');
	const { spotifyPlaylistUrl } = answer;

	// set playlist title
	answer.spotifyPlaylistTitle = await spotify.getPlaylistTitle(spotifyPlaylistUrl);
	// get playlist songs
	const songs = await spotify.getPlaylistSongs(spotifyPlaylistUrl);

	spinner.stop();
	return songs;
};

const main = async () => {
	let answer = {} as Answer;
	let browser!: Browser, page!: Page;
	let spotify: Spotify;

	try {
		await showGreeting();

		// launch browser and get page
		({ browser, page } = await launchBrowser());

		// ask spotify playlist URL
		answer = await ask([ spotifyPlaylistUrlQuestion ], answer);

		// init spotify API
		spotify = new Spotify(page);

		const songs = await retrieveSpotifyPlaylistSongs(spotify, answer);

		// ask user to select some songs
		answer = await ask([selectSongsQuestion(songs, answer)], answer);

		console.log(answer.selectedSongs);
	}
	catch (error) {
		if (error) {
			console.log(error);
		}
	}
	finally {
		close({ page, browser });
	}
};

main();
