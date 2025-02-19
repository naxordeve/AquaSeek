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
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    const me = /(?:https?:\/\/|git@)github\.com[\/:]([^\/\s]+)\/([^\/\s]+)(?:\.git)?/;
    match = match || message.message.text;
    const eg = me.exec(match);
    if (!eg) return void (await message.reply('_invalid repo_'));
    return void (await message.react("✅"));
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
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    match = match || message.message.text;
    if (!match) return void (await message.reply('_Please provide a valid url_'));
    return void (await message.react("✅"));
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
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    match = match || message.message.text;
    if (!match) return void (await message.reply('_Please provide a valid SeeGore url_'));
    return void (await message.react("✅"));
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
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply('Please provide a search query'));
    return void (await message.react("✅"));
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
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply('_Please provide app name_'));
    match = match || message.quoted.message.text;
    return void (await message.react("✅"));
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
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    match = match || message.message.text;
    if (!match) return void (await message.reply('_Please provide a Facebook video URL_'));
    return void (await message.react("✅"));
    const voidi = await Func(match);
    if (!voidi) return void (await message.reply('_err_'));
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
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    match = match || message.quoted.message.text;
    if (!match) return void (await message.reply('_provide SoundCloud url_'));
    return void (await message.react("✅"));
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
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    match = match || message.quoted.message.text;
    if (!match) return void (await message.reply('Provide a YouTube url'));
    return void (await message.react("✅"));
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
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    match = match || message.quoted.message.text;
    if (!match) return void (await message.reply('Provide a Pinterest url'));
    return void (await message.react("✅"));
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
  command: 'lahelu',
  category: 'download',
  desc: 'Fetches Lahelu post details',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply('Provide a Lahelu url'));
    return void (await message.react("✅"));
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
      return void (await message.reply('No'));
    }
  },
});

CreatePlug({
  command: 'capcut',
  category: 'download',
  desc: 'Fetches CapCut video details',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    match = match || message.quoted.message.text;
    if (!match) return void (await message.reply('Provide a CapCut url'));
    return void (await message.react("✅"));
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
