import { Page } from 'puppeteer-core';
import { Video } from '@/types';
import { getTopVideos, userHasLoggedInToGoogle } from './page';
import { findBestVideo } from './util';

const YOUTUBE_URL = 'https://www.youtube.com';

class Youtube {
	private page: Page;

	constructor (page: Page) {
		this.page = page;
	}

	public async loggedIn(): Promise<boolean> {
		const feedLibraryUrl = YOUTUBE_URL + '/feed/library';
		await this.page.goto(feedLibraryUrl);

		return await this.page.evaluate(userHasLoggedInToGoogle);
	}

	public async search(keyword: string): Promise<Video | Array<Video>> {
		const searchUrl = YOUTUBE_URL + '/results?search_query=' + keyword.replace(/ /g, '+');
		await this.page.goto(searchUrl);

		const topVideos = await this.page.evaluate(getTopVideos, 3);
		const bestVideos = findBestVideo(topVideos);
		return bestVideos;
	}
}

export default Youtube;
