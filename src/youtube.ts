import { prompt } from 'inquirer';
import Youtube from '@/api/youtube';
import spinner from '@/cli/spinner';
import showVideoTable from '@/cli/video/table';
import { Video } from '@/types';
import { printNewLine, random, sleep } from '@/util';
import selectVideosQuestion from './cli/question/selectVideos';

class YoutubeProcessor {
	private api: Youtube;
	private songs: string[];
	private counter: number;
	private total: number;
	private padLength: number;

	constructor (api: Youtube, songs: string[]) {
		this.api = api;
		this.songs = songs;
		this.counter = 0;
		this.total = songs.length;
		this.padLength = songs.length.toString().length;
	}

	public async process(): Promise<void> {
		printNewLine();
		for (let index = 0; index < this.songs.length; index += 1) {
			const song = this.songs[index];
			await this.search(song);
		}
	}

	private async search(song: string) {
		const video = await this.api.search(song);
		if (Array.isArray(video)) {
			await this.askUserToSelectVideos(video, song);
		}
		else {
			await this.addVideoToPlaylist(video);
		}	
	}

	private async askUserToSelectVideos(videos: Array<Video>, song: string) {
		await showVideoTable(videos);

		const answer = await prompt([selectVideosQuestion(song)]);
		const videoIndex = answer.index ?? -1;
		// check answer
		if (videoIndex >= 0) {
			await this.addVideoToPlaylist(videos[videoIndex]);
		}
		else {
			const index = this.incrementAndGetCounterIndex();
			spinner.fail(`(${index}/${this.total}) ${song} (skipped)`);
		}
	}

	private async addVideoToPlaylist(video: Video) {
		const index = this.incrementAndGetCounterIndex();
		spinner.start(`(${index}/${this.total}) ${video.title}`);
		await sleep(random(1_000, 3_000));
		spinner.succeed();
	}

	private incrementAndGetCounterIndex() {
		this.counter += 1;
		const index = (this.counter + '').padStart(this.padLength, '0');
		return index;
	}
}

export default YoutubeProcessor;
