import { prompt } from 'inquirer';
import Youtube from '@/api/youtube';
import spinner from '@/cli/spinner';
import showVideoTable from '@/cli/video/table';
import { Video } from '@/types';
import { printNewLine, random, sleep } from '@/util';
import youtubeSelectVideoQuestion from './cli/question/youtubeSelectVideos';

class YoutubeProcessor {
	private api: Youtube;
	private songs: string[];
	private playlistTitle: string;
	private counter: number;
	private total: number;
	private padLength: number;

	constructor (api: Youtube, songs: string[], playlistTitle: string) {
		this.api = api;
		this.songs = songs;
		this.playlistTitle = playlistTitle;
		this.counter = 0;
		this.total = songs.length;
		this.padLength = songs.length.toString().length;
	}

	public async run(): Promise<void> {
		printNewLine();
		for (let index = 0; index < this.songs.length; index += 1) {
			const song = this.songs[index];

			const video = await this.api.search(song);
			if (Array.isArray(video)) {
				await this.askUserToSelectVideos(video, song);
			}
			else {
				await this.addVideoToPlaylist(video);
			}
			await sleep(random(150, 450));
		}
	}

	private async askUserToSelectVideos(videos: Array<Video>, song: string) {
		await showVideoTable(videos);

		const answer = await prompt([youtubeSelectVideoQuestion(song)]);
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

		const added = await this.api.addToPlaylist(video.index, this.playlistTitle);
		if (added) {
			spinner.succeed();
		}
		else {
			spinner.fail();
		}
	}

	private incrementAndGetCounterIndex() {
		this.counter += 1;
		const index = (this.counter + '').padStart(this.padLength, '0');
		return index;
	}
}

export default YoutubeProcessor;
