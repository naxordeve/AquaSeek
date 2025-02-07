const axios = require("axios");
const cheerio = require("cheerio");

const search = async (q) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get("https://music.apple.com/id/search?term=" + encodeURIComponent(q));
            const $ = cheerio.load(response.data);
            const array = [];
            $(".shelf-grid__body ul li .track-lockup").each((a, i) => {
                const title = $(i)
                    .find(".track-lockup__content li")
                    .eq(0)
                    .find("a")
                    .text()
                    .trim();
                const album = $(i)
                    .find(".track-lockup__content li")
                    .eq(0)
                    .find("a")
                    .attr("href");
                const crop = album.split("/").pop();
                const song = album
                    .replace(crop, "")
                    .trim()
                    .replace("/album/", "/song/")
                    .trim() + album.split("i=")[1];
                const image = $(i)
                    .find(".svelte-3e3mdo source")
                    .eq(1)
                    .attr("srcset")
                    .split(",")[1]
                    .split(" ")[0]
                    .trim();
                const artist = {
                    name: $(i)
                        .find(".track-lockup__content li")
                        .eq(1)
                        .find("a")
                        .text()
                        .trim(),
                    url: $(i)
                        .find(".track-lockup__content li")
                        .eq(1)
                        .find("a")
                        .attr("href"),
                };
                array.push({
                    title,
                    image,
                    song,
                    artist,
                });
            });
            resolve(array);
        } catch (error) {
            reject(error);
        }
    });
};

const download = async (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            const json = JSON.parse($("script").eq(0).text());
            const info = {
                metadata: {},
                download: {},
            };

            delete json.audio["@type"];
            delete json.audio.audio;
            delete json.audio.inAlbum["@type"];
            delete json.audio.inAlbum.byArtist;
            json.audio.artist = json.audio.byArtist[0];
            delete json.audio.artist["@type"];
            delete json.audio.byArtist;
            info.metadata = json.audio;
            const { data } = await axios.get("https://aaplmusicdownloader.com/api/composer/ytsearch/mytsearch.php", {
                params: {
                    name: info.metadata.name,
                    artist: info.metadata.artist.name,
                    album: info.metadata.inAlbum.name,
                    link: info.metadata.url,
                },
            });

            if (!data.videoid) return reject(data);
            const voidi = await axios.get("https://aaplmusicdownloader.com/api/ytdl.php?q=" + data.videoid);
            info.download = voidi.data.dlink;
            resolve(info);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { search, download };
      
