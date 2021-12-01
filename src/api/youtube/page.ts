import { Video } from '@/types';

export const userHasLoggedInToGoogle = (): boolean => {
	const serviceLoginLink = document.querySelector('a[href^="https://accounts.google.com/ServiceLogin"]');
	if (serviceLoginLink) {
		return false;
	}
	return true;
};

export const getTopVideos = (size?: number): Array<Video> => {
	const videos = document.querySelectorAll('ytd-video-renderer');
	if (videos.length === 0) {
		return [];
	}

	const result: Array<Video> = [];
	const topVideos = Array.from(videos).slice(0, size ?? 3);
	topVideos.forEach((video, index) => {
		const thumbnailElement = video.querySelector('ytd-thumbnail a#thumbnail yt-img-shadow img#img');
		const titleElement = video.querySelector('div#meta div#title-wrapper h3.title-and-badge a#video-title');
		const channelElement = video.querySelector('div#channel-info ytd-channel-name#channel-name div#container div#text-container yt-formatted-string#text a');
		const badgeElement = video.querySelector('div#channel-info ytd-channel-name#channel-name ytd-badge-supported-renderer div.badge');

		if (titleElement && thumbnailElement && channelElement) {
			let img = thumbnailElement.getAttribute('src') ?? '';
			img = img.substring(0, img.indexOf('?'));

			const title = titleElement.getAttribute('title') ?? '';
			const url = 'https://www.youtube.com' + titleElement.getAttribute('href');
			const meta = titleElement.getAttribute('aria-label') ?? '';
			const views = parseInt(meta.split(' ').slice(-2)[0].replace(/,/g,''), 10);

			const channel = channelElement.textContent ?? '';

			const official = badgeElement?.getAttribute('aria-label') === 'Official Artist Channel';
			const verified = badgeElement?.getAttribute('aria-label') === 'Verified';

			if (title && channel) {
				result.push({ title, channel, views, official, verified, url, img, index });
			}
		}
	});

	const compareViews = (a: Video, b: Video) => {
		return b.views - a.views;
	};
	const compareChannelStatus = (a: Video, b: Video) => {
		const aStatusValue = (a.official ? 2 : 0) + (a.verified ? 1 : 0);
		const bStatusValue = (b.official ? 2 : 0) + (b.verified ? 1 : 0);
		return bStatusValue - aStatusValue;
	};
	result.sort(compareChannelStatus || compareViews);

	return result;
};
