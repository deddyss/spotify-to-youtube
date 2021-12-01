import Spotify from '@/api/spotify';
import spinner from '@/cli/spinner';
import { Answer, Song } from '@/types';

const retrieveSpotifyPlaylistSongs = async (spotify: Spotify, answer: Answer): Promise<Array<Song>> => {
	spinner.start('Retrieving songs from Spotify playlist');
	const { spotifyPlaylistUrl } = answer;

	// set playlist title
	answer.spotifyPlaylistTitle = await spotify.getPlaylistTitle(spotifyPlaylistUrl);
	// get playlist songs
	const songs = await spotify.getPlaylistSongs(spotifyPlaylistUrl);

	spinner.stop();
	return songs;
};

export default retrieveSpotifyPlaylistSongs;
