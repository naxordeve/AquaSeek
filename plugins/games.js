const {
  CreatePlug } = require('../lib/commands');

var voidi = {
  active: false,
  players: [],
  msg: 0,
  exec: [],
};

CreatePlug({
  command: "ludo",
  category: "games",
  desc: "ludo game",
  execute: async (message, conn, match) => {
    await message.react('🎲')
    if (!voidi.active && match.includes("start")) {
      voidi.active = true;
      voidi.players = [
        { id: message.user, icon: "🔴", position: -1 }, 
      ];
      voidi.exec = Array(18).fill("▫️").concat(["🏁"]); return await message.reply(
        `🎲 *Ludo Game Started by: ${message.user}*\nPlayer 2, type *ludo join* to join`
      );
    }

    if (voidi.active && match.includes("join")) {
      if (voidi.players.length === 2) {
        return await message.reply("_already full_");
      }
      var player2 = {
        id: message.user,
        icon: "🔵",
        position: -1,
      };
      voidi.players.push(player2); return await message.reply(
        `🔵 *${message.user} joined the game*\nPlayer 1 and Player 2, use */ludo row* to roll the dice`
      );
    }

    if (!voidi.active || voidi.players.length < 2) return await message.reply("_players not enough_");
    const msg = voidi.players[voidi.msg];
    if (message.user !== msg.id || !match.includes("row")) return await message.reply(`⏳ Its *${msg.id}* turn */ludo row* to roll`);
    const rollDice = () => Math.floor(Math.random() * 6) + 1;
    var diceRoll = rollDice();
    await conn.sendMessage(message.user, {
      text: `🎲 *${msg.id} rolled a ${diceRoll}*`, });
    if (msg.position === -1 && diceRoll === 6) {
      msg.position = 0; 
    } else if (msg.position >= 0) {
      msg.position += diceRoll;
      if (msg.position >= voidi.exec.length - 1) {
        msg.position = voidi.exec.length - 1
      }}

    var get = 1 - voidi.msg;
    var opponent = voidi.players[get];
    if (msg.position === opponent.position) {
      opponent.position = -1; 
      await conn.sendMessage(message.user, {text: `*${msg.id} cut ${opponent.id} token*`,
      });
    }

    if (msg.position === voidi.exec.length - 1) {
      voidi.active = false; 
      return await conn.sendMessage(message.user, {text: `_🏆 *${msg.id} wins_*`,
      });
    }

    const render = () => {
      const exec = [...voidi.exec];
      voidi.players.forEach((player) => {
        if (player.position >= 0) exec[player.position] = player.icon;
      });

      var rows = [];
      for (var i = 0; i < exec.length; i += 6) {
        rows.push(`Row ${Math.floor(i / 6) + 1}: ${exec
          .slice(i, i + 6)
          .join(" ")}`);
      }
      return rows.join("\n");
    };
    await conn.sendMessage(message.user, {text: `*Absolutely Hehe*:\n${render()}`,
 });
    voidi.msg = get;
    await conn.sendMessage(message.user, {
      text: `Its now *${voidi.players[voidi.msg].id} turn* */ludo row*to roll`,
    });
  },
});
      
