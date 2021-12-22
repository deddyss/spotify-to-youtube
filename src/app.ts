import { prompt, QuestionCollection } from 'inquirer';
import { Page } from 'puppeteer-core';
import { close, connectBrowser, getBrowserWebSocketEndpoint } from '@/api/browser';
import Spotify from '@/api/spotify';
import Youtube from '@/api/youtube';
import greeting from '@/cli/greeting';
import spotifyPlaylistUrlQuestion from '@/cli/question/spotifyPlaylistUrl';
import spotifySelectSongsQuestion from '@/cli/question/spotifySelectSongs';
import youtubePlaylistTitleQuestion from '@/cli/question/youtubePlaylistTitle';
import chromeRemoteDebuggingPortQuestion from '@/cli/question/chromeRemoteDebuggingPort';
import spinner from '@/cli/spinner';
import retrieveSpotifyPlaylistSongs from '@/spotify';
import YoutubeProcessor from '@/youtube';
import { Answer } from '@/types';
import { sleep } from '@/util';

const showGreeting = async () => {
	console.clear();
	console.log(greeting);
	await sleep(500);
};

const ask = (questions: QuestionCollection, initialAnswer?: Answer): Promise<Answer> => {
	return prompt<Answer>(questions, initialAnswer);
};

const main = async () => {
	let answer = {} as Answer;
	let page!: Page;
	let spotify: Spotify;
	let youtube: Youtube;
	let youtubeProcessor: YoutubeProcessor;

	try {
		await showGreeting();

		// ask chrome remote debugging port
		answer = await ask([ chromeRemoteDebuggingPortQuestion ], answer);
		// get browser websocket endpoint
		const websocketEndpoint = await getBrowserWebSocketEndpoint(answer.chromeRemoteDebuggingPort);
		if (websocketEndpoint === undefined) {
			spinner.fail('Cannot access Chrome via the provided remote debugging port');
			return;
		}

		// connect browser
		page = await connectBrowser(websocketEndpoint);

		// ask spotify playlist URL
		answer = await ask([ spotifyPlaylistUrlQuestion ], answer);

		// init spotify API
		spotify = new Spotify(page);

		const songs = await retrieveSpotifyPlaylistSongs(spotify, answer);

		// ask user to select some songs and type playlist title
		answer = await ask(
			[
				spotifySelectSongsQuestion(songs, answer.spotifyPlaylistTitle),
				youtubePlaylistTitleQuestion(answer.spotifyPlaylistTitle)
			],
			answer
		);

		// init youtube API
		youtube = new Youtube(page);

		const loggedInToYoutube = await youtube.loggedIn();
		if (!loggedInToYoutube) {
			spinner.fail('Cannot proceed because you are not logged into Youtube');
			return;
		}

		youtubeProcessor = new YoutubeProcessor(
			youtube, answer.spotifySelectedSongs, answer.youtubePlaylistTitle
		);
		await youtubeProcessor.run();
	}
	catch (error) {
		if (error) {
			console.log(error);
		}
	}
	finally {
		close({ page });
	}
	process.exit();
};

main();
