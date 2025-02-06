declare class ConnectFour {
    constructor(player1?: string, player2?: string);
    getBoard(): string[][];
    getCurrentPlayer(): string;
    dropPiece(col: number): { success: boolean; message: string };
    render(): string;
}
export = ConnectFour;
