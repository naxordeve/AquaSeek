import fetch from 'node-fetch';

interface FacebookReels {
  platform: 'facebook';
  description: string;
  thumbnail: string;
  videoHD: string;
  videoSD: string;
}

interface InstagramReels {
  platform: 'instagram';
  type: string;
  thumbnail: string;
  mediaUrl: string;
}

type ApiResponse = FacebookReels | InstagramReels;
const Func = async (url: string, platform: 'facebook' | 'instagram'): Promise<ApiResponse> => {
  if (!url) {
    throw new Error('A video or content URL is required');
  }
  let apiUrl: string;
  if (platform === 'facebook') {
    apiUrl = `https://api.yanzbotz.live/api/downloader/facebook?url=${url}&apiKey=jawa`;
  } else if (platform === 'instagram') {
    apiUrl = `https://api.yanzbotz.live/api/downloader/instagram?url=${url}&apiKey=jawa`;
  } else {
    throw new Error('Use "facebook" or "instagram"');
  }
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${platform}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Invalid response format. Expected JSON');
  }

  const data = await response.json();
  if (data.status !== 200 || !data.result) {
    throw new Error(`Error fetching from ${platform}: ${data.status}`);
  }
  if (platform === 'facebook') {
    const { desc, thumb, video_hd, video_sd } = data.result;
    return {
      platform,
      description: desc || 'Facebook Video',
      thumbnail: thumb,
      videoHD: video_hd,
      videoSD: video_sd,
    };
  }

  if (platform === 'instagram') {
    const { type, thumbnail, url: mediaUrl } = data.result[0];
    return {
      platform,
      type,
      thumbnail,
      mediaUrl,
    };
  }
  throw new Error('Unexpected platform');
};

export { Func };
