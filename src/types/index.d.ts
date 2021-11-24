import { Browser, Page } from 'puppeteer-core';

export * from './spotify';

export interface Configuration {
	spotifyPlaylistUrl: string;
}

export type Answer = Configuration;

export interface LaunchBrowserResult {
	browser: Browser;
	page: Page;
}

export interface Song {
	title: string;
	artists: Array<string>;
}
