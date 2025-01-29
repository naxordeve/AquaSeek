const fetch = require('node-fetch');

class LeptonAI {
    constructor(apiKey) {
        this.apiUrl = 'https://api.botcahx.eu.org/api/search/lepton-ai';
        this.apiKey = apiKey;
    }

    async search(query) {
        const res = await fetch(`${this.apiUrl}?text=${query}&apikey=${this.apiKey}`);
        if (!res.ok) {
        return { error: `${res.status}` };
        }

        const data = await res.json();
        if (data.status) {
            return {
                creator: data.creator,
                result: data.result.result,
                sources: data.result.sources,
            };
        } else {
            return { error: 'oops🤣' };
        }
    }
}

class BingChat {
    constructor(apiKey) {
        this.apiUrl = 'https://api.botcahx.eu.org/api/search/bing-chat';
        this.apiKey = apiKey;
    }

    async search(query) {
        const res = await fetch(`${this.apiUrl}?text=${query}&apikey=${this.apiKey}`);
        if (!res.ok) {
        return { error: `${res.status}` };}
        const data = await res.json();
        if (data.status) {
            return {
                creator: data.creator,
                message: data.message,
            };
        } else {
            return { error: 'ehe' };
        }
    }
}

class BingImage {
    constructor(apiKey) {
        this.apiUrl = 'https://api.botcahx.eu.org/api/search/bing-img';
        this.apiKey = apiKey;
    }

    async search(query) {
        const voidi = await fetch(`${this.apiUrl}?text=${query}&apikey=${this.apiKey}`);
        if (!voidi.ok) {
            return { error: `${voidi.status}` };
        }

        const data = await voidi.json();
        if (data.status) {
            return {
                creator: data.creator,
                images: data.result,
            };
        } else {
            return { error: 'err' };
        }
    }
}

class StableDiffusion {
    constructor(apiKey) {
        this.apiUrl = 'https://api.botcahx.eu.org/api/search/stablediffusion';
        this.apiKey = apiKey;
    }

    async search(query) {
        const res = await fetch(`${this.apiUrl}?text=${query}&apikey=${this.apiKey}`);
        if (!res.ok) {
        return { error: `${res.status}` };
        }

        const data = await res.json();
        if (data.status) {
            return {
                creator: data.creator,
                image: data.result,
            };
        } else {
            return { error: 'err' };
        }
    }
}

class WhatMusic {
    constructor(apiKey) {
        this.apiUrl = 'https://api.botcahx.eu.org/api/tools/whatmusic';
        this.apiKey = apiKey;
    }

    async identify(url) {
        const voidi = await fetch(`${this.apiUrl}?url=${url}&apikey=${this.apiKey}`);
        if (!voidi.ok) {
        return { error: `${voidi.status}` };
        }
        const data = await voidi.json();
        if (data.status) {
            return {
                creator: data.creator,
                title: data.result.match(/Title: (.+)/)?.[1],
                artists: data.result.match(/Artists: (.+)/)?.[1],
                duration: data.result.match(/Duration: (.+)/)?.[1],
                release: data.result.match(/Release: (.+)/)?.[1],
                genre: data.result.match(/Genre: (.+)/)?.[1],
                score: data.result.match(/Score: (.+)/)?.[1],
                source: data.result.match(/Source: (.+)/)?.[1],
            };
        } else {
            return { error: 'err' };
        }
    }
}

module.exports = { LeptonAI, BingChat, BingImage, StableDiffusion, WhatMusic };
