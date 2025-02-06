var fetch = require('node-fetch');

class SpotifyDL {
    constructor(x) {
        this.x = x;
    }

    async toAudio(v) {
        const url = `${this.x}?url=${v}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status) {
            return {
                title: data.result.title,
                artists: data.result.artists,
                releaseDate: data.result.releaseDate,
                thumbnail: data.result.thumbnail,
                audioUrl: data.result.audio
            };
        }
        return { error: "imao" };
    }
}

module.exports = SpotifyDL;
