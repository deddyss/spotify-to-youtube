import Table from 'cli-table';
import got from 'got';
import chalk from 'chalk';
import { Video } from '@/types';
import { formatNumber, printNewLine } from '@/util';
import render from './thumbnail';

const columnWidth = Math.floor((process.stdout.columns / 2)) - 4;

const renderThumbnail = async (imageUrl: string): Promise<string> => {
	const jpegBuffer = await got(imageUrl).buffer();
	const width = columnWidth - 4;
	const thumbnail = await render(jpegBuffer, { width });
	return thumbnail;
};

const videoToColumn = async (video: Video): Promise<string> => {
	const { title, channel, official, verified, views, url } = video;
	
	const thumbnail = await renderThumbnail(video.img);

	const totalViews = `${chalk.yellow(formatNumber(views))} views`;
	const channelStatus = official ? '(Official Artist)' : (verified ? '(Verified)' : '');
	const styledChannel = `${chalk.bold(channel)} ${chalk.yellow(channelStatus)}`;
	const styledUrl = chalk.cyan.underline(url);

	const column = `${thumbnail}\n${title}\n${styledChannel}\n${totalViews}\n${styledUrl}`;
	return column;
};

const showVideoTable = async (videos: Array<Video>): Promise<void> => {
	const table = new Table({
		head: ['1st video', '2nd video'],
		colWidths: [columnWidth, columnWidth]
	});

	const firstVideo = await videoToColumn(videos[0]);
	const secondVideo = await videoToColumn(videos[1]);

	table.push([firstVideo, secondVideo]);

	printNewLine();
	console.log(`${table.toString()}`);
};

export default showVideoTable;
