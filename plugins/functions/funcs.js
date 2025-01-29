const axios = require('axios');

const getBuffer = async (url) => {
  if (!url) throw new Error('url is required');
  try {
    const voidi = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    return Buffer.from(voidi.data);
  } catch (error) {
    throw new Error(`${error.message}`);
  }
};

module.exports = { getBuffer };
