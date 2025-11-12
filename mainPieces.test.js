import { Ship } from "./mainPieces.js";

describe('Ship()', () => {
    test("Ship can be hit", () => {
        const ship1 = Ship(3);
        ship1.hit();
        expect(ship1.hitTimes).toBe(1);
    });
});