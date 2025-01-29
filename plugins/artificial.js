const { CreatePlug } = require('../lib/commands');
const { ChatGPT, GeminiAI } = require('./functions/gpt');
const { Yousearch, BlackBox, AoyoContent, Venice, Mistral } = require('./functions/naxor');
const { getMorphic } = require('./functions/morphic');
const { Diffuser } = require('./functions/diffuser');

CreatePlug({
    command: 'diffuser',
    category: 'Artficial',
    desc: 'Generate an image based on a prompt',
    execute: async (message, conn, match) => {
      await message.react('🎨');
      if (!match) return message.reply('Please provide a prompt');
      const voidi = await Diffuser(match);
      await conn.sendMessage(message.user, { image: voidi, caption: `Diffuser\nMade with❣️` });
    }
  });

CreatePlug({
  command: 'morphic',
  category: 'Artficial',
  desc: 'morphic ai hehe',
  execute: async (message, conn, match) => {
    await message.react('🗣️');
    if (!match)  return message.reply('_Need a prompt_');
    const voidi = await getMorphic(match);
    if (voidi.error)  return message.reply(` ${voidi.error}`)
    const _msg = `\n\n**${voidi.result}**\n\n**${voidi.related.join('\n')}**`;
    await message.reply(_msg);
  },
});
        
CreatePlug({
  command: 'gemini',
  category: 'Artficial',
  desc: 'Ask Gemini AI anything',
  execute: async (message, conn, match) => {
    await message.react('🗣️');
    if (!match) return message.reply('_Please provide a query_');
    var voidi = await GeminiAI(match);
    return message.reply(voidi);
  },
});

CreatePlug({
  command: 'ai',
  category: 'Artficial',
  desc: 'Ask ChatGPT anything',
  execute: async (message, conn, match) => {
    if (!match) return message.reply('_Please provide a prompt_');
    await message.react('🗣️');
    var voidi = await ChatGPT(match);
    return message.reply(voidi);
  },
});


const astral_0x42d851=astral_0x2946;function astral_0x2946(_0x21b8dc,_0xf1952){const _0x59a7cf=astral_0x59a7();return astral_0x2946=function(_0x294624,_0x2087f7){_0x294624=_0x294624-0xd7;let _0x1691c9=_0x59a7cf[_0x294624];return _0x1691c9;},astral_0x2946(_0x21b8dc,_0xf1952);}(function(_0xf945eb,_0x59fca2){const _0x1f1cff=astral_0x2946,_0x2a00d2=_0xf945eb();while(!![]){try{const _0x318c29=-parseInt(_0x1f1cff(0xe1))/0x1*(-parseInt(_0x1f1cff(0xda))/0x2)+parseInt(_0x1f1cff(0xe8))/0x3*(parseInt(_0x1f1cff(0xdf))/0x4)+parseInt(_0x1f1cff(0xe9))/0x5+parseInt(_0x1f1cff(0xd8))/0x6+-parseInt(_0x1f1cff(0xe7))/0x7*(parseInt(_0x1f1cff(0xe6))/0x8)+-parseInt(_0x1f1cff(0xdc))/0x9+-parseInt(_0x1f1cff(0xe2))/0xa*(parseInt(_0x1f1cff(0xdb))/0xb);if(_0x318c29===_0x59fca2)break;else _0x2a00d2['push'](_0x2a00d2['shift']());}catch(_0x30eebc){_0x2a00d2['push'](_0x2a00d2['shift']());}}}(astral_0x59a7,0x9c960));const axios=require(astral_0x42d851(0xdd)),model=[astral_0x42d851(0xe0),astral_0x42d851(0xe5)],GPT4o=_0x442393=>{return new Promise(async(_0x29e407,_0x268066)=>{const _0x23440d=astral_0x2946;try{const _0x52a6f8=await axios(_0x23440d(0xeb),{'headers':{'authorization':'Bearer\x20yzgpt-sc4tlKsMRdNMecNy','content-type':'application/json'},'data':{'messages':[{'role':_0x23440d(0xd7),'content':_0x442393}],'model':'yanzgpt-revolution-25b-v3.5'},'method':_0x23440d(0xe4)});_0x29e407(_0x52a6f8[_0x23440d(0xe3)][_0x23440d(0xec)][0x0][_0x23440d(0xd9)][_0x23440d(0xde)]);}catch(_0x251ca8){_0x268066(_0x251ca8[_0x23440d(0xea)]?_0x251ca8[_0x23440d(0xea)]['data']:_0x251ca8['message']);}});};function astral_0x59a7(){const _0x5bb9ad=['1RJKXeh','5707490NjogdI','data','POST','yanzgpt-legacy-72b-v3.5','200OGqNCr','152957CnOlzU','9yGlXsd','1733660LVcCoe','response','https://api.yanzgpt.my.id/v1/chat','choices','user','5238372WnlLYX','message','642268XNhtGN','11eLopwp','2590875GPgOLz','axios','content','673796nizHsp','yanzgpt-revolution-25b-v3.5'];astral_0x59a7=function(){return _0x5bb9ad;};return astral_0x59a7();}
CreatePlug({
    command: 'gpt',
    category: 'Artficial',
    desc: 'Interact with GPT4-o',
    execute: async (message, conn, match) => {
        if (!match) return message.reply('_Please provide a prompt_');
        await message.react('🗣️');
        const voidi = await GPT4o(match);
        await message.reply(voidi);
    }
});
  
  CreatePlug({
    command: 'yousearch',
    category: 'Artficial',
    desc: '',
    execute: async (message, conn, match) => {
      await message.react('💡');
      if (!match) return message.reply('Please provide a query');
      const voidi = await Yousearch(match);
      return message.reply(voidi);
    }
  });

  CreatePlug({
    command: 'venice',
    category: 'Artficial',
    desc: 'Interact with the Venice AI',
    execute: async (message, conn, match) => {
      await message.react('💬');
      if (!match) return message.reply('Please provide a prompt');
      const voidi = await Venice(match);
      return message.reply(voidi);
    }
  });

 CreatePlug({
    command: 'blackbox',
    category: 'Artficial',
    desc: 'bbb_',
    execute: async (message, conn, match) => {
      await message.react('📦');
      if (!match) return message.reply('_Please provide content_');
      const voidi = await BlackBox(match);
      return message.reply(voidi);
    }
  });

  CreatePlug({
    command: 'aoyo',
    category: 'Artficial',
    desc: 'Fetch information using the Aoyo',
    execute: async (message, conn, match) => {
      await message.react('📜');
      if (!match) return message.reply('Please provide content');
      const voidi = await AoyoContent(match);
      return message.reply(voidi);
    }
  });

  CreatePlug({
    command: 'mistral',
    category: 'Artficial',
    desc: 'Interact with the Mistral-7B Instruct',
    execute: async (message, conn, match) => {
      await message.react('🤖');
      if (!match) return message.reply('Please provide content');
      const res = await Mistral(match);
      return message.reply(res);
    }
  });
    
