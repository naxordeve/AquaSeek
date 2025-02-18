import fetch from 'node-fetch';

type AnimeSearch = {
  id: number;
  title: string;
  coverImage: string;
  format: string;
  episodes: number;
  duration: number;
  status: string;
  genres: string[];
  season: string;
  description: string;
  characters: string[];
};

type CharacterGet = {
  id: number;
  name: string;
  nativeName: string;
  image: string;
  description: string;
  favourites: number;
  media: { id: number; type: string; title: string }[];
};

type MangaGet = {
  id: number;
  title: string;
  coverImage: string;
  format: string;
  chapters: number;
  volumes: number;
  status: string;
  source: string;
  genres: string[];
  startDate: string;
  endDate: string;
  description: string;
  averageScore: number;
  synonyms: string[];
  characters: string[];
};

type AnimeType = 'anime' | 'character' | 'manga';
const API_KEY = '2ac734cb09625e3e9d2a3c1a';
const BASE_URL = 'https://api.lolhuman.xyz/api';
export const AnimeS = async (query: string, type: AnimeType = 'anime'): Promise<AnimeSearch | CharacterGet | MangaGet> => {
  if (!query) {
    throw new Error('Query is required');
  }
  const endpoints: Record<AnimeType, string> = {
    anime: `${BASE_URL}/anime?apikey=${API_KEY}&query=${query}`,
    character: `${BASE_URL}/character?apikey=${API_KEY}&query=${query}`,
    manga: `${BASE_URL}/manga?apikey=${API_KEY}&query=${query}`,
  };
  try {
    const response = await fetch(endpoints[type], { method: 'GET' });
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.status !== 200) {
      throw new Error(`API Error: ${data.message}`);
    }

    const result = data.result;
    if (type === 'anime') {
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
        characters: result.characters.nodes.map((char: any) => char.name.full),
      };
    }

    if (type === 'character') {
      return {
        id: result.id,
        name: result.name.full,
        nativeName: result.name.native,
        image: result.image.large,
        description: result.description.replace(/<br>/g, '').trim(),
        favourites: result.favourites,
        media: result.media.nodes.map((media: any) => ({
          id: media.id,
          type: media.type,
          title: media.title.romaji || media.title.native,
        })),
      };
    }

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
      characters: result.characters.nodes.map((char: any) => char.name.full),
    };
  } catch (error) {
    throw new Error(`${type} details: ${(error as Error).message}`);
  }
};
    
