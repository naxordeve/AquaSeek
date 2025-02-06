class ConnectFour {
    constructor(player1 = "🔴", player2 = "🟡") {
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer = player1; 
        this.rows = 6;
        this.cols = 7;
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill("⚫"));
        this.winner = null;
    }

    getBoard() {
        return this.board;
        }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    switchTurn() {
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }

    dropPiece(col) {
        if (col < 0 || col >= this.cols || this.board[0][col] !== "⚫") {
            return { success: false, message: "Invalid" };}
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.board[row][col] === "⚫") {
                this.board[row][col] = this.currentPlayer;
                if (this.checkWin(row, col)) {
                    this.winner = this.currentPlayer;
                    return { success: true, message: `${this.currentPlayer} wins` };
                }
                this.switchTurn();
                return { success: true, message: "Move accepted" };
            }
        }
        return { success: false, message: "full" };
    }

    checkWin(row, col) {
        const directions = [
            { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: -1 }
        ];
        for (const { r, c } of directions) {
            if (this.countConsecutive(row, col, r, c) + this.countConsecutive(row, col, -r, -c) - 1 >= 4) {
                return true;
            }
        }
        return false;
    }

    countConsecutive(row, col, rowDir, colDir) {
        let count = 0;
        let r = row;
        let c = col;
        while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.board[r][c] === this.currentPlayer) {
            count++;
            r += rowDir;
            c += colDir;
        }
        return count;
    }

    render() {
        let result = "1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣\n";
        for (let row of this.board) {
            result += row.join("") + "\n";
        }
        return result;
    }
}

module.exports = ConnectFour;
