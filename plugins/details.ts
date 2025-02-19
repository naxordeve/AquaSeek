import { CreatePlug } from '../lib/index';
import { TNewsDetails } from './functions/tech';
import { TKAnnis } from './functions/Tk';  
import { AnimeS } from './functions/anime';
import { APIS } from './functions/search';

CreatePlug({
  command: 'tnews',
  category: 'news',
  desc: 'Get the latest telecom news',
  execute: async (message: any, conn: any): Promise<void> => {
    await message.react("✅");
    const voidi = await TNewsDetails();
    if (!voidi) return void (await message.reply('_oops_'));
    await conn.sendMessage(message.user, {
      image: { url: voidi.image }, 
      caption: `*Telecom News:* ${voidi.title}\nLink: ${voidi.link}\n\nDescription: ${voidi.description}\n\nMade with❣️`
    });
  }
});
      
CreatePlug({
  command: 'tiktokstalk',
  category: 'Utility',
  desc: 'Get TikTok profile details',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply('_Please provide a TikTok username_'));
    await message.react("✅");
    const p = await TKAnnis(match);
    if (!p) return;
    await conn.sendMessage(message.user, {
      image: { url: p.profileImage }, 
      caption: `*Name:* ${p.name}\n*Username:* ${p.username}\n*Followers:* ${p.followers}\n*Following:* ${p.following}\n*Likes:* ${p.likes}\n*Bio:* ${p.bio || 'eish'}`
    });
  }
});

CreatePlug({
  command: 'npmstalk',
  category: 'Utility',
  desc: 'Fetch information about an NPM package.',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply('_Please provide the name of the npm package_'));
    await message.react("✅");
    const p = await APIS.npmSearch(match);
    if (!p) return void (await message.reply('_err_'));
    const voidi = `
*_Name_:* ${p.packageName}
*_Version_:* ${p.latestVersion}
*_Init v_:* ${p.initialVersion}
*_Updates_:* ${p.updatesCount}
*_L _D count_:* ${p.latestDependenciesCount}
*_Init_D count_:* ${p.initialDependenciesCount}
*_First published_:* ${p.firstPublished}
*_Last updated_:* ${p.lastUpdated}
    `.trim();
    await conn.sendMessage(message.user, { text: voidi });
  },
});

CreatePlug({
  command: 'githubstalk',
  category: 'Utility',
  desc: 'Fetch information about a GitHub user',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply('Please provide the git username'));
    await message.react("✅");
    const xastral = await APIS.GIT(match);
    if (!xastral) return;
    const msg = `
*Username:* ${xastral.username}
*Nickname:* ${xastral.nickname || 'astral'}
*Bio:* ${xastral.bio || 'astral'}
*Profile URL:* ${xastral.profileUrl}
*Type:* ${xastral.userType}
*Admin:* ${xastral.isAdmin ? 'Yes' : 'No'}
*Company:* ${xastral.company || 'astral'}
*Blog:* ${xastral.blog || 'astral'}
*Location:* ${xastral.location || 'astral'}
*Public Repos:* ${xastral.publicRepos}
*Public Gists:* ${xastral.publicGists}
*Followers:* ${xastral.followers}
*Following:* ${xastral.following}
*Account Created:* ${xastral.accountCreated}
*Last Updated:* ${xastral.lastUpdated}
    `.trim();
    await conn.sendMessage(message.user, {
      image: { url: xastral.profilePicture },
      caption: msg, 
    });
  },
});

CreatePlug({
  command: 'animesh', 
  category: 'Anime',
  desc: 'Search for anime details',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply('_Please provide the name of the anime_'));
    await message.react("✅");
    const voidi = await AnimeS(match, 'anime');
    const res = ` **Anime Title**: ${voidi.title}\n\n**Episodes**: ${voidi.episodes}\n**Status**: ${voidi.status}\n**Genres**: ${voidi.genres.join(', ')}\n**Season**: ${voidi.season}\n**Description**: ${voidi.description}\n\nMade with❣️`;
    await conn.sendMessage(message.user, { 
      image: { url: voidi.coverImage }, 
      caption: res
    });
  }
});

CreatePlug({
  command: 'charactersh',  
  category: 'Anime',
  desc: 'Search for character details',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply('_Please provide the name of the character_'));
    await message.react("✅");
    const voidi = await AnimeS(match, 'character');
    const res = `**Character Name**: ${voidi.name}\n**Native Name**: ${voidi.nativeName}\n**Description**: ${voidi.description}\n**Favourites**: ${voidi.favourites}\n**Appears In**: ${voidi.media.map((media: any) => media.title).join(', ')}\n\nMade with❣️`;
    await conn.sendMessage(message.user, { 
      image: { url: voidi.image.large }, 
      caption: res
    });
  }
});

CreatePlug({
  command: 'mangash',  
  category: 'Anime',
  desc: 'Search for manga details',
  execute: async (message: any, conn: any, match: string): Promise<void> => {
    if (!match) return void (await message.reply('_Please provide the name of the manga_'));
    await message.react("✅");
    const magas = await AnimeS(match, 'manga');
    const res = `**Manga Title**: ${magas.title}\n**Chapters**: ${magas.chapters}\n**Volumes**: ${magas.volumes}\n**Status**: ${magas.status}\n**Genres**: ${magas.genres.join(', ')}\n**Start Date**: ${magas.startDate}\n**End Date**: ${magas.endDate}\n**Description**: ${magas.description}\n\nMade with❣️`;
    await conn.sendMessage(message.user, { 
      image: { url: magas.coverImage.large }, 
      caption: res
    });
  }
});
