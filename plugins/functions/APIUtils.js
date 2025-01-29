const fetch = require('node-fetch');

const APIUtils = {
    async twitt(url) {
        const _api = `https://api.siputzx.my.id/api/d/twitter?url=${url}`;
        try {
            const res = await fetch(_api);
            if (!res.ok) {
            throw new Error(`${res.status}`);}
            const data = await res.json();
            if (data.status && data.data) {
                return {
                    imgUrl: data.data.imgUrl,
                    downloadLink: data.data.downloadLink,
                    videoTitle: data.data.videoTitle || "untitled",
                    videoDescription: data.data.videoDescription || "No desc"
                };
            } else {
                throw new Error("Invalid");
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async SnackVideo(url) {
        const _api = `https://api.siputzx.my.id/api/d/snackvideo?url=${url}`;
        try {
            const res = await fetch(_api);
            if (!res.ok) {
            throw new Error(`${res.status}`);}
            const data = await res.json();
            if (data.status && data.data) {
                return {
                    url: data.data.url,
                    title: data.data.title,
                    description: data.data.description,
                    thumbnail: data.data.thumbnail,
                    uploadDate: data.data.uploadDate,
                    videoUrl: data.data.videoUrl,
                    duration: data.data.duration,
                    interaction: {
                        views: data.data.interaction.views,
                        likes: data.data.interaction.likes,
                        shares: data.data.interaction.shares
                    },
                    creator: {
                        name: data.data.creator.name,
                        profileUrl: data.data.creator.profileUrl,
                        bio: data.data.creator.bio
                    }
                };
            } else {
                throw new Error("Invalid");
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async SeeGore(url) {
        const _api = `https://api.siputzx.my.id/api/d/seegore?url=${url}`;
        try {
            const res = await fetch(_api);
            if (!res.ok) {
            throw new Error(`${res.status}`);}
            const data = await res.json();
            if (data.status && data.data) {
                return {
                    title: data.data.title,
                    author: data.data.author,
                    postedOn: new Date(data.data.postedOn).toLocaleString(),
                    commentsCount: parseInt(data.data.commentsCount.replace(/\D/g, "")) || 0,
                    viewsCount: data.data.viewsCount,
                    rating: {
                        value: parseFloat(data.data.rating.value),
                        count: parseInt(data.data.rating.count.replace(/\D/g, "")) || 0
                    },
                    videoSrc: data.data.videoSrc
                };
            } else {
                throw new Error("Invalid");
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async Spotify(url) {
        const _api = `https://api.siputzx.my.id/api/d/spotify?url=${url}`;
        try {
            const voidi = await fetch(_api);
            if (!voidi.ok) {
            throw new Error(`${voidi.status}`);}
            const data = await voidi.json();
            if (data.status && data.metadata) {
                return {
                    albumArtist: data.metadata.album_artist,
                    albumName: data.metadata.album_name,
                    artist: data.metadata.artist,
                    trackName: data.metadata.name,
                    trackUrl: data.metadata.url,
                    coverUrl: data.metadata.cover_url,
                    releaseDate: new Date(data.metadata.releaseDate).toLocaleDateString(),
                    trackNumber: data.metadata.trackNumber,
                    downloadLink: data.download,
                };
            } else {
                throw new Error("Invalid");
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async YouTube(text) {
        const _api = `https://api.siputzx.my.id/api/d/youtube?q=${text}`;
        try {
            const res = await fetch(_api);
            if (!resp.ok) {
            throw new Error(`${res.status}`);
            }
            const data = await res.json();
            if (data.status && data.data) {
                return {
                    title: data.data.title,
                    duration: data.data.duration,
                    thumbnailUrl: data.data.thumbnailUrl,
                    videoUrl: data.data.video,
                    soundUrl: data.data.sounds
                };
            } else {
                throw new Error("Invalid");
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async Ytmp3(url) {
        const _api = `https://api.siputzx.my.id/api/d/ytmp3?url=${url}`;
        try {
            const res = await fetch(_api);
            if (!res.ok) {
            throw new Error(`${res.status}`);}
            const data = await res.json();
            if (data.status && data.data) {
                return {
                    title: data.data.title,
                    downloadLink: data.data.dl
                };
            } else {
                throw new Error("Invalid");
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async Ytmp4(url) {
        const _api = `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`;
        try {
            const res = await fetch(_api);
            if (!res.ok) {
            throw new Error(`${res.status}`);}
            const data = await res.json();
            if (data.status && data.data) {
                return {
                    title: data.data.title,
                    downloadLink: data.data.dl
                };
            } else {
                throw new Error("_Invalid_");
            }
        } catch (error) {
            console.error(error);
            return null;
        }
  
  }
};

module.exports = APIUtils;
