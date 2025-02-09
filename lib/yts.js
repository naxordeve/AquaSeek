const fetch = require("node-fetch");

module.exports = async function yts(query, limit = 1) {
    const url = `https://diegoson-naxordeve.hf.space/yts/search?query=${query}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) {
    throw new Error(`${response.status}`);}
    const data = await response.json();
    if (data.videos && data.videos.length > 0) {
        const video = data.videos[0]; 
        return {
            title: video.title,
            url: video.url,
            duration: video.duration,
            views: video.views,
            uploaded: video.uploaded,
            author: video.author
        };
    } else {
        return { error: "err" };
    }
};
  
