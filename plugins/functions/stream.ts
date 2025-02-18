import axios from "axios";
import * as cheerio from "cheerio";

interface Game {
  name: string;
  id: number;
  price: string;
  score: string;
  platform: string;
  image: string;
}

interface Metadata {
  title: string;
  category: string[];
  genre: string[];
  release: string;
  free: string;
  developer: string[];
  publisher: string[];
  description: string;
}

interface Movie {
  title: string;
  id: number;
  thumbnail: string;
  videos: string[];
}

interface SteamDetail {
  metadata: Metadata;
  screenshot: string[];
  movies: Movie[];
}

const Steam = {
  search: async function (query: string): Promise<Game[]> {
    try {
      const response = await axios.get(
        `https://store.steampowered.com/api/storesearch?cc=id&l=id&term=${query}`
      );

      return response.data.items.map((game: any) => ({
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
      console.error(error);
      return [];
    }
  },

  detail: async function (appId: string): Promise<SteamDetail | null> {
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
          category: info.categories.map((c: any) => c.description),
          genre: info.genres.map((g: any) => g.description),
          release: info.release_date.coming_soon ? "Coming soon..." : info.release_date.date,
          free: info.is_free ? "Yes" : "No",
          developer: info.developers,
          publisher: info.publishers,
          description: $.text(),
        },
        screenshot: info.screenshots?.map((s: any) => s.path_full) || [],
        movies: info.movies?.map((m: any) => ({
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

export default Steam;
