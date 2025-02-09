const fetch = require('node-fetch');

async function getInstagramReelDownloadURL(reelU) {
    const voidi = `https://diegoson-naxordeve.hf.space/insta_reels?url=${reelU}`;
    const response = await fetch(voidi);
    const data = await response.json();
    if (data.success && data.data && data.data.downloadURL) {
        return data.data.downloadURL;
    }
    console.error("err");
    return null;
}

module.exports = {getInstagramReelDownloadURL};
