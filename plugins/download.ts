import { CreatePlug } from '../lib/commands';
import axios from 'axios';
import fetch from 'node-fetch';
import CONFIG from '../config';
import { Func } from './functions/fbdl';
import { Ring } from './functions/Ring';
import APIUtils from './functions/APIUtils';
import { SoundCloud, CapCut, MusicApple, AppleMusicSearch, YtPost, Pinterest, SaveFrom, Lahelu } from './functions/events';

CreatePlug({
  command: 'gitclone',
  category: 'download',
  desc: 'Clone a GitHub repository as a zip file',
  execute: async (message: any, conn: any, match: string) => {
    await message.react('❣️');
    const me = /(?:https?:\/\/|git@)github\.com[\/:]([^\/\s]+)\/([^\/\s]+)(?:\.git)?/;
    match = match || message.message.text;
    const eg = me.exec(match);
    if (!eg) return message.reply('_invalid repo_');
    const [_, username, repo] = eg;
    const api = `https://api.github.com/repos/${username}/${repo.replace(/\.git$/, "")}`;
    const voidi = await axios.get(api).catch(() => null);
    if (!voidi || voidi.status !== 200) return;
    const { name, stargazers_count, forks_count } = voidi.data;
    const caption = `**Name:** ${name}\n**Forks:** ${forks_count}`;
    await conn.sendMessage(message.user, { document: { url: `${api}/zipball` }, caption, fileName: `${repo}.zip`, mimetype: "application/zip" });
  },
});

CreatePlug({
  command: 'snackvideo',
  category: 'download',
  desc: 'Download media from SnackVideo',
  execute: async (message: any, conn: any, match: string) => {
    await message.react('🗣️');
    match = match || message.message.text;
    if (!match) return message.reply('_Please provide a valid url_');
    const voidi = await APIUtils.SnackVideo(match);
    if (voidi) {
      await conn.sendMessage(message.user, {
        video: { url: voidi.videoUrl },
        caption: `${voidi.description}\n${voidi.uploadDate}\n${voidi.duration}\n\nMade with❣️`,
      });
    } else {
      return;
    }
  },
});

CreatePlug({
  command: 'seegore',
  category: 'download',
  desc: 'Download media from SeeGore',
  execute: async (message: any, conn: any, match: string) => {
    await message.react('🗣️');
    match = match || message.message.text;
    if (!match) return message.reply('_Please provide a valid SeeGore url_');
    const voidi = await APIUtils.SeeGore(match);
    if (voidi) {
      await conn.sendMessage(message.user, {
        video: { url: voidi.videoSrc },
        caption: `${voidi.title}\n${voidi.postedOn}\n${voidi.viewsCount}\n\nMade With❣️`,
      });
    } else {
      return;
    }
  },
});

CreatePlug({
  command: 'ringtone',
  category: 'download',
  desc: 'send ringtones based on a query',
  execute: async (message: any, conn: any, match: string) => {
    if (!match) return message.reply('Please provide a search query');
    await message.react('❣️');
    const results = await Ring(match);
    if (!results?.length) return;
    const ringtone = results[0];
    await conn.sendMessage(message.user, { audio: { url: ringtone.audio }, mimetype: 'audio/mpeg', fileName: `${ringtone.title}.mp3`, caption: `*Title:* ${ringtone.title}\nMade with❣️` }).catch(err => {
      console.error(err.message);
    });
  }
});

CreatePlug({
  command: 'apk',
  category: 'download',
  desc: 'Download APK',
  execute: async (message: any, conn: any, match: string) => {
    if (!match) return message.reply('_Please provide app name_');
    match = match || message.message.text;
    await message.react('❣️');
    const search = `https://bk9.fun/search/apk?q=${match}`;
    const smd = await fetch(search).then((res) => res.json());
    if (!smd || !smd.BK9 || smd.BK9.length === 0) return;
    const down = `https://bk9.fun/download/apk?id=${smd.BK9[0].id}`;
    const voidi = await fetch(down).then((res) => res.json());
    if (!voidi || !voidi.BK9 || !voidi.BK9.dllink) return message.reply('_err');
    const detail = { document: { url: voidi.BK9.dllink }, fileName: voidi.BK9.name, mimetype: "application/vnd.android.package-archive", caption: `*${voidi.BK9.name}*\nMade with❣️` };
    await conn.sendMessage(message.user, detail, { quoted: message });
  },
});

CreatePlug({
  command: 'facebook',
  category: 'download',
  desc: 'Download Facebook videos',
  execute: async (message: any, conn: any, match: string) => {
    match = match || message.message.text;
    if (!match) return message.reply('_Please provide a Facebook video URL_');
    await message.react('❣️');
    const voidi = await Func(match);
    if (!voidi) return message.reply('_err_');
    const smd = voidi["720p"] || voidi["360p"];
    const quality = voidi["720p"] ? '720p (HD)' : '360p (SD)';
    if (!smd) return;
    await conn.sendMessage(message.user, { video: { url: smd }, caption: `*Quality:* ${quality}\nMade with ❣️` });
  }
});

CreatePlug({
  command: 'soundcloud',
  category: 'download',
  desc: 'SoundCloud audio download',
  execute: async (message: any, conn: any, match: string) => {
    await message.react('🎧');
    match = match || message.message.text;
    if (!match) return message.reply('_provide SoundCloud url_');
    const result = await SoundCloud(match);
    if (!result.success) return;
    await conn.sendMessage(message.user, {
      audio: { url: result.audioUrl }, mimetype: 'audio/mpeg',
      contextInfo: {
        externalAdReply: {
          title: `${result.title}`,
          body: result.title,
          thumbnailUrl: result.thumbnail,
          showAdAttribution: true,
        },
      },
    });
  },
});

CreatePlug({
  command: 'ytpost',
  category: 'download',
  desc: 'Fetches YouTube post details',
  execute: async (message: any, conn: any, match: string) => {
    await message.react('📹');
    match = match || message.message.text;
    if (!match) return message.reply('Provide a YouTube url');
    const result = await YtPost(match);
    if (!result.success) return;
    const caption = result.content ? `${result.content}\n${result.postld}\nMade with❣️` : 'Made with❣️';
    await conn.sendMessage(message.user, {
      image: { url: result.images[0] },
      caption: caption,
    });
  },
});

CreatePlug({
  command: 'pinterest',
  category: 'download',
  desc: 'Fetches Pinterest video details.',
  execute: async (message: any, conn: any, match: string) => {
    await message.react('📌');
    match = match || message.message.text;
    if (!match) return message.reply('Provide a Pinterest url');
    const result = await Pinterest(match);
    if (!result.success) return;
    const caption = result.id ? `Post ID: ${result.id}\n\n${result.createdAt}\nMade with❣️` : 'Made with❣️';
    await conn.sendMessage(message.user, {
      video: { url: result.videoUrl },
      caption: caption,
    });
  },
});

CreatePlug({
  command: 'savefrom',
  category: 'download',
  desc: 'Fetches video download options from SaveFrom.',
  execute: async (message: any, conn: any, match: string) => {
    await message.react('📥');
    match = match || message.message.text;
    if (!match) return message.reply('Provide a video url');
    const result = await SaveFrom(match);
    if (!result.success) return;
    const caption = result.title ? `${result.titl}\nMade with❣️` : 'Made with❣️';
    await conn.sendMessage(message.user, {
      video: { url: result.videoUrl[0].url },
      caption: caption,
    });
  },
});

CreatePlug({
  command: 'lahelu',
  category: 'download',
  desc: 'Fetches Lahelu post details',
  execute: async (message: any, conn: any, match: string) => {
    await message.react('📑');
    if (!match) return message.reply('Provide a Lahelu url');
    const result = await Lahelu(match);
    if (!result.success) return;
    const caption = result.title ? `${result.title}\nMade with❣️` : 'Made with❣️';
    if (result.media && result.media.length > 0) {
      const mediaUrl = result.media[0];
      if (mediaUrl.endsWith('.mp4')) {
        await conn.sendMessage(message.user, {
          video: { url: mediaUrl },
          caption: caption,
        });
      } else {
        await conn.sendMessage(message.user, {
          image: { url: mediaUrl },
          caption: caption,
        });
      }
    } else {
      await message.reply('No');
    }
  },
});

CreatePlug({
  command: 'searchapplemusic',
  category: 'search',
  desc: 'Searches for music on Apple Music',
  execute: async (message: any, conn: any, match: string) => {
    await message.react('🔍');
    if (!match) return message.reply('Provide a query to search');
    const result = await AppleMusicSearch(match);
    if (!result.success) return;
    const Object = result.results.map(item =>
      `*APPLE MUSIC SEARCH*\n\n*${item.title}*\n*Artist*: ${item.artist}\n*Url* ${item.link}\nMade with❣️`).join('\n\n');
    await message.reply(Object);
  },
});

CreatePlug({
  command: 'capcut',
  category: 'download',
  desc: 'Fetches CapCut video details',
  execute: async (message: any, conn: any, match: string) => {
    await message.react('🎥');
    match = match || message.message.text;
    if (!match) return message.reply('Provide a CapCut url');
    const result = await CapCut(match);
    if (!result.success) return;
    const caption = result.title ? `${result.title}\nMade with❣️` : 'Made with❣️';
    await conn.sendMessage(message.user, {
      video: { url: result.originalVideoUrl },
      caption: caption,
      contextInfo: {
        externalAdReply: {
          title: result.title,
          body: result.description,
          thumbnailUrl: result.coverUrl,
          showAdAttribution: true,
        },
      },
    });
  },
});
