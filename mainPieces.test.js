import { Ship } from "./mainPieces.js";

describe('Ship()', () => {
    let ship1;
    beforeEach(() => {
        ship1 = Ship(3);
    });
    test("Ship can be hit", () => {
        ship1.hit();
        expect(ship1.hitTimes).toBe(1);
    });
    test("Ship can be sunk", () => {
        ship1.hit();
        ship1.hit();
        ship1.hit();
        expect(ship1.isSunk()).toBe(true);
    });
});