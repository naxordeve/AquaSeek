const fetch = require('node-fetch');

class Denied extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "Denied";
    this.statusCode = statusCode;
  }
}

function constructAP(URL) {
const mode = 'jawa';
return `https://api.yanzbotz.live/api/downloader/ytmp4?url=${URL}&apiKey=${mode}`;
}

async function fetchAPI(ap) {
  const res = await fetch(ap);
  if (!res.ok) {
  throw new Denied(res.statusText, res.status);
  }
  return res.json();
}

function YTDL(result) {
  const { caption: { res_data: { title } }, formats } = result;
  if (!formats || formats.length === 0) {
  throw new Error('No');
  }
  const val = Array.isArray(formats) ? formats : [];
  const best = val.reduce((prev, curr) => (prev.filesize > curr.filesize ? prev : curr));
  return {
    title,
    videoUrl: best.url,
    fileSize: best.filesize,
    quality: best.quality,
    ext: best.ext,
  };
}

module.exports = {
  async YTMP4(URL) {
    try {
      const apii = constructAP(URL);
      const data = await fetchAPI(apii);
      if (data.status !== 200) {
      throw new Denied(data.message || data.status);
      }
      const { result } = data;
      return YTDL(result);
    } catch (error) {
      return { error: error.message };
    }
  },
};
    
