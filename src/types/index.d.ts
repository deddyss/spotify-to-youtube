import { Browser, Page } from 'puppeteer-core';

export * from './spotify';

export interface Answer {
	chromeRemoteDebuggingPort: number;
	spotifyPlaylistUrl: string;
	spotifyPlaylistTitle: string;
	spotifySelectedSongs: string[];
	youtubePlaylistTitle: string;
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
	id: string;
	title: string;
	channel: string;
	views: number;
	official: boolean;
	verified: boolean;
	url: string;
	img: string;
	index: number;
}

export interface Chrome {
	webSocketDebuggerUrl?: string;
}
