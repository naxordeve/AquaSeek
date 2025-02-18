import axios from "axios";
import WebSocket from "ws";
import * as cheerio from "cheerio";

interface DownloadItem {
    name: string;
    type: string;
    reso: string | null;
    url: string;
    thumbnail?: string;
}

interface TwitterData {
    title: string | null;
    duration: string | null;
    thumbnail: string | null;
    type: string;
    download: DownloadItem[];
}

async function twitter(url: string): Promise<TwitterData> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!/x.com\/.*?\/status/gi.test(url)) {
                throw new Error("Url is invalid! Please make sure to use the correct X (Twitter) link, or make sure the post isn't deleted");
            }

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
            const token = await axios
                .post(`${base_url}/api/userverify`, { url }, { headers: { ...base_headers, origin: base_url } })
                .then((v) => v.data)
                .then((v) => v.token || "")
                .catch((e) => {
                    throw new Error(`Failed to get JWT: ${e}`);
                });
            const response = await axios
                .post(
                    `${base_url}/api/ajaxSearch`,
                    new URLSearchParams({
                        q: url,
                        lang: "id",
                        cftoken: token || "",
                    }).toString(),
                    { headers: { ...base_headers, origin: base_url } }
                )
                .then((v) => v.data)
                .catch((e) => {
                    throw new Error(`Failed to get X data: ${e}`);
                });
            if (response.status !== "ok") {
                throw new Error(`Failed to get X data: ${response}`);
            }
            const $ = cheerio.load(response.data);
            let type: string = $("div").eq(0).attr("class") || "";
            type = type.includes("tw-video")
                ? "video"
                : type.includes("video-data") && $(".photo-list").length
                ? "image"
                : "hybrid";

            console.log(type);
            let result: TwitterData = {
                title: null,
                duration: null,
                thumbnail: null,
                type,
                download: [],
            };
            if (type === "video") {
                result = {
                    title: $(".content").find("h3").text().trim(),
                    duration: $(".content").find("p").text().trim(),
                    thumbnail: $(".thumbnail").find("img").attr("src") || null,
                    type,
                    download: await Promise.all(
                        $(".dl-action")
                            .find("p")
                            .map(async (i, el) => {
                                let name = $(el).text().trim().split(" ");
                                name = name.slice(name.length - 2).join(" ");
                                const format = name.includes("MP4") ? "mp4" : name.includes("MP3") ? "mp3" : "image";
                                const resolution = format === "mp4" ? name.split(" ").pop()?.replace(/\(\)/, "") : null;

                                return {
                                    name,
                                    type: format,
                                    reso: resolution,
                                    url: $(el).find("a").attr("href") || "",
                                };
                            })
                            .get()
                    ),
                };
            } else if (type === "image") {
                result.download = $("ul.download-box")
                    .find("li")
                    .map((i, el) => ({
                        name: `Image ${i + 1}`,
                        thumbnail: $(el).find("img").attr("src") || "",
                        type,
                        reso: null,
                        url: $(el).find("a").attr("href") || "",
                    }))
                    .get();
            }

            resolve(result);
        } catch (e) {
            reject(`Error: ${e}`);
        }
    });
}

export { twitter };
