const fetch = require('node-fetch');

async function Func(url) {
  const _api = `https://diegoson-naxor-api.hf.space/facebook?url=${url}`;
  try {
    const res = await fetch(_api);
    const data = await res.json();
    if (data && data.data) {
      return {
        "720p": data.data["720p (HD)"],
        "360p": data.data["360p (SD)"]
      };
    } else {
      return null; 
    }
  } catch (error) {
    return null; 
  }
}

module.exports = {Func};
