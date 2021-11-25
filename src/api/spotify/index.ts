import { Page } from 'puppeteer-core';
import { Song } from '@/types';
import { getAccessToken, getPlaylistLength, getPlaylistSongs, getPlaylistTitle } from './page';

class Spotify {
	private page: Page;

	constructor (page: Page) {
		this.page = page;
	}

	public async getPlaylistTitle(playlistUrl: string): Promise<string> {
		if (this.page.url() !== playlistUrl) {
			await this.page.goto(playlistUrl, { waitUntil: 'domcontentloaded' });
		}

		const playlistTitle = await this.page.evaluate(getPlaylistTitle);
		return playlistTitle;
	}

	public async getPlaylistSongs(playlistUrl: string): Promise<Array<Song>> {
		if (this.page.url() !== playlistUrl) {
			await this.page.goto(playlistUrl, { waitUntil: 'domcontentloaded' });
		}

		const playlistId = this.getPlaylistId(playlistUrl);
		const playlistLength = await this.page.evaluate(getPlaylistLength);
		const accessToken = await this.page.evaluate(getAccessToken);
		const songs: Array<Song> = await this.page.evaluate(getPlaylistSongs, playlistId, playlistLength, accessToken);

		return songs;
	}

	private getPlaylistId(playlistUrl: string): string {
		const url = new URL(playlistUrl);
		const { pathname } = url;
		const segments = pathname.split('/');
		return segments[segments.length - 1];
	}
}

export default Spotify;
