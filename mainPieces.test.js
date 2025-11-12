import { Ship, Gameboard } from './mainPieces.js';

describe('Ship()', () => {
    let ship1;
    beforeEach(() => {
        ship1 = Ship(3);
    });
    test('Ship can be hit', () => {
        ship1.hit();
        expect(ship1.hitTimes).toBe(1);
    });
    test('Ship can be sunk', () => {
        ship1.hit();
        ship1.hit();
        ship1.hit();
        expect(ship1.isSunk()).toBe(true);
    });
});

describe('Gameboard()', () => {
    let board;

    beforeEach(() => {
        board = Gameboard();
    });

    test('Gameboard creates 10x10 board', () => {
        expect(board.playerBoard[0][0].type).toEqual(0);
        expect(board.playerBoard[9][9].type).toEqual(0);
    });

    test('Gameboard places ship length 3 from [0][0] (Horizontal)', () => {
        board.placeShip(0,0,3);
        expect(board.playerBoard[0][0].type).toEqual(2);
        expect(board.playerBoard[0][1].type).toEqual(2);
        expect(board.playerBoard[0][2].type).toEqual(2);
    });

    test('Gameboard doesnt overflow ship length 3 from [9][9] (Horizontal)', () => {
        board.placeShip(0,9,3);
        expect(board.playerBoard[0][7].type).toEqual(2);
        expect(board.playerBoard[0][8].type).toEqual(2);
        expect(board.playerBoard[0][9].type).toEqual(2);
    });

    test('Gameboard places ship length 3 from [9][0] (Vertically)', () => {
        board.placeShip(9,0,3, 'Vertical');
        expect(board.playerBoard[7][0].type).toEqual(2);
        expect(board.playerBoard[8][0].type).toEqual(2);
        expect(board.playerBoard[9][0].type).toEqual(2);
    });

    test('Gameboard doesnt overflows ship length 3 from [0][0] (Vertically)', () => {
        board.placeShip(0,0,3, 'Vertical');
        expect(board.playerBoard[0][0].type).toEqual(2);
        expect(board.playerBoard[1][0].type).toEqual(2);
        expect(board.playerBoard[2][0].type).toEqual(2);
    });



});
