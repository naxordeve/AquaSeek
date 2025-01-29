const axios = require('axios');

class GetImage {
  constructor(url) {
    this.url = url || 'https://api.diioffc.web.id/api/search/gimage?query=';
    }
  async Gimage(query) {
    if (!query) 
      throw new Error('Query is required');
    try {
      const response = await axios.get(`${this.url}${query}`);
      if (response.data.status && response.data.result) {
        return response.data.result.map((item) => ({
          title: item.title,
          link: item.link,
          thumbnail: item.image.thumbnailLink,
          contextLink: item.image.contextLink,
        }));
      }
      throw new Error('invalid');
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
}

module.exports = GetImage;
