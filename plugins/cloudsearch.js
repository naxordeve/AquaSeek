const axios = require("axios");
const cheerio = require("cheerio");
const { CreatePlug } = require("../lib/commands");

const search = async function search(query) {
  return new Promise(async (resolve, reject) => {
    const { data } = await axios.get(`https://soundcloud.com/search?q=${query}`);
    const $ = cheerio.load(data);
    const ajg = [];
    $("#app > noscript").each((u, i) => {
      ajg.push($(i).html());
    });
    const _$ = cheerio.load(ajg[1]);
    const results = [];
    _$("ul > li > h2 > a").each((i, u) => {
      if ($(u).attr("href").split("/").length === 3) {
        const link = `https://soundcloud.com${$(u).attr("href")}`;
        const title = $(u).text().trim();
        results.push({ url: link, title: title || "No title" });
      }
    });
    resolve(results.length ? results : [{ mess: "No results found" }]);
  });
};

CreatePlug({
  command: "soundcloudsearch",
  category: "music",
  desc: "Search for SoundCloud tracks",
  execute: async (message, conn, match) => {
    if (!match) return await message.reply("Please provide a search term");
    await message.react("⏳");
    const results = await search(match);
    if (results[0]?.mess) return;
    const voidi = results
      .map((track, index) => `${index + 1}. [${track.title}\n${track.url}`)
      .join("\n");
    await conn.sendMessage(message.user, {
      caption: `SoundCloud Search:\n\n${voidi}`,
    });
  },
});
    
