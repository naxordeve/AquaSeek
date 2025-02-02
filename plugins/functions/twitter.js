const axios = require("axios");
const ws = require("ws");
const cheerio = require("cheerio");

async function twitter(url) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!/x.com\/.*?\/status/gi.test(url))
                throw new Error(`Url is unvalid! Please make sure to use the correct X (Twitter) link, or make sure the post isn't deleted`);
            
            const base_url = "https://x2twitter.com";
            const base_headers = {
                accept: "*/*",
                "accept-language": "en-EN,en;q=0.9,en-US;q=0.8,en;q=0.7,ms;q=0.6",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                pragma: "no-cache",
                priority: "u=1, i",
                "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                Referer: "https://x2twitter.com/en",
                "Referrer-Policy": "strict-origin-when-cross-origin",
            };

            const t = await axios
                .post(base_url + "/api/userverify", { url }, { headers: { ...base_headers, origin: base_url } })
                .then((v) => v.data)
                .then((v) => {
                    if (v.token) return v.token;
                    else console.error(new Error(`Failed to get JWT, no token in response: ${v}`));
                    return "";
                })
                .catch((e) => {
                    throw new Error(`Failed to get JWT ${e}`);
                });

            let r = await axios
                .post(`${base_url}/api/ajaxSearch`, new URLSearchParams({
                    q: url,
                    lang: "id",
                    cftoken: t || "",
                }).toString(), { headers: { ...base_headers, origin: base_url } })
                .then((v) => v.data)
                .catch((e) => {
                    throw new Error(`Failed to get X data ${e}`);
                });

            if (r.status !== "ok")
                throw new Error(`Failed to get X data because of error ${r}`);

            r = r.data?.replace('"', '"');
            const $ = cheerio.load(r);
            let type = $("div").eq(0).attr("class");

            type = type.includes("tw-video")
                ? "video"
                : type.includes("video-data") && $(".photo-list").length
                    ? "image"
                    : "hybrid";

            console.log(type);
            let d = {};

            if (type == "video") {
                d = {
                    title: $(".content").find("h3").text().trim(),
                    duration: $(".content").find("p").text().trim(),
                    thumbnail: $(".thumbnail").find("img").attr("src"),
                    type,
                    download: await Promise.all($(".dl-action")
                        .find("p")
                        .map(async (i, el) => {
                            let name = $(el).text().trim().split(" ");
                            name = name.slice(name.length - 2).join(" ");
                            const type = name.includes("MP4") ? "mp4" : name.includes("MP3") ? "mp3" : "image";

                            if (type === "mp3") name = "MP3";
                            if (type === "image") name = "IMG";

                            const reso = type == "mp4" ? name.split(" ").pop().replace(/\(\)/, "") : null;

                            return {
                                name,
                                type,
                                reso,
                                url: type == "mp3"
                                    ? await (async () => {
                                        return new Promise(async (res, rej) => {
                                            try {
                                                const url = /k_url_convert ?= ?"(.*?)";/.exec(r)[1];
                                                if (!url) throw new Error(`Failed getting convert url`);

                                                const a = await axios
                                                    .post(url, new URLSearchParams({
                                                        ftype: type,
                                                        v_id: $(el).attr("data-mediaid"),
                                                        audioUrl: $(el).find("a").attr("data-audiourl"),
                                                        audioType: "video/mp4",
                                                        fquality: "128",
                                                        fname: "X2Twitter.com",
                                                        exp: /k_exp ?= ?"(.*?)";/.exec(r)[1],
                                                        token: /k_token ?= ?"(.*?)";/.exec(r)[1],
                                                    }).toString(), { headers: base_headers })
                                                    .then((v) => v.data)
                                                    .catch((e) => {
                                                        throw new Error(`Failed posting request ${e}`);
                                                    });

                                                if (a.statusCode === 200) return res(a.result);

                                                else if (a.statusCode === 300) {
                                                    const s = new ws(`${new URL(url).origin.replace("https", "wss")}/sub/${a.jobId}?fname=X2Twitter.com`);
                                                    s.on("message", (data) => {
                                                        const d = JSON.parse(data.toString("utf8"));
                                                        if (d.action === "success" && d.url)
                                                            return res(d.url);
                                                        else if (d.action !== "success" && d.action !== "progress")
                                                            throw new Error(`Failed request websocket \n${JSON.stringify(d, null, 2)}`);
                                                    });
                                                }
                                            } catch (e) {
                                                return rej(`Error while converting to mp3 : ${e}`);
                                            }
                                        });
                                    })()
                                    : $(el).find("a").attr("href"),
                            };
                        })
                        .get()),
                };
            } else if (type == "image") {
                d = {
                    title: null,
                    duration: null,
                    thumbnail: null,
                    type,
                    download: $("ul.download-box")
                        .find("li")
                        .map((i, el) => {
                            return {
                                name: "Image " + (i + 1),
                                thumbnail: $(el).find("img").attr("src"),
                                type,
                                reso: null,
                                url: $(el).find("a").attr("href"),
                            };
                        })
                        .get(),
                };
            }

            return resolve(d);
        } catch (e) {
            return reject(`${e}`);
        }
    });
}

module.exports = { twitter };
              
