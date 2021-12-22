import puppeteer, { Browser, Page } from 'puppeteer-core';
import got from 'got';
import { Chrome, LaunchBrowserResult } from '@/types';
import { getChromeExecutablePath, getChromeUserDataDir } from '@/util';

export const launchBrowser = async (): Promise<LaunchBrowserResult> => {
	const browser: Browser = await puppeteer.launch({
		// headless: false,
		defaultViewport: null,
		executablePath: getChromeExecutablePath(),
		userDataDir: getChromeUserDataDir()
	});
	const [ page ] = await browser.pages();
	return { 
		browser,
		page
	};
};

export const getBrowserWebSocketEndpoint = async (port: string | number): Promise<string | undefined> => {
	const url = `http://localhost:${port}/json/version`;
	return new Promise((resolve) => {
		got(url)
			.then((response) => {
				const chrome = JSON.parse(response.body) as Chrome;
				resolve(chrome.webSocketDebuggerUrl);
			})
			.catch(() => {
				resolve(undefined);
			});
	});
};

export const connectBrowser = async (websocketEndpoint: string): Promise<Page> => {
	const browser: Browser = await puppeteer.connect({
		browserWSEndpoint: websocketEndpoint,
		defaultViewport: null
	});
	const page = await browser.newPage();

	return page;
};

type CloseParam = { browser?: Browser, page?: Page };

export const close = async (param: CloseParam): Promise<void> => {
	if (param.page) {
		await param.page.close();
	}
	if (param.browser) {
		await param.browser.close();
	}
};
