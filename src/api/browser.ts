import puppeteer, { Browser, Page } from 'puppeteer-core';
import { LaunchBrowserResult } from '@/types';
import { getChromeExecutablePath, getChromeUserDataDir } from '@/util';

export const launchBrowser = async (): Promise<LaunchBrowserResult> => {
	const browser: Browser = await puppeteer.launch({
		// headless: false,
		defaultViewport: null,
		executablePath: getChromeExecutablePath(),
		userDataDir: getChromeUserDataDir()
	});
	const pages: Page[] = await browser.pages();
	const page = pages[0];
	return { 
		browser,
		page
	};
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
