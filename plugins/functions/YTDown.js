const fetch = require('node-fetch');

class YTDown {
  constructor(url) {
    this.url = url;
  }

  async getAudio(videoUrl) {
    const res = await fetch(`${this.url}${videoUrl}`);
    const data = await res.json();
    if (!data.status) 
    throw new Error("err");
    const result = data.result;
    return {
      title: result.title,
      author: result.author.name,
      views: result.views,
      duration: result.duration.timestamp,
      downloadUrl: result.download.url,
      filename: result.download.filename,
    };
  }
}

module.exports = YTDown;
