const axios = require('axios');

const tiktokdl = async (url) => {
  const api = `https://diegoson-naxor-api.hf.space/tiktok?url=${encodeURIComponent(url)}`;
  try {
    const res = await axios.get(api);
    if (res.status !== 200) {
      throw new Error('Failed');
    }
    const data = res.data;
    if (data.status === 200) {
      const videoData = data.data;
      return {
        title: videoData.title,
        videoUrl: videoData.playUrl,
        hdVideoUrl: videoData.hdPlayUrl,
        musicTitle: videoData.musicTitle,
        musicAuthor: videoData.musicAuthor,
        playCount: videoData.playCount,
        avatar: videoData.avatar,
      };
    } else {
      throw new Error('Invalid');
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = tiktokdl;
        
