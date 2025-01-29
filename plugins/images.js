//carbon❣️
const GetImage = require('./functions/Gimage');
const astral_0xf0c8d8=astral_0x88ec;function astral_0x129c(){const _0x19a8bb=['12DTrLFY','508122MjYeoZ','🗣️','2472988lOdQbJ','192EQSLnJ','138795KsjLvX','15672481wSmirQ','5148970ROSKXX','Generate\x20an\x20image\x20from\x20provided\x20code','image\x20maker','88VjbTEX','26848drtoWv','54zJVSgQ','26EFSjzD','https://itzpire.com/maker/carbon?code=','*_Your\x20Carbon_*\x0aMade\x20with\x20❣️','../lib/commands','44050IOWHLG','sendMessage','reply','user','react'];astral_0x129c=function(){return _0x19a8bb;};return astral_0x129c();}(function(_0x489e13,_0x45517d){const _0x5c295d=astral_0x88ec,_0x2ce4fd=_0x489e13();while(!![]){try{const _0x1f545=-parseInt(_0x5c295d(0x107))/0x1*(parseInt(_0x5c295d(0xf5))/0x2)+-parseInt(_0x5c295d(0xfe))/0x3*(parseInt(_0x5c295d(0x105))/0x4)+-parseInt(_0x5c295d(0xff))/0x5*(parseInt(_0x5c295d(0x106))/0x6)+parseInt(_0x5c295d(0xfd))/0x7+parseInt(_0x5c295d(0x104))/0x8*(-parseInt(_0x5c295d(0xfb))/0x9)+parseInt(_0x5c295d(0x101))/0xa+parseInt(_0x5c295d(0x100))/0xb*(parseInt(_0x5c295d(0xfa))/0xc);if(_0x1f545===_0x45517d)break;else _0x2ce4fd['push'](_0x2ce4fd['shift']());}catch(_0xa50138){_0x2ce4fd['push'](_0x2ce4fd['shift']());}}}(astral_0x129c,0x66819));function astral_0x88ec(_0x5a3777,_0x132e1f){const _0x129c8e=astral_0x129c();return astral_0x88ec=function(_0x88ec52,_0x1dabb7){_0x88ec52=_0x88ec52-0xf4;let _0x25d309=_0x129c8e[_0x88ec52];return _0x25d309;},astral_0x88ec(_0x5a3777,_0x132e1f);}const {CreatePlug}=require(astral_0xf0c8d8(0xf4));CreatePlug({'command':'carbon','category':astral_0xf0c8d8(0x103),'desc':astral_0xf0c8d8(0x102),'execute':async(_0x5d2317,_0x499c87,_0x42f5f2)=>{const _0x2eae87=astral_0xf0c8d8;await _0x5d2317[_0x2eae87(0xf9)](_0x2eae87(0xfc));if(!_0x42f5f2)return _0x5d2317[_0x2eae87(0xf7)]('_Please\x20provide\x20a\x20code\x20example.\x20For\x20example:\x20var\x20me\x20=\x20require_');const _0x5411e4=_0x2eae87(0x108)+_0x42f5f2;await _0x499c87[_0x2eae87(0xf6)](_0x5d2317[_0x2eae87(0xf8)],{'image':{'url':_0x5411e4},'caption':_0x2eae87(0x109)});}});

CreatePlug({
  command: 'gimage',
  category: 'media',
  desc: 'Searches for an image based on a query',
  execute: async (message, conn, match) => {
    await message.react('❣️');
    if (!match) return message.reply('_Please provide a query_');
    const search = new GetImage();
    const res = await search.Gimage(match);
    if (res.length === 0) return;
    const voidi= res[0];
    await conn.sendMessage(message.user, {
      image: { url: voidi.thumbnail },
      caption: `*Title:* ${voidi.title}\n*Link:* ${voidi.link}\n*Context:* ${voidi.contextLink}\n\nMade with❣️`,
    });
  },
});

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
