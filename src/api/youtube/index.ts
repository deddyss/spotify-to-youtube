import { Page } from 'puppeteer-core';
import { Video } from '@/types';
import { checkPlaylistCheckboxAtIndex, clickSaveToPlaylistMenu, clickVideoMenuAtIndex, getEditPlaylistResponse, getAddToPlaylistResponse, getMyPlaylists, getTopVideos, isPlaylistAlreadyCheckedAtIndex, userHasLoggedInToGoogle, closeAddToPlaylistDialog, clickCreateNewPlaylistLink, enterPlaylistNameAndClickCreateLink, getCreatePlaylistResponse } from './page';
import { findBestVideo } from './util';

const YOUTUBE_URL = 'https://www.youtube.com';
const VISIBILITY_DELAY = 250;

class Youtube {
	private page: Page;

	constructor (page: Page) {
		this.page = page;
	}

	public async loggedIn(): Promise<boolean> {
		const url = YOUTUBE_URL;
		await this.page.goto(url);

		return await this.page.evaluate(userHasLoggedInToGoogle);
	}

	public async search(song: string): Promise<Video | Array<Video>> {
		const searchUrl = YOUTUBE_URL + '/results?search_query=' + song.replace(/ /g, '+');
		await this.page.goto(searchUrl, { waitUntil: 'networkidle2' });

		const topVideos = await this.page.evaluate(getTopVideos, 4);
		const bestVideos = findBestVideo(topVideos);
		return bestVideos;
	}

	public async addToPlaylist(videoIndex: number, playlistTitle: string): Promise<boolean> {
		const videoMenuClicked = await this.page.evaluate(clickVideoMenuAtIndex, videoIndex);
		if (!videoMenuClicked) {
			return false;
		}
		await this.page.waitForTimeout(VISIBILITY_DELAY);

		const [ addToPlaylistResponse, saveToPlaylistMenuClicked ] = await Promise.all([
			this.page.waitForResponse(getAddToPlaylistResponse),
			this.page.evaluate(clickSaveToPlaylistMenu)
		]);
		if (!saveToPlaylistMenuClicked || !addToPlaylistResponse.ok()) {
			return false;
		}

		let result = true;
		const playlists: Array<string> = await this.page.evaluate(getMyPlaylists);
		// expected playlist exists
		if (playlists.includes(playlistTitle)) {
			const playlistIndex = playlists.indexOf(playlistTitle);
			const playlistChecked = await this.page.evaluate(isPlaylistAlreadyCheckedAtIndex, playlistIndex);
			if (!playlistChecked) {
				const [ editPlaylistResponse, playlistChecked ] = await Promise.all([
					this.page.waitForResponse(getEditPlaylistResponse),
					this.page.evaluate(checkPlaylistCheckboxAtIndex, playlistIndex)
				]);
				// override result
				result = playlistChecked && editPlaylistResponse.ok();
			}
			await this.page.evaluate(closeAddToPlaylistDialog);
		}
		// playlist does not exist, yet
		else {
			await this.page.evaluate(clickCreateNewPlaylistLink);
			await this.page.waitForTimeout(VISIBILITY_DELAY);
			
			const [ createPlaylistResponse, playlistNameEnteredAndCreateLinkClicked ] = await Promise.all([
				this.page.waitForResponse(getCreatePlaylistResponse),
				this.page.evaluate(enterPlaylistNameAndClickCreateLink, playlistTitle)
			]);
			// override result
			result = playlistNameEnteredAndCreateLinkClicked && createPlaylistResponse.ok();
		}

		return result;
	}
}

export default Youtube;
