var fetch = require('node-fetch');

class TikTokS {
    constructor(x) {
        this.x = x;
    }

    async search(query) {
        const v = `${this.x}?query=${query}`;
        const voidi = await fetch(v);
        const data = await voidi.json();
        return data.status
            ? data.result.map(video => ({
                title: video.title,
                duration: video.duration,
                region: video.region,
                videoId: video.video_id,
                thumbnail: video.thumbnail,
                createdAt: video.create_at,
                stats: video.stats,
                music: video.music,
                author: video.author,
                media: video.media
            }))
            : { error: "" };
    }
}

module.exports = TikTokS;       
