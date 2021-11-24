import { Config, Song, Tracks } from '@/types';

export const getAccessToken = (): string => {
	const script = document.querySelector('script#config');
	if (script) {
		const config = JSON.parse(script.textContent ?? '{}') as Config;
		return config.accessToken;
	}
	return '';
};

export const getPlaylistLength = (): number => {
	const meta = document.querySelector('meta[property="music:song_count"]');
	if (meta) {
		return parseInt(meta.getAttribute('content') ?? '0', 10);
	}
	return 0;
};

export const getPlaylistSongs = async (playlistId: string, playlistLength: number, accessToken: string): Promise<Array<Song>> => {
	const limit = 100;
	const baseApiUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}`;

	let index = 0;
	const loopCount = Math.ceil(playlistLength / limit);
	const result: Array<Song> = [];

	do {
		const offset = index * limit;
		const apiUrl = `${baseApiUrl}&offset=${offset}`;

		const response = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${accessToken}` }});
		const tracks = await response.json() as Tracks;

		const songs = tracks.items.map((item) => {
			const { track } = item;
			const { name: title, artists } = track;
			const artistNames = artists.map((artist) => artist.name ?? '');
			return { title, artists: artistNames } as Song;
		});
		result.push(...songs);

		index += 1;
	}
	while (index < loopCount);

	return result;
};
