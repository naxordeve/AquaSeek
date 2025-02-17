import * as fetch from 'node-fetch';

interface Video {
    title: string;
    url: string;
    duration: string;
    views: string;
    uploaded: string;
    author: string;
}

interface YtsResponse {
    videos: Video[];
}

export default async function yts(query: string, limit: number = 1): Promise<Video | { error: string }> {
    const url = `https://diegoson-naxordeve.hf.space/yts/search?query=${query}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`${response.status}`);
    }
    
    const data: YtsResponse = await response.json();
    if (data.videos && data.videos.length > 0) {
        const video = data.videos[0];
        return {
            title: video.title,
            url: video.url,
            duration: video.duration,
            views: video.views,
            uploaded: video.uploaded,
            author: video.author
        };
    } else {
        return { error: 'err' };
    }
}
