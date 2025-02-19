import axios from 'axios';

interface VideoData { title: string; downloadLink: string; }
interface TwitterData { imgUrl: string; downloadLink: string; videoTitle: string; videoDescription: string; }
interface SnackVideoData { url: string; title: string; description: string; thumbnail: string; uploadDate: string; videoUrl: string; duration: string; interaction: { views: number; likes: number; shares: number; }; creator: { name: string; profileUrl: string; bio: string; }; }
const APIUtils = {
  async twitt(url: string): Promise<TwitterData | null> {
    const _api = `https://api.siputzx.my.id/api/d/twitter?url=${url}`;
    try { const { data } = await axios.get(_api);
      if (data.status && data.data) {
        return { imgUrl: data.data.imgUrl, downloadLink: data.data.downloadLink, videoTitle: data.data.videoTitle || "untitled", videoDescription: data.data.videoDescription || "No desc" };
      }
      throw new Error("Invalid");
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async SnackVideo(url: string): Promise<SnackVideoData | null> {
    const _api = `https://api.siputzx.my.id/api/d/snackvideo?url=${url}`;
    try { const { data } = await axios.get(_api);
      if (data.status && data.data) {
        return { url: data.data.url, title: data.data.title, description: data.data.description, thumbnail: data.data.thumbnail, uploadDate: data.data.uploadDate, videoUrl: data.data.videoUrl, duration: data.data.duration, interaction: { views: data.data.interaction.views, likes: data.data.interaction.likes, shares: data.data.interaction.shares }, creator: { name: data.data.creator.name, profileUrl: data.data.creator.profileUrl, bio: data.data.creator.bio } };
      }
      throw new Error("Invalid");
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async SeeGore(url: string): Promise<any | null> {
    const _api = `https://api.siputzx.my.id/api/d/seegore?url=${url}`;
    try { const { data } = await axios.get(_api);
      if (data.status && data.data) {
        return { title: data.data.title, author: data.data.author, postedOn: new Date(data.data.postedOn).toLocaleString(), commentsCount: parseInt(data.data.commentsCount.replace(/\D/g, "")) || 0, viewsCount: data.data.viewsCount, rating: { value: parseFloat(data.data.rating.value), count: parseInt(data.data.rating.count.replace(/\D/g, "")) || 0 }, videoSrc: data.data.videoSrc };
      }
      throw new Error("Invalid");
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async Spotify(url: string): Promise<any | null> {
    const _api = `https://api.siputzx.my.id/api/d/spotify?url=${url}`;
    try { const { data } = await axios.get(_api);
      if (data.status && data.metadata) {
        return { albumArtist: data.metadata.album_artist, albumName: data.metadata.album_name, artist: data.metadata.artist, trackName: data.metadata.name, trackUrl: data.metadata.url, coverUrl: data.metadata.cover_url, releaseDate: new Date(data.metadata.releaseDate).toLocaleDateString(), trackNumber: data.metadata.trackNumber, downloadLink: data.download };
      }
      throw new Error("Invalid");
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async YouTube(text: string): Promise<any | null> {
    const _api = `https://api.siputzx.my.id/api/d/youtube?q=${text}`;
    try { const { data } = await axios.get(_api);
      if (data.status && data.data) {
        return { title: data.data.title, duration: data.data.duration, thumbnailUrl: data.data.thumbnailUrl, videoUrl: data.data.video, soundUrl: data.data.sounds };
      }
      throw new Error("Invalid");
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async Ytmp3(url: string): Promise<VideoData | null> {
    const _api = `https://api.siputzx.my.id/api/d/ytmp3?url=${url}`;
    try { const { data } = await axios.get(_api);
      if (data.status && data.data) {
        return { title: data.data.title, downloadLink: data.data.dl };
      }
      throw new Error("Invalid");
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async Ytmp4(url: string): Promise<VideoData | null> {
    const _api = `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`;
    try { const { data } = await axios.get(_api);
      if (data.status && data.data) {
        return { title: data.data.title, downloadLink: data.data.dl };
      }
      throw new Error("Invalid");
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};

export default APIUtils;
      
