const acrcloud = require("acrcloud");
const { CreatePlug } = require('../lib/commands');

const acr = new acrcloud({
    host: "identify-ap-southeast-1.acrcloud.com",
    access_key: "ee1b81b47cf98cd73a0072a761558ab1",
    access_secret: "ya9OPe8onFAnNkyf9xMTK8qRyMGmsghfuHrIMmUI",
});

async function whatmusic(buffer) {
    let data = (await acr.identify(buffer)).metadata;
    if (!data.music) return null;
    return data.music.map((a) => ({
        title: a.title,
        artist: a.artists?.[0]?.name || "unknown",
        score: a.score,
        release: a.release_date ? new Date(a.release_date).toLocaleDateString("id-ID") : "N/A",
        duration: toTime(a.duration_ms),
        url: a.external_metadata
            ? Object.keys(a.external_metadata)
                  .map((i) =>
                      i === "youtube"
                          ? "https://youtu.be/" + a.external_metadata[i].vid
                          : i === "deezer"
                          ? "https://www.deezer.com/us/track/" + a.external_metadata[i].track.id
                          : i === "spotify"
                          ? "https://open.spotify.com/track/" + a.external_metadata[i].track.id
                          : ""
                  )
                  .filter(Boolean)
            : [],
    }));
}

function toTime(ms) {
    let m = Math.floor(ms / 60000);
    let s = Math.floor(ms / 1000) % 60;
    return [m, s].map((v) => v.toString().padStart(2, "0")).join(":");
}

CreatePlug({
    command: 'shazam',
    category: 'search',
    desc: 'Identify a song from an audio message.',
    execute: async (message, conn, match) => {
        if (!message.quoted || (!message.quoted.message)) 
        return await message.reply('_Reply to an audio or video message to identify the song_');
        const buffer = await message.quoted.download();
        const result = await whatmusic(buffer);
        if (!result || result.length === 0) return;
        let res = result.map((song, index) => 
            `*Title:* ${song.title}\n` +
            `*Artist:* ${song.artist}\n` +
            `*Duration:* ${song.duration}\n` +
            `*Release:* ${song.release}\n` +
            `*Links:* ${song.url.join(", ")}\n\n`
        ).join("");

        await message.reply(res);
    }
});
