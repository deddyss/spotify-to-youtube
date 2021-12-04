/**
 * @jest-environment jsdom
 */

import { Page } from 'puppeteer-core';
import Youtube from '@/api/youtube';
import { Video } from '@/types';
import { mockInnerText, mockOffsetParent, readMockFile } from './util';
import { checkPlaylistCheckboxAtIndex, clickCreateNewPlaylistLink, clickSaveToPlaylistMenu, clickVideoMenuAtIndex, closeAddToPlaylistDialog, enterPlaylistNameAndClickCreateLink, getMyPlaylists, isPlaylistAlreadyCheckedAtIndex } from '@/api/youtube/page';

const PLAYLIST_NAME_EXISTS_EVEN_INDEX = 'playlist-name-exists-even-index';
const PLAYLIST_NAME_EXISTS_ODD_INDEX = 'playlist-name-exists-odd-index';
const PLAYLIST_NAME_NOT_EXISTS = 'playlist-name-not-exists';
const mockPage = {
	// eslint-disable-next-line
	evaluate: (func: Function, ...args: [number]) => {
		const { name } = func;
		if (name === 'clickVideoMenuAtIndex' || name === 'clickSaveToPlaylistMenu'
			|| name === 'checkPlaylistCheckboxAtIndex' || name === 'closeAddToPlaylistDialog'
			|| name === 'clickCreateNewPlaylistLink' || name === 'enterPlaylistNameAndClickCreateLink'
		) {
			return Promise.resolve(true);
		}
		else if (name === 'getMyPlaylists') {
			return Promise.resolve([PLAYLIST_NAME_EXISTS_EVEN_INDEX, PLAYLIST_NAME_EXISTS_ODD_INDEX]);
		}
		else if (name === 'isPlaylistAlreadyCheckedAtIndex') {
			const index = args[0] ?? 0;
			const result = index % 2 === 0 ? true : false;
			return Promise.resolve(result);
		}
	},
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

	test('API - playlist name exists and already checked', async () => {
		const stubApi = new Youtube(mockPage);
		const videoIndex = 0;
		const result = await stubApi.addToPlaylist(videoIndex, PLAYLIST_NAME_EXISTS_EVEN_INDEX);
		expect(result).toBe(true);
	});

	test('API - playlist name exists and unchecked yet', async () => {
		const stubApi = new Youtube(mockPage);
		const videoIndex = 0;
		const result = await stubApi.addToPlaylist(videoIndex, PLAYLIST_NAME_EXISTS_ODD_INDEX);
		expect(result).toBe(true);
	});

	test('API - playlist name does not exist yet', async () => {
		const stubApi = new Youtube(mockPage);
		const videoIndex = 0;
		const result = await stubApi.addToPlaylist(videoIndex, PLAYLIST_NAME_NOT_EXISTS);
		expect(result).toBe(true);
	});

	test('Click video menu at specified index', () => {
		window.document.body.innerHTML = readMockFile('youtubeAddToPlaylist-clickVideoMenuAtIndex.html.mock');

		const result = clickVideoMenuAtIndex(0);
		expect(result).toBe(true);
	});

	test('Click "Save to playlist" menu', () => {
		window.document.body.innerHTML = readMockFile('youtubeAddToPlaylist-clickSaveToPlaylistMenu.html.mock');

		const result = clickSaveToPlaylistMenu();
		expect(result).toBe(true);
	});

	test('Get my playlists', () => {
		window.document.body.innerHTML = readMockFile('youtubeAddToPlaylist-myPlaylistsDialog.html.mock');

		const playlists = getMyPlaylists();
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

	test('Enter playlist name and click "Create" link', () => {
		window.document.body.innerHTML = readMockFile('youtubeAddToPlaylist-enterPlaylistName.html.mock');

		const result = enterPlaylistNameAndClickCreateLink('a-playlist-name');
		expect(result).toBe(true);
	});


});
