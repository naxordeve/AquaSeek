declare class TicTacToe {
    private _currentTurn: boolean;
    private _xState: number;
    private _oState: number;
    private turnCount: number;

    constructor(playerX?: string, playerO?: string);
    getBoard(): (string | null)[];
    getCurrentTurn(): string;
    getEnemyTurn(): string;
    renderToBinary(): Record<string, string>;
    static checkWin(state: number): boolean;
    turn(position: number): string;
  
    static readonly WIN_PATTERNS: number[];
}

export = TicTacToe;
