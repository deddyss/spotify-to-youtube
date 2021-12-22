import { Page } from 'puppeteer-core';
import { Video } from '@/types';
import { checkPlaylistCheckboxAtIndex, clickSaveToPlaylistMenu, clickVideoMenuAtIndex, getEditPlaylistResponse, getAddToPlaylistResponse, getMyPlaylists, getTopVideos, isPlaylistAlreadyCheckedAtIndex, userHasLoggedInToGoogle, closeAddToPlaylistDialog, clickCreateNewPlaylistLink, getCreatePlaylistResponse, enterPlaylistNameSelector, clickCreatePlaylistLink, videoPopupMenuSelector, playlistsDialogSelector } from './page';
import { findBestVideo } from './util';

const YOUTUBE_URL = 'https://www.youtube.com';

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
		await this.page.bringToFront();

		const topVideos = await this.page.evaluate(getTopVideos, 4);
		const bestVideos = findBestVideo(topVideos);
		return bestVideos;
	}

	public async addToPlaylist(videoIndex: number, playlistTitle: string): Promise<boolean> {
		const videoMenuClicked = await this.page.evaluate(clickVideoMenuAtIndex, videoIndex);
		if (!videoMenuClicked) {
			return false;
		}
		await this.page.waitForSelector(videoPopupMenuSelector, { visible: true });

		const [ addToPlaylistResponse, saveToPlaylistMenuClicked ] = await Promise.all([
			this.page.waitForResponse(getAddToPlaylistResponse),
			this.page.evaluate(clickSaveToPlaylistMenu, videoPopupMenuSelector)
		]);
		if (!saveToPlaylistMenuClicked || !addToPlaylistResponse.ok()) {
			return false;
		}

		let result = true;
		await this.page.waitForSelector(playlistsDialogSelector, { visible: true });
		const playlists: Array<string> = await this.page.evaluate(getMyPlaylists, playlistsDialogSelector);

		// expected playlist exists
		if (playlists.includes(playlistTitle)) {
			const playlistIndex = playlists.indexOf(playlistTitle);
			const isPlaylistChecked = await this.page.evaluate(isPlaylistAlreadyCheckedAtIndex, playlistIndex);
			if (!isPlaylistChecked) {
				const [ editPlaylistResponse, playlistChecked ] = await Promise.all([
					this.page.waitForResponse(getEditPlaylistResponse),
					this.page.evaluate(checkPlaylistCheckboxAtIndex, playlistIndex)
				]);
				result = playlistChecked && editPlaylistResponse.ok();
			}
			await this.page.evaluate(closeAddToPlaylistDialog);
		}
		// playlist does not exist, yet
		else {
			await this.page.evaluate(clickCreateNewPlaylistLink);
			// enter playlist name
			await this.page.waitForSelector(enterPlaylistNameSelector);
			await this.page.focus(enterPlaylistNameSelector);
			await this.page.keyboard.type(playlistTitle, { delay: 5 });

			const [ createPlaylistResponse, createPlaylistLinkClicked ] = await Promise.all([
				this.page.waitForResponse(getCreatePlaylistResponse),
				this.page.evaluate(clickCreatePlaylistLink)
			]);
			// override result
			result = createPlaylistLinkClicked && createPlaylistResponse.ok();
		}
		return result;
	}
}

export default Youtube;
