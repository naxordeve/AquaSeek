const axios = require("axios");
const cheerio = require("cheerio");
const FormData = require("form-data");

function spotify(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get("https://spotifymate.com/en", {
                headers: {
                    cookie: "session_data=o8079end5j9oslm5a7bou84rqc;",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
                },
            });

            const $ = cheerio.load(response.data);
            const hiddenInput = $("form#get_video").find('input[type="hidden"]');
            const b = {
                name: hiddenInput.attr("name") || "",
                value: hiddenInput.attr("value") || "",
            };

            const d = new FormData();
            d.append("url", url);
            d.append(b.name, b.value);

            const postResponse = await axios.post("https://spotifymate.com/action", d, {
                headers: {
                    origin: "https://spotifymate.com/en",
                    ...d.getHeaders(),
                    cookie: "session_data=o8079end5j9oslm5a7bou84rqc;",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
                },
            });

            if (postResponse.statusText !== "OK") {
                return reject("Fail Fetching");
            }

            const c = cheerio.load(postResponse.data);
            const result = {
                title: c(".dlvideos").find('h3[itemprop="name"]').text().trim(),
                author: c(".dlvideos").find(".spotifymate-downloader-middle > p > span").text().trim(),
                thumbnail: c(".dlvideos").find("img").attr("src") || "",
                cover: c(".dlvideos")
                    .find(".spotifymate-downloader-right")
                    .find("#none")
                    .eq(1)
                    .find("a")
                    .attr("href") ||
                    c(".dlvideos")
                        .find(".spotifymate-downloader-right")
                        .find("#pop")
                        .eq(1)
                        .find("a")
                        .attr("href") ||
                    "",
                music: c(".dlvideos")
                    .find(".spotifymate-downloader-right")
                    .find("#none")
                    .eq(0)
                    .find("a")
                    .attr("href") ||
                    c(".dlvideos")
                        .find(".spotifymate-downloader-right")
                        .find("#pop")
                        .eq(0)
                        .find("a")
                        .attr("href") ||
                    "",
                link: url,
            };

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { spotify };
              
