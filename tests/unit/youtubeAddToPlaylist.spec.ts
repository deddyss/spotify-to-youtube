/**
 * @jest-environment jsdom
 */

import { Page } from 'puppeteer-core';
import Youtube from '@/api/youtube';
import { mockInnerText, mockOffsetParent, readMockFile } from './util';
import { checkPlaylistCheckboxAtIndex, clickCreateNewPlaylistLink, clickCreatePlaylistLink, clickSaveToPlaylistMenu, clickVideoMenuAtIndex, closeAddToPlaylistDialog, getMyPlaylists, isPlaylistAlreadyCheckedAtIndex, playlistsDialogSelector, videoPopupMenuSelector } from '@/api/youtube/page';

const FIRST_PLAYLIST_NAME = 'first-playlist-name';
const SECOND_PLAYLIST_NAME = 'second-playlist-name';
const NONEXISTENT_PLAYLIST_NAME = 'nonexistent-playlist-name';

const mockPage = {
	// eslint-disable-next-line
	evaluate: (func: Function, ...args: [number]) => {
		const { name } = func;
		if (name === 'clickVideoMenuAtIndex' || name === 'clickSaveToPlaylistMenu'
			|| name === 'checkPlaylistCheckboxAtIndex' || name === 'closeAddToPlaylistDialog'
			|| name === 'clickCreateNewPlaylistLink' || name === 'clickCreatePlaylistLink'
		) {
			return Promise.resolve(true);
		}
		else if (name === 'getMyPlaylists') {
			return Promise.resolve([FIRST_PLAYLIST_NAME, SECOND_PLAYLIST_NAME]);
		}
		else if (name === 'isPlaylistAlreadyCheckedAtIndex') {
			const index = args[0] ?? 0;
			const isFirst = (index: number): boolean => index === 0;
			const result = isFirst(index) ? true : false;
			return Promise.resolve(result);
		}
	},
	focus: () => Promise.resolve(),
	keyboard: {
		type: () => Promise.resolve()
	},
	screenshot: () => Promise.resolve(),
	waitForSelector: () => Promise.resolve(),
	waitForTimeout: () => Promise.resolve(),
	waitForResponse: () => {
		const ok = () => true;
		return Promise.resolve({ ok });
	}
} as unknown as Page;

describe('Youtube playlist', () => {
	beforeAll(() => {
		mockOffsetParent();
		mockInnerText();
	});

	// test('API - playlist name exists and already checked', async () => {
	// 	const stubApi = new Youtube(mockPage);
	// 	const videoIndex = 0;
	// 	const result = await stubApi.addToPlaylist(videoIndex, FIRST_PLAYLIST_NAME);
	// 	expect(result).toBe(true);
	// });

	// test('API - playlist name exists and unchecked yet', async () => {
	// 	const stubApi = new Youtube(mockPage);
	// 	const videoIndex = 0;
	// 	const result = await stubApi.addToPlaylist(videoIndex, SECOND_PLAYLIST_NAME);
	// 	expect(result).toBe(true);
	// });

	test('API - playlist name does not exist yet', async () => {
		const stubApi = new Youtube(mockPage);
		const videoIndex = 0;
		const result = await stubApi.addToPlaylist(videoIndex, NONEXISTENT_PLAYLIST_NAME);
		expect(result).toBe(true);
	});

	test('Click video menu at specified index', () => {
		window.document.body.innerHTML = readMockFile('youtubeAddToPlaylist-clickVideoMenuAtIndex.html.mock');

		const result = clickVideoMenuAtIndex(0);
		expect(result).toBe(true);
	});

	test('Click "Save to playlist" menu', () => {
		window.document.body.innerHTML = readMockFile('youtubeAddToPlaylist-clickSaveToPlaylistMenu.html.mock');

		const result = clickSaveToPlaylistMenu(videoPopupMenuSelector);
		expect(result).toBe(true);
	});

	test('Get my playlists', () => {
		window.document.body.innerHTML = readMockFile('youtubeAddToPlaylist-myPlaylistsDialog.html.mock');

		const playlists = getMyPlaylists(playlistsDialogSelector);
		expect(playlists.length).toBeGreaterThan(0);
	});

	test('Is playlist already checked at specified index?', () => {
		window.document.body.innerHTML = readMockFile('youtubeAddToPlaylist-myPlaylistsDialog.html.mock');

		expect(isPlaylistAlreadyCheckedAtIndex(0)).toBe(false);
		expect(isPlaylistAlreadyCheckedAtIndex(1)).toBe(true);
	});

	test('Check playlist at specified index', () => {
		window.document.body.innerHTML = readMockFile('youtubeAddToPlaylist-myPlaylistsDialog.html.mock');

		const result = checkPlaylistCheckboxAtIndex(2);
		expect(result).toBe(true);
	});

	test('Close playlist dialog', () => {
		window.document.body.innerHTML = readMockFile('youtubeAddToPlaylist-myPlaylistsDialog.html.mock');

		const result = closeAddToPlaylistDialog();
		expect(result).toBe(true);
	});

	test('Click "Create new playlist" link', () => {
		window.document.body.innerHTML = readMockFile('youtubeAddToPlaylist-myPlaylistsDialog.html.mock');

		const result = clickCreateNewPlaylistLink();
		expect(result).toBe(true);
	});

	test('Click "Create" link after enter playlist name', () => {
		window.document.body.innerHTML = readMockFile('youtubeAddToPlaylist-enterPlaylistName.html.mock');

		const result = clickCreatePlaylistLink();
		expect(result).toBe(true);
	});


});
