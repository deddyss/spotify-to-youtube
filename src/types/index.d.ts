import { Browser, Page } from 'puppeteer-core';

export * from './spotify';

export interface Answer {
	spotifyPlaylistUrl: string;
	spotifyPlaylistTitle: string;
	selectedSongs: string[];
}

export interface YoutubeVideoAnswer {
	index: number;
}

export interface LaunchBrowserResult {
	browser: Browser;
	page: Page;
}

export interface Song {
	title: string;
	artists: Array<string>;
}

export interface Video {
	title: string;
	channel: string;
	views: number;
	official: boolean;
	verified: boolean;
	url: string;
	img: string;
	index: number;
}
