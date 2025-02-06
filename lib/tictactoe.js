class TicTacToe {
    constructor(playerX = 'X', playerO = 'O') {
        this.playerX = playerX;
        this.playerO = playerO;
        this._currentTurn = false; 
        this._xState = 0; 
        this._oState = 0; 
        this.turnCount = 0; 
    }

    getBoard() {
        return Array(9).fill(null).map((_, i) => {
            if (this._xState & (1 << i)) return this.playerX;
            if (this._oState & (1 << i)) return this.playerO; 
            return i + 1; 
        });
    }

    getCurrentTurn() {
        return this._currentTurn ? this.playerO : this.playerX;}
    getEnemyTurn() {
        return this._currentTurn ? this.playerX : this.playerO;}
    renderToBinary() {
        return {
            [this.playerX]: this._xState.toString(2).padStart(9, '0'),
            [this.playerO]: this._oState.toString(2).padStart(9, '0')
        };
    }

   static checkWin(state) {
        const winPatterns = [
            0b111000000,
            0b000111000, 
            0b000000111, 
            0b100100100, 
            0b010010010, 
            0b001001001,
            0b100010001, 
            0b001010100 
        ];
        return winPatterns.some(pattern => (state & pattern) === pattern);
    }
    turn(position) {
        if (position < 0 || position > 8) {
            throw new Error('Invalid position');
        }

        const move = 1 << position;
        if ((this._xState | this._oState) & move) {
            throw new Error('Position already occupied.');
        }

        if (this._currentTurn) {
            this._oState |= move;
        } else {
            this._xState |= move;
        }

        this.turnCount++;
        const currentState = this._currentTurn ? this._oState : this._xState;
        if (TicTacToe.checkWin(currentState)) {
            return `${this.getCurrentTurn()} wins!`;
        }

        if (this.turnCount === 9) {
            return 'The game is a draw.';
        }

        this._currentTurn = !this._currentTurn;
        return 'Move accepted.';
    }

    renderBoard() {
        const emojiMap = {
            'X': '❌',
            'O': '⭕'
        };

        return this.getBoard()
            .map(value => emojiMap[value] || `${value}️⃣`)
            .reduce((acc, v, i) => acc + (i % 3 === 2 ? v + "\n" : v + " "), "");
    }
}

module.exports = TicTacToe;
          
