const fetch = require('node-fetch');

/**
 * Fetch anime, character, or manga
 * @param {string} query 
 * @param {string} type 
 * @returns {Promise<Object>}
 */
const AnimeS = async (query, type = "anime") => {
    if (!query) throw new Error('Query is required');
    const key = '2ac734cb09625e3e9d2a3c1a'; 
    const _api = {
        anime: `https://api.lolhuman.xyz/api/anime?apikey=${key}&query=${query}`,
        character: `https://api.lolhuman.xyz/api/character?apikey=${key}&query=${query}`,
        manga: `https://api.lolhuman.xyz/api/manga?apikey=${key}&query=${query}`,
    };

    if (!_api[type]) {
    throw new Error(`use "anime", "character", or "manga"`);}
    try {
        const res= await fetch(_api[type], { method: 'GET' });
        if (!res.ok) {
            throw new Error(`${res.statusText}`);}
        const data = await res.json();
        if (data.status !== 200) {
        throw new Error(`${data.message}`);}
        const result = data.result;
        if (type === "anime") {
            return {
                id: result.id,
                title: result.title.english || result.title.romaji || result.title.native,
                coverImage: result.coverImage.large,
                format: result.format,
                episodes: result.episodes,
                duration: result.duration,
                status: result.status,
                genres: result.genres,
                season: `${result.season} ${result.seasonYear}`,
                description: result.description.replace(/<br>/g, '').trim(),
                characters: result.characters.nodes.map((char) => char.name.full),
            };
        } else if (type === "character") {
            return {
                id: result.id,
                name: result.name.full,
                nativeName: result.name.native,
                image: result.image.large,
                description: result.description.replace(/<br>/g, '').trim(),
                favourites: result.favourites,
                media: result.media.nodes.map((media) => ({
                    id: media.id,
                    type: media.type,
                    title: media.title.romaji || media.title.native,
                })),
            };
        } else if (type === "manga") {
            return {
                id: result.id,
                title: result.title.english || result.title.romaji || result.title.native,
                coverImage: result.coverImage.large,
                format: result.format,
                chapters: result.chapters,
                volumes: result.volumes,
                status: result.status,
                source: result.source,
                genres: result.genres,
                startDate: `${result.startDate.day}-${result.startDate.month}-${result.startDate.year}`,
                endDate: `${result.endDate.day}-${result.endDate.month}-${result.endDate.year}`,
                description: result.description.replace(/<br>/g, '').trim(),
                averageScore: result.averageScore,
                synonyms: result.synonyms,
                characters: result.characters.nodes.map((char) => char.name.full),
            };
        }
    } catch (error) {
        throw new Error(`${type} details: ${error.message}`);
    }
};

module.exports = { AnimeS };
          
