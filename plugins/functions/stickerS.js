const fetch = require('node-fetch');

const StickerSearch = class {
  constructor(url) {
    this.apiUrl = url;
  }

  async fetchStickers(query) {
    const res = await fetch(`${this.url}${query}`);
    if (!res.ok) 
    throw new Error(`${res.statusText}`);
    const data = await res.json();
    if (!data.status) 
    throw new Error("ayi ngeke");
    return {
      title: data.result.title,
      author: data.result.author,
      authorLink: data.result.author_link,
      stickers: data.result.sticker,
    };
  }
};

module.exports = StickerSearch;
