const fetch = require('node-fetch');

class YouTubePlay {
  constructor(url) {
    this.url = url;
  }

  async Ytdl(query) {
    const res = await fetch(`${this.url}${query}`);
    if (!res.ok) 
    throw new Error(`${res.statusText}`);
    const data = await res.json();
    if (!data.status) 
    throw new Error("error");
    return this.parseVideo(data.result);
  }

  parseVideo(result) {
    return {
      videoId: result.videoId,
      url: result.url,
      title: result.title,
      description: result.description,
      thumbnail: result.thumbnail,
      publishedAgo: result.ago,
      views: result.views,
      duration: result.duration.timestamp,
      author: {
        name: result.author.name,
        url: result.author.url,
      },
      download: {
        url: result.download.url,
        filename: result.download.filename,
      },
    };
  }
}

module.exports = YouTubePlay;
