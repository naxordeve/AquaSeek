const TicTacToe = require("../lib/tictactoe");

CreatePlug({
    command: "ttt",
    category: "game",
    desc: "",
    execute: async (message, conn, match) => {
      this.game = this.game || {};
    if (Object.values(this.game).find((room) => room.id.startsWith("tictactoe") &&
          [room.game.playerX, room.game.playerO].includes(message.sender))
    ) { return message.reply("_You're already in a game_");}
    let room = Object.values(this.game).find(
      (room) => room.state === "WAITING" && (match ? room.name === match : true)
    );

    if (room) {
      room.o = message.user;
      room.game.playerO = message.participant || message.mentions[0];
      room.state = "PLAYING";
      let board = room.game.renderBoard();
      let response = `🎮 *Tic-Tac-Toe* 🎮

${board}

Current Turn: @${room.game.getCurrentTurn().split("@")[0]}
`;

      return await conn.sendMessage(message.user, { text: response, mentions: [room.game.getCurrentTurn()] });
    } else {
      room = {
        id: "tictactoe-" + +new Date(),
        x: message.user,
        o: "",
        game: new TicTacToe(message.sender, "O"),
        state: "WAITING",
      };

      if (match) room.name = match;
      message.reply("_Waiting for an opponent..._");
      this.game[room.id] = room;
    }
  }
       });

CreatePlug({
    on: "text",
    execute: async (message, conn, match) => {
    this.game = this.game || {};
    let room = Object.values(this.game).find(
      (room) =>
        room.id &&
        room.game &&
        room.state &&
        room.id.startsWith("tictactoe") &&
        [room.game.playerX, room.game.playerO].includes(message.sender) &&
        room.state === "PLAYING"
    );

    if (room) {
      let moveValid, isWin = false, isTie = false, isSurrender = false;
      if (!/^([1-9]|(me)?give_up|surr?ender|off|skip)$/i.test(match)) return;
      isSurrender = !/^[1-9]$/.test(match);
      if (message.sender !== room.game.getCurrentTurn()) {
        if (!isSurrender) return;}
      if (!isSurrender) {
        try {
          let moveResult = room.game.turn(parseInt(match) - 1);
          moveValid = true;
          isWin = moveResult.includes("wins");
          isTie = moveResult.includes("draw");
        } catch (error) {
          return message.reply(error.message);
        }
      } else {
        isWin = true;
      }

      let board = room.game.renderBoard();
      let winner = isSurrender ? room.game.getCurrentTurn() : room.game.getCurrentTurn();
      let response = `🎮 *Tic-Tac-Toe* 🎮

${board}

${
  isWin
    ? `🏆 @${winner.split("@")[0]} wins`
    : isTie
    ? `Its a draw`
    : `Current Turn: @${room.game.getCurrentTurn().split("@")[0]}`
}
❌: @${room.game.playerX.split("@")[0]}
⭕: @${room.game.playerO.split("@")[0]}`;
      await conn.sendMessage(message.user, { text: response, mentions: [room.game.getCurrentTurn(), room.game.playerX, room.game.playerO] });
      if (isWin || isTie) {
        delete this.game[room.id];
      }
    }
  }
      });
           
