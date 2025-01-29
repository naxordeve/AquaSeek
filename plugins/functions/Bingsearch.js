const fetch = require('node-fetch');

class BingSearch {
  constructor(base) {
    if (!base) throw new Error("api_needed");
    this.base = base;
  }

  async Res(query) {
    if (!query) throw new Error("Query parameter is required");
    try {
      const get = await fetch(`${this.base}${query}`);
      if (!get.ok) 
      throw new Error(`${get.status}`);
      const mek = await get.json();
      if (!mek.status || !Array.isArray(mek.data)) 
      throw new Error("Invalid");
      return mek.data.map(item => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        image: item.image
      }));
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = BingSearch;
