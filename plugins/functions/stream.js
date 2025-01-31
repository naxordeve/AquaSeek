const axios = require("axios");
const cheerio = require("cheerio");

const Steam = {
    search: async function (query) {
        try {
            const response = await axios.get(
                `https://store.steampowered.com/api/storesearch?cc=id&l=id&term=${query}`
            );

            return response.data.items.map((game) => ({
                name: game.name,
                id: game.id,
                price: game.price ? `Rp: ${(game.price.final / 1e3).toLocaleString()}` : "Free",
                score: game.metascore ? `${game.metascore}/100` : "N/A",
                platform: game.platforms.windows
                    ? "Windows"
                    : game.platforms.mac
                    ? "Mac"
                    : game.platforms.linux
                    ? "Linux"
                    : "Unknown",
                image: game.tiny_image,
            }));
        } catch (error) {
            console.error( error);
            return [];
        }
    },

    detail: async function (appId) {
        try {
            const response = await axios.get(
                `https://store.steampowered.com/api/appdetails?appids=${appId}`
            );
            const info = response.data[appId]?.data;

            if (!info) return null;

            const $ = cheerio.load(info.detailed_description);

            return {
                metadata: {
                    title: info.name,
                    category: info.categories.map((c) => c.description),
                    genre: info.genres.map((g) => g.description),
                    release: info.release_date.coming_soon ? "Coming soon..." : info.release_date.date,
                    free: info.is_free ? "Yes" : "No",
                    developer: info.developers,
                    publisher: info.publishers,
                    description: $.text(),
                },
                screenshot: info.screenshots?.map((s) => s.path_full) || [],
                movies: info.movies?.map((m) => ({
                    title: m.name,
                    id: m.id,
                    thumbnail: m.thumbnail,
                    videos: m.mp4,
                })) || [],
            };
        } catch (error) {
            console.error(error);
            return null;
        }
    },
};

module.exports = Steam;
                                            
