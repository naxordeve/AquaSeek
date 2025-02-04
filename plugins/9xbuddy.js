const axios = require("axios");
const cheerio = require("cheerio");
const { CreatePlug } = require("../lib/commands"); // Adjust path as needed

module.exports = {
  async parseMediaResults(media) {
    return media.map((item) => {
      const { quality, size, link } = item;
      const baseUrl = "https://9xbuddy.online";
      let formattedLink = link;
      if (link.startsWith("//")) {
        formattedLink = `https:${link}`;
      } else if (!link.startsWith("https:")) {
        formattedLink = `${baseUrl}${link}`;
      }
      return {
        quality: quality.split("Extract")[0].trim().replace("Download Now", ""),
        size: size === "-" ? "Unknown" : size,
        link: formattedLink,
      };
    });
  },

  async scrapeData(url) {
    let mediaResults = [];
    let info = {};
    while (mediaResults.length === 0) {
      const { data } = await axios.get(
        `https://${process.env.DOMAIN_URL}/api/tools/web/html?url=https://9xbuddy.online/process?url=${encodeURIComponent(url)}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
          },
        }
      );

      const $ = cheerio.load(data);
      info = {
        title: $("div.text-gray-500.dark\\:text-gray-200").first().text().trim(),
        uploader: $("p:contains('Uploader') span.text-blue-500").text().trim(),
        duration: $("p:contains('Duration') span.text-blue-500").text().trim(),
      };
      const results = [];
      $("div.lg\\:flex.lg\\:justify-center.items-center").each((_, el) => {
        const [quality, size, link] = [
          $(el).find("div:nth-child(2)").text().trim(),
          $(el).find("div:nth-child(3)").text().trim(),
          $(el).find("a").attr("href"),
        ];
        if (quality && size && link) {
          results.push({ quality, size, link });
        }
      });
      if (results.length > 0) {
        mediaResults = await module.exports.parseMediaResults(results);
      }
    }
    return {
      media: mediaResults,
      info: info,
    };
  },
};

CreatePlug({
  command: "9xbuddy",
  category: "download",
  desc: "download",
  execute: async (message, conn, match) => {
    if (!match) return await message.reply("Please provide a valid URL");
    await message.react("⏳");
    await message.reply("_Processing..._");
    const { media, info } = await module.exports.scrapeData(match);
    if (media.length === 0) return;
    let med = media.map(
      (item, index) =>
        `${index + 1}. Quality: ${item.quality}, Size: ${item.size}, Link: ${item.link}`);
    const media = med.join("\n");
    const txt = `
    Title: ${info.title || "unknown"}
    Uploader: ${info.uploader || "unknown"}
    Duration: ${info.duration || "unknown"}`;
    await conn.sendMessage(message.user, {
      video: { url: media[0].link ,
      caption: `${media}\n\n${txt}`,
    });
  },
});
