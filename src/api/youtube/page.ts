import { Video } from '@/types';
import { HTTPResponse } from 'puppeteer-core';

export const userHasLoggedInToGoogle = (): boolean => {
	const serviceLoginLink: HTMLAnchorElement | null = document.querySelector('a[href^="https://accounts.google.com/ServiceLogin"]');
	if (serviceLoginLink) {
		return false;
	}
	return true;
};

export const getTopVideos = (size?: number): Array<Video> => {
	const videos: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('ytd-video-renderer');
	if (videos.length === 0) {
		return [];
	}

	const result: Array<Video> = [];
	const topVideos: Array<HTMLElement> = Array.from(videos).slice(0, size ?? 3);
	topVideos.forEach((video, index) => {
		const thumbnailElement: HTMLImageElement | null = video.querySelector('ytd-thumbnail a#thumbnail yt-img-shadow img#img');
		const titleElement: HTMLAnchorElement | null = video.querySelector('div#meta div#title-wrapper h3.title-and-badge a#video-title');
		const channelElement: HTMLAnchorElement | null = video.querySelector('div#channel-info ytd-channel-name#channel-name div#container div#text-container yt-formatted-string#text a');
		const badgeElement: HTMLDivElement | null = video.querySelector('div#channel-info ytd-channel-name#channel-name ytd-badge-supported-renderer div.badge');

		if (titleElement && thumbnailElement && channelElement) {
			let img: string = thumbnailElement.getAttribute('src') ?? '';
			img = img.substring(0, img.indexOf('?'));

			const title: string = titleElement.getAttribute('title') ?? '';
			const url: string = 'https://www.youtube.com' + titleElement.getAttribute('href');
			const meta: string = titleElement.getAttribute('aria-label') ?? '';
			const views: number = parseInt(meta.split(' ').slice(-2)[0].replace(/,/g,''), 10);

			const channel: string = channelElement.textContent ?? '';

			const official: boolean = badgeElement?.getAttribute('aria-label') === 'Official Artist Channel';
			const verified: boolean = badgeElement?.getAttribute('aria-label') === 'Verified';

			if (title && channel) {
				result.push({ title, channel, views, official, verified, url, img, index });
			}
		}
	});

	const compareViews = (a: Video, b: Video): number => {
		return b.views - a.views;
	};
	const compareChannelStatus = (a: Video, b: Video): number => {
		const aStatusValue = (a.official ? 2 : 0) + (a.verified ? 1 : 0);
		const bStatusValue = (b.official ? 2 : 0) + (b.verified ? 1 : 0);
		return bStatusValue - aStatusValue;
	};
	result.sort(compareChannelStatus || compareViews);

	return result;
};

export const clickVideoMenuAtIndex = (index?: number): boolean => {
	const videoIndex: number = index ?? 0;
	const videoRenderers: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('ytd-video-renderer');
	if (videoRenderers.length === 0) {
		return false;
	}

	// compare index with the length
	if (videoIndex >= videoRenderers.length) {
		return false;
	}

	const videoRenderer: HTMLElement = videoRenderers.item(videoIndex);
	const videoMenuButton: HTMLButtonElement | null = videoRenderer.querySelector('div#menu button#button');
	// cannot find video menu button
	if (videoMenuButton === null) {
		return false;
	}

	videoMenuButton.click();
	return true;
};

export const clickSaveToPlaylistMenu = (): boolean => {
	const menuPopupRenderer: HTMLElement | null = document.querySelector('ytd-menu-popup-renderer');
	if (menuPopupRenderer === null) {
		return false;
	}
	if (isHidden(menuPopupRenderer)) {
		return false;
	}

	const menuServiceItemRenderers: Array<HTMLElement> = [...document.querySelectorAll<HTMLElement>('ytd-menu-service-item-renderer')];
	if (menuServiceItemRenderers.length === 0) {
		return false;
	}

	const saveToPlaylistMenu: HTMLElement | undefined = menuServiceItemRenderers.find((menu) => menu.innerText === 'Save to playlist');
	if (saveToPlaylistMenu === undefined) {
		return false;
	}

	saveToPlaylistMenu.click();
	return true;
};

export const getAddToPlaylistResponse = (response: HTTPResponse): boolean => {
	return response.url().includes('/playlist/get_add_to_playlist?'); 
};

const isHidden = (element: HTMLElement): boolean => {
	return element.offsetParent === null;
};

const isAddToPlaylistRendererVisible = (): boolean => {
	const addToPlaylistRenderer: HTMLElement | null = document.querySelector('ytd-add-to-playlist-renderer');
	if (addToPlaylistRenderer === null) {
		return false;
	}
	if (isHidden(addToPlaylistRenderer)) {
		return false;
	}
	return true;
};

export const getMyPlaylists = (): Array<string> => {
	if (!isAddToPlaylistRendererVisible()) {
		return [];
	}

	const addToPlaylistLabels: Array<HTMLElement> = [...document.querySelectorAll<HTMLElement>('ytd-playlist-add-to-option-renderer #label')];
	return addToPlaylistLabels.map((label) => label.innerText);
};

export const isPlaylistAlreadyCheckedAtIndex = (index?: number): boolean => {
	if (!isAddToPlaylistRendererVisible()) {
		return false;
	}

	const playlistIndex: number = index ?? 0;
	const addToPlaylistCheckboxes: NodeListOf<HTMLDivElement> = document.querySelectorAll<HTMLDivElement>('ytd-playlist-add-to-option-renderer div#checkbox');
	if (playlistIndex >= addToPlaylistCheckboxes.length) {
		return false;
	}

	const addToPlaylistCheckbox: HTMLDivElement = addToPlaylistCheckboxes.item(playlistIndex);
	return addToPlaylistCheckbox.classList.contains('checked');
};

export const checkPlaylistCheckboxAtIndex = (index?: number): boolean => {
	if (!isAddToPlaylistRendererVisible()) {
		return false;
	}

	const playlistIndex: number = index ?? 0;
	const addToPlaylistPaperCheckboxes: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('ytd-playlist-add-to-option-renderer tp-yt-paper-checkbox#checkbox');
	if (playlistIndex >= addToPlaylistPaperCheckboxes.length) {
		return false;
	}

	const addToPlaylistPaperCheckbox = addToPlaylistPaperCheckboxes.item(playlistIndex);
	addToPlaylistPaperCheckbox.click();
	return true;
};

export const getEditPlaylistResponse = (response: HTTPResponse): boolean => {
	return response.url().includes('/browse/edit_playlist?'); 
};

export const closeAddToPlaylistDialog = (): boolean => {
	if (!isAddToPlaylistRendererVisible()) {
		return false;
	}

	const closeButton: HTMLButtonElement | null = document.querySelector('ytd-add-to-playlist-renderer yt-icon-button#close-button button#button');
	if (closeButton === null) {
		return false;
	}

	closeButton.click();
	return true;
};

export const clickCreateNewPlaylistLink = (): boolean => {
	if (!isAddToPlaylistRendererVisible()) {
		return false;
	}

	const createNewPlaylistLink: HTMLAnchorElement | null = document.querySelector('ytd-add-to-playlist-create-renderer ytd-compact-link-renderer a#endpoint');
	if (createNewPlaylistLink === null) {
		return false;
	}

	createNewPlaylistLink.click();
	return true;
};

export const enterPlaylistNameAndClickCreateLink = (playlistName: string): boolean => {
	if (!isAddToPlaylistRendererVisible()) {
		return false;
	}

	const playlistNameInput: HTMLInputElement | null = document.querySelector('div#create-playlist-form tp-yt-paper-input#input iron-input input');
	if (playlistNameInput === null) {
		return false;
	}

	const createlink: HTMLAnchorElement | null = document.querySelector('div#create-playlist-form div#actions ytd-button-renderer a');
	if (createlink === null) {
		return false;
	}

	if (isHidden(playlistNameInput) || isHidden(createlink)) {
		return false;
	}

	playlistNameInput.setAttribute('value', playlistName);
	createlink.click();
	return true;
};

export const getCreatePlaylistResponse = (response: HTTPResponse): boolean => {
	return response.url().includes('/playlist/create?');
};
