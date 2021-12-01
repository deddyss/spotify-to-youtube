import { Video } from '@/types';

export const findBestVideo = (videos: Array<Video>): Video | Array<Video> => {
	// get videos from official artist or verified channel only
	const officialArtistOrVerifiedChannelPredicate = (video: Video) => video.official || video.verified;
	const officialArtistOrVerifiedChannelVideos = videos.filter(officialArtistOrVerifiedChannelPredicate);
	if (officialArtistOrVerifiedChannelVideos.length > 0) {
		// return the one and only video
		if (officialArtistOrVerifiedChannelVideos.length === 1) {
			return officialArtistOrVerifiedChannelVideos[0];
		}
		// found more than one video
		else {
			// filter video that contains 'official' and 'video' words
			const officialMusicVideoPredicate = (video: Video) => {
				const title = video.title.toLowerCase();
				return title.includes('official') && title.includes('video');
			};
			const officialMusicVideos = officialArtistOrVerifiedChannelVideos.filter(officialMusicVideoPredicate);
			// return the one and only official video
			if (officialMusicVideos.length === 1) {
				return officialMusicVideos[0];
			}
			else {
				// filter video that contains channel name on its title (channel name == the artist name)
				const containsChannelNamePredicate = (video: Video) => video.title.includes(video.channel);
				const containsChannelNameVideos = officialArtistOrVerifiedChannelVideos.filter(containsChannelNamePredicate);
				// return the one and only video that contains channel name on its title
				if (containsChannelNameVideos.length === 1) {
					return containsChannelNameVideos[0];
				}
				// return first 2 videos
				else {
					return officialArtistOrVerifiedChannelVideos.slice(0, 2);
				}
			}
		}
	}
	// there is no video from official artist or verified channel
	// so, return the first 2 videos
	return videos.slice(0, 2);
};
