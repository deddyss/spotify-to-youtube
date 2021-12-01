/*
All functions below are extracted from https://github.com/sindresorhus/terminal-image/blob/main/index.js so credit should go to https://github.com/sindresorhus. Why can't I just use the terminal-image library? Because an error will appear saying 'Jimp.read is not a function', if the source code is bundled using webpack. I don't know why.
*/

import Jimp from 'jimp';
import chalk from 'chalk';

const ROW_OFFSET = 2;
const PIXEL = '\u2584';

// https://github.com/sindresorhus/terminal-image/blob/92552724fef28dbfd3a8f269fc0d6866bccfa4e3/index.js#L13
const scale = (width: number, height: number, originalWidth: number, originalHeight: number) => {
	const originalRatio = originalWidth / originalHeight;
	const factor = (width / height > originalRatio ? height / originalHeight : width / originalWidth);
	width = factor * originalWidth;
	height = factor * originalHeight;
	return { width, height};
};

// https://github.com/sindresorhus/terminal-image/blob/92552724fef28dbfd3a8f269fc0d6866bccfa4e3/index.js#L21
const checkAndGetDimensionValue = (value: string | number, percentageBase: number) => {
	if (typeof value === 'string' && value.endsWith('%')) {
		const percentageValue = Number.parseFloat(value);
		if (!Number.isNaN(percentageValue) && percentageValue > 0 && percentageValue <= 100) {
			return Math.floor(percentageValue / 100 * percentageBase);
		}
	}

	if (typeof value === 'number') {
		return value;
	}

	throw new Error(`${value} is not a valid dimension value`);
};

// https://github.com/sindresorhus/terminal-image/blob/92552724fef28dbfd3a8f269fc0d6866bccfa4e3/index.js#L36
const calculateWidthHeight = (
	imageWidth: number,
	imageHeight: number,
	inputWidth: string | number,
	inputHeight: string | number,
	preserveAspectRatio: boolean
) => {
	const terminalColumns = process.stdout.columns || 80;
	const terminalRows = process.stdout.rows - ROW_OFFSET || 24;

	let width: number;
	let height: number;

	if (inputHeight && inputWidth) {
		width = checkAndGetDimensionValue(inputWidth, terminalColumns);
		height = checkAndGetDimensionValue(inputHeight, terminalRows) * 2;

		if (preserveAspectRatio) {
			({width, height} = scale(width, height, imageWidth, imageHeight));
		}
	}
	else if (inputWidth) {
		width = checkAndGetDimensionValue(inputWidth, terminalColumns);
		height = imageHeight * width / imageWidth;
	}
	else if (inputHeight) {
		height = checkAndGetDimensionValue(inputHeight, terminalRows) * 2;
		width = imageWidth * height / imageHeight;
	}
	else {
		({width, height} = scale(terminalColumns, terminalRows * 2, imageWidth, imageHeight));
	}

	if (width > terminalColumns) {
		({width, height} = scale(terminalColumns, terminalRows * 2, width, height));
	}

	width = Math.round(width);
	height = Math.round(height);

	return {width, height};
};

// https://github.com/sindresorhus/terminal-image/blob/92552724fef28dbfd3a8f269fc0d6866bccfa4e3/index.js#L70
const render = async (
	buffer: Buffer, options?: {
		width?: string | number;
		height?: string | number;
		preserveAspectRatio?: boolean;
	}
): Promise<string> => {
	const inputWidth = options?.width ?? '100%';
	const inputHeight = options?.height ?? '100%';
	const preserveAspectRatio = options?.preserveAspectRatio ?? true;

	const image = await Jimp.read(buffer);
	const { bitmap } = image;

	const { width, height } = calculateWidthHeight(bitmap.width, bitmap.height, inputWidth, inputHeight, preserveAspectRatio);

	image.resize(width, height);

	let result = '';
	for (let y = 0; y < image.bitmap.height - 1; y += 2) {
		for (let x = 0; x < image.bitmap.width; x++) {
			const {r, g, b, a} = Jimp.intToRGBA(image.getPixelColor(x, y));
			const {r: r2, g: g2, b: b2} = Jimp.intToRGBA(image.getPixelColor(x, y + 1));
			result += a === 0 ? chalk.reset(' ') : chalk.bgRgb(r, g, b).rgb(r2, g2, b2)(PIXEL);
		}

		result += '\n';
	}

	return result;
};

export default render;
