/**
 * @jest-environment jsdom
 */

import { Page } from 'puppeteer-core';
import Youtube from '@/api/youtube';
import { userHasLoggedInToGoogle } from '@/api/youtube/page';
import { readFile } from './util';

const mockPage = {
	// eslint-disable-next-line
	goto: (url: string) => Promise.resolve(),
	// eslint-disable-next-line
	evaluate: (func: Function, ...args: [string | number]) => {
		const { name } = func;
		if (name === 'userHasLoggedInToGoogle') {
			return Promise.resolve(true);
		}
	}
} as unknown as Page;

describe('Youtube feed library', () => {
	test('API', async () => {
		const stubApi = new Youtube(mockPage);
		const loggedIn = await stubApi.loggedIn();

		expect(loggedIn).toBe(true);
	});

	test('Logged-in', () => {
		window.document.body.innerHTML = readFile('youtubeFeedLibrary-loggedIn.html.mock');

		const loggedIn = userHasLoggedInToGoogle();
		expect(loggedIn).toBe(true);
	});

	test('Not logged-in', () => {
		window.document.body.innerHTML = readFile('youtubeFeedLibrary-notLoggedIn.html.mock');

		const loggedIn = userHasLoggedInToGoogle();
		expect(loggedIn).toBe(false);
	});

});
