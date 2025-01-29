const fetch = require('node-fetch');

class LeptonAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.yanzbotz.live/api/ai/lepton';
  }

  async getResult(query) {
    const url = `${this.baseURL}?query=${query}&apiKey=${this.apiKey}`;
    const get = await fetch(url);
    if (!get.ok) 
    throw new Error(`${get.status}`);
    const data = await get.json();
    if (data.status !== 200)
    throw new Error(`${data.message || 'err'}`);
  

    return data.result;
  }
}

module.exports = LeptonAPI;
