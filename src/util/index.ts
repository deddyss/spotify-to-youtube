import path from 'path';
import fs from 'fs';

export const isChromeAvailable = (): boolean => {
	return getChromeExecutablePath() !== undefined;
};

export const getChromeExecutablePath = (): string | undefined => {
	if (process.platform !== 'win32') {
		return undefined;
	}

	const prefixes = [
		process.env.LOCALAPPDATA,
		process.env.PROGRAMFILES,
		process.env['PROGRAMFILES(X86)']
	];
	const suffix = '\\Google\\Chrome\\Application\\chrome.exe';

	for (const prefix of prefixes) {
		try {
			const chromePath = path.join(prefix as string, suffix);
			fs.accessSync(chromePath);
			return chromePath;
		}
		catch (error) {
			// do nothing
		}
	}

	return undefined;
};

export const getChromeUserDataDir = (): string | undefined => {
	if (process.platform !== 'win32') {
		return undefined;
	}

	const prefix = process.env.LOCALAPPDATA;
	const suffixes = [
		'\\Google\\Chrome\\User Data',
		'\\Google\\Chrome Beta\\User Data',
		'\\Google\\Chrome SxS\\User Data',
		'\\Chromium\\User Data'
	];

	for (const suffix of suffixes) {
		try {
			const chromePath = path.join(prefix as string, suffix);
			fs.accessSync(chromePath);
			return chromePath;
		}
		catch (error) {
			// do nothing
		}
	}

	return undefined;
};

export const isNotEmpty = (array: Array<any>): boolean => array && array.length > 0;

export const random = (min: number, max: number): number => {
	const minRange = Math.ceil(min);
	const maxRange = Math.floor(max);
	return Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
};

export const sleep = (delay = 0): Promise<void> => {
	return new Promise((resolve) => {
		if (delay > 0) {
			setTimeout(() => {
				resolve();
			}, delay);
		}
		else {
			resolve();
		}
	});
};
