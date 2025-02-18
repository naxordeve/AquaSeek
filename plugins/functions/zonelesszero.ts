import axios from "axios";
import * as cheerio from "cheerio";

interface Character {
    name: string;
    image: string;
    role: string;
    url: string;
}

interface CharacterStats {
    name: string;
    value: string;
}

interface CharacterData {
    info: {
        name: string;
        element: string;
        image: string;
    };
    paths: string[];
    stats: CharacterStats[];
    team: Character[];
    skills: { name: string; description: string }[];
    talents: { name: string; description: string }[];
}

class ZenlessZone {
    list = async (): Promise<Character[]> => {
        try {
            const res = await axios.get("https://genshin.gg/zzz");
            const $ = cheerio.load(res.data);
            const chara: Character[] = [];
            $(".character-list a").each((i, a) => {
                chara.push({
                    name: $(a).find("h2").text(),
                    image: $(a).find("img").attr("src") || "",
                    role: $(a).find(".character-type").attr("alt") || "",
                    url: "https://genshin.gg/zzz" + $(a).attr("href"),
                });
            });
            return chara;
        } catch (error) {
            throw new Error("Error fetching character list");
        }
    };

    chara = async (charaName: string): Promise<CharacterData> => {
        try {
            const response = await axios.get(
                `https://genshin.gg/zzz/characters/${encodeURIComponent(
                    charaName.toLowerCase().split(" ").join("")
                )}/`
            );
            const $ = cheerio.load(response.data);
            const data: CharacterData = {
                info: {
                    name: $(".character-info-portrait").attr("alt") || "",
                    element: $(".character-info-element").attr("alt") || "",
                    image: $(".character-info-portrait").attr("src") || "",
                },
                paths: [],
                stats: [],
                team: [],
                skills: [],
                talents: [],
            };

            $(".character-info-path").each((i, el) => {
                data.paths.push(
                    $(el).find(".character-info-path-icon").attr("alt") || ""
                );
            });

            $(".character-info-stat").each((i, el) => {
                data.stats.push({
                    name: $(el).find(".character-info-stat-name").text(),
                    value: $(el).find(".character-info-stat-value").text(),
                });
            });

            $(".character-portrait").each((i, el) => {
                const name = $(el).find(".character-name").text();
                const rarity = $(el)
                    .find(".character-icon")
                    .attr("class")
                    .split(" ")[1];
                const element = $(el).find(".character-type").attr("alt") || "";
                const role = $(el).find(".character-weapon").attr("alt") || "";
                const image = $(el).find("img").attr("src") || "";

                data.team.push({
                    name,
                    rarity,
                    element,
                    role,
                    image,
                });
            });

            $("#skills .character-info-skill").each((i, el) => {
                const skill = {
                    name: $(el).find(".character-info-skill-name").text(),
                    description: $(el)
                        .find(".character-info-skill-description")
                        .text(),
                };
                data.skills.push(skill);
            });

            $("#talents .character-info-skill").each((i, el) => {
                const talent = {
                    name: $(el).find(".character-info-skill-name").text(),
                    description: $(el)
                        .find(".character-info-skill-description")
                        .text(),
                };
                data.talents.push(talent);
            });

            return data;
        } catch (error) {
            throw new Error("Error fetching character data");
        }
    };
}

export default new ZenlessZone();
