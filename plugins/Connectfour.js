const { CreatePlug } = require("../lib/commands");
const ConnectFour = require("../lib/connectfour");

CreatePlug({
    command: "connect4",
    category: "game",
    execute: async (message, conn, match) => {
    this.games = this.games || {};
    if (Object.values(this.games).some(game => game.players.includes(message.sender))) {
      return message.reply("_You are already in a game_");}
    let game = Object.values(this.games).find(g => g.state === "WAITING");
    if (game) {
      game.players.push(message.sender);
      game.state = "PLAYING";
      game.instance = new ConnectFour("🔴", "🟡");
      let board = game.instance.render();
      return message.reply(`🎮 *Connect Four* 🎮\n\n${board}\n\n🔴 ${game.players[0]}\n🟡 ${game.players[1]}\n\nIts ${game.instance.getCurrentPlayer()}s turn`);
    } else {
      let gameId = "connect4-" + new Date().getTime();
      this.games[gameId] = {
        id: gameId,
        players: [message.sender],
        state: "WAITING",
        instance: null,
      };
      return message.reply("_Waiting for an opponent... Type connect4 to join_");
    }
  }
});

CreatePlug({
    on: "text",
    execute: async (message,conn, match) => {
    this.games = this.games || {};
    let game = Object.values(this.games).find(g => g.players.includes(message.sender) && g.state === "PLAYING");
    if (!game) return;
    let column = parseInt(match);
    if (isNaN(column) || column < 1 || column > 7) return;
    let result = game.instance.dropPiece(column - 1);
    if (!result.success) return message.reply(result.message);
    let board = game.instance.render();
    let response = `🎮 *Connect Four* 🎮\n\n${board}\n\n🔴 ${game.players[0]}\n🟡 ${game.players[1]}`;
    if (result.message.includes("wins")) {
      response += `\n\n🎉 *${game.instance.getCurrentPlayer()} wins*`;
      delete this.games[game.id];
    } else if (result.message.includes("draw")) {
      response += `\n\n🤝 *Its a draw*`;
      delete this.games[game.id];
    } else {
      response += `\n\nIts ${game.instance.getCurrentPlayer()}s turn`;
    }

    return message.reply(response);
  }
});
                        
