/**
 * @jest-environment jsdom
 */

import { Page } from 'puppeteer-core';
import Spotify from '@/api/spotify';
import { getAccessToken, getPlaylistLength, getPlaylistSongs, getPlaylistTitle } from '@/api/spotify/page';
import { readMockFile } from './util';

// fetch mock
let fetchIndex = 0;
global.fetch = jest.fn(() => {
	return Promise.resolve({
		json: () => {
			fetchIndex += 1;
			const jsonMock = readMockFile(`spotifyPlaylist.json.${fetchIndex}.mock`);
			return Promise.resolve(JSON.parse(jsonMock));
		}
	});
}) as jest.Mock;

const mockPage = {
	url: () => '',
	// eslint-disable-next-line
	goto: (url: string) => Promise.resolve(),
	// eslint-disable-next-line
	evaluate: (func: Function, ...args: [string | number]) => {
		const { name } = func;
		if (name === 'getAccessToken') {
			return Promise.resolve('');
		}
		else if (name === 'getPlaylistTitle') {
			return Promise.resolve('');
		}
		else if (name === 'getPlaylistLength') {
			return Promise.resolve('0');
		}
		else if (name === 'getPlaylistSongs') {
			return Promise.resolve([]);
		}
	}
} as unknown as Page;

describe('Spotify playlist', () => {
	beforeAll(() => {
		window.document.body.innerHTML = readMockFile('spotifyPlaylist.html.mock');
	});

	test('API', async () => {
		const stubApi = new Spotify(mockPage);
		const playlistUrl = 'https://open.spotify.com/playlist/1GwfqIvptzGH9obINoyTUz';
		const playlistTitle = await stubApi.getPlaylistTitle(playlistUrl);
		const playlistSongs = await stubApi.getPlaylistSongs(playlistUrl);

		expect(playlistTitle).toBe('');
		expect(playlistSongs.length).toBe(0);
	});

	test('Access token', () => {
		const accessToken = getAccessToken();
		expect(accessToken).toBeTruthy();
	});

	test('Playlist title', () => {
		const playlistTitle = getPlaylistTitle();
		expect(playlistTitle).toBe('Most Popular Song Each Month in the 2000s');
	});

	test('Playlist length', () => {
		const playlistLength = getPlaylistLength();
		expect(playlistLength).toBe(120);
	});

	test('Playlist songs', async () => {
		const playlistId = 'stubPlaylistId';
		const playlistLength = getPlaylistLength();
		const accessToken = getAccessToken();

		const songs = await getPlaylistSongs(playlistId, playlistLength, accessToken);
		expect(songs.length).toBe(playlistLength);
	});
});
