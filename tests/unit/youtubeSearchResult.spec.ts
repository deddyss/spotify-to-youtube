/**
 * @jest-environment jsdom
 */

import { Page } from 'puppeteer-core';
import Youtube from '@/api/youtube';
import { getTopVideos } from '@/api/youtube/page';
import { Video } from '@/types';
import { readFile } from './util';
import { findBestVideo } from '@/api/youtube/util';

const mockPage = {
	// eslint-disable-next-line
	goto: (url: string) => Promise.resolve(),
	// eslint-disable-next-line
	evaluate: (func: Function, ...args: [string | number]) => {
		const { name } = func;
		if (name === 'getTopVideos') {
			const topVideos = readFile('youtubeSearchResult.json.mock');
			return Promise.resolve(JSON.parse(topVideos) as Array<Video>);
		}
	}
} as unknown as Page;

describe('Youtube search result', () => {
	test('API', async () => {
		const stubApi = new Youtube(mockPage);
		const videos = await stubApi.search('Christina Aguilera - What A Girl Wants');

		// expect to return single video object only
		expect(Array.isArray(videos)).toBe(false);
	});

	test('Top videos', () => {
		window.document.body.innerHTML = readFile('youtubeSearchResult.html.mock');

		const videos = getTopVideos(3);
		expect(videos.length).toBe(3);
	});

	test('Best video - One verified video', () => {
		const topVideos = readFile('youtubeSearchResult.bestVideo-oneVerifiedVideos.json.mock');

		const bestVideo = findBestVideo(JSON.parse(topVideos) as Array<Video>);
		// expect to return single video object only, not array
		expect(Array.isArray(bestVideo)).toBe(false);
	});

	test('Best video - Two verified videos and one of it contains "Official" & "Video" word', () => {
		const topVideos = readFile('youtubeSearchResult.bestVideo-twoVerifiedVideosAndContainsOfficialVideo.json.mock');

		const bestVideo = findBestVideo(JSON.parse(topVideos) as Array<Video>);
		// expect to return single video object only, not array
		expect(Array.isArray(bestVideo)).toBe(false);
	});

	test('Best video - Two verified videos and don\'t contains "Official" & "Video" word', () => {
		const topVideos = readFile('youtubeSearchResult.bestVideo-twoVerifiedVideosAndNotContainsOfficialVideo.json.mock');

		const bestVideo = findBestVideo(JSON.parse(topVideos) as Array<Video>);
		// expect to return array
		expect(Array.isArray(bestVideo)).toBe(true);
	});

	test('Best video - Title contains channel name', () => {
		const topVideos = readFile('youtubeSearchResult.bestVideo-titleContainsChannelName.json.mock');

		const bestVideo = findBestVideo(JSON.parse(topVideos) as Array<Video>);
		// expect to return single video object only, not array
		expect(Array.isArray(bestVideo)).toBe(false);
	});

	test('Best video - Return first 2 videos (default)', () => {
		const topVideos = readFile('youtubeSearchResult.bestVideo-default.json.mock');

		const bestVideo = findBestVideo(JSON.parse(topVideos) as Array<Video>);
		// expect to return array
		expect(Array.isArray(bestVideo)).toBe(true);
	});

});
