import { prompt, QuestionCollection } from 'inquirer';
import { Browser, Page } from 'puppeteer-core';
import { close, launchBrowser } from '@/api/browser';
import Spotify from '@/api/spotify';
import Youtube from '@/api/youtube';
import greeting from '@/cli/greeting';
import selectSongsQuestion from '@/cli/question/selectSongs';
import spotifyPlaylistUrlQuestion from '@/cli/question/spotifyPlaylistUrl';
import { Answer } from '@/types';
import { sleep } from '@/util';
import retrieveSpotifyPlaylistSongs from '@/spotify';
import YoutubeProcessor from '@/youtube';

const showGreeting = async () => {
	console.clear();
	console.log(greeting);
	await sleep(500);
};

const ask = (questions: QuestionCollection, initialAnswer?: Answer): Promise<Answer> => {
	return prompt<Answer>(questions, initialAnswer);
};

// TODO:
// const userHasLoggedInToYoutube = async(youtube: Youtube, answer: Answer): Promise<boolean> => {
// 	spinner.start('Checking Youtube feed library');

// 	const loggedIn = await youtube.loggedIn();

// 	spinner.stop();
// 	return loggedIn;
// };

const main = async () => {
	let answer = {} as Answer;
	let browser!: Browser, page!: Page;
	let spotify: Spotify;
	let youtube: Youtube;
	let youtubeProcessor: YoutubeProcessor;

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

		// init youtube API and its processor
		youtube = new Youtube(page);
		youtubeProcessor = new YoutubeProcessor(youtube, answer.selectedSongs);

		await youtubeProcessor.process();

		// // TODO: test only
		// const toBeWritten: Record<string, Video | Array<Video>> = {};
		// for (let index = 0; index < answer.selectedSongs.length; index += 1) {
		// 	const song = answer.selectedSongs[index];
		// 	const videos = await youtube.search(song);
		// 	toBeWritten[song] = videos;
		// 	console.log(videos);
		// 	await sleep(random(1000, 3000));
		// }
		// const filepath = path.join(__dirname, 'youtube_search_result.json');
		// fs.writeFileSync(filepath, JSON.stringify(toBeWritten), { encoding: 'utf-8' });
		// console.log('DONE');
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
