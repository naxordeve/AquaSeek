const fetch = require('node-fetch');

class YTVideo {
  constructor(url) {
    this.apiUrl = apiUrl;
  }

  async getVideo(videoUrl) {
    const response = await fetch(`${this.url}${videoUrl}`);
    const data = await response.json();
    if (!data.status) 
    throw new Error("err");
    const result = data.result;
    return {
      title: result.title,
      author: result.author.name,
      views: result.views,
      duration: result.duration.timestamp,
      thumbnail: result.thumbnail,
      downloadUrl: result.download.url,
      filename: result.download.filename,
      originalUrl: result.url, 
    };
  }
}

module.exports = YTVideo;
