import axios from "axios";

interface VideoData {
  title: string;
  videoUrl: string;
  hdVideoUrl: string;
  musicTitle: string;
  musicAuthor: string;
  playCount: number;
  avatar: string;
}

interface APIResponse {
  status: number;
  data: VideoData;
}

const tiktokdl = async (url: string): Promise<VideoData> => {
  const api = `https://diegoson-naxordeve.hf.space/tiktok?url=${url}`;
  try {
    const res = await axios.get<APIResponse>(api);
    if (res.status !== 200) {
      throw new Error("_oops_");
    }

    const data = res.data;
    if (data.status === 200) {
      return {
        title: data.data.title,
        videoUrl: data.data.videoUrl,
        hdVideoUrl: data.data.hdVideoUrl,
        musicTitle: data.data.musicTitle,
        musicAuthor: data.data.musicAuthor,
        playCount: data.data.playCount,
        avatar: data.data.avatar,
      };
    } else {
      throw new Error("Invalid");}
  } catch (error: any) {
    throw new Error(error.message || "Unknown error occurred");
  }
};

export default tiktokdl;
  
