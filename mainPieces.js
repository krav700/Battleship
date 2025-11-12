export function Ship(length) {
    let hitTimes = 0;

    function hit() {
        hitTimes++;
    }

    function isSunk() {
        if (hitTimes == length) {
            return true;
        }
        return false;
    }

    return {
        length,
        get hitTimes() {
            return hitTimes;
        },
        hit,
        isSunk,
    };
}

// Create an Object containing basicValue (the ones bellow) and shipValue if not a ship null
// 0 - water
// 1 - hit (miss)
// 2 - ship (hidden)
// 3 - ship (hit)

function tileObject(type) {
    let ship;

    function setShip(tileShip) {
        ship = tileShip;
    }

    return {type, get ship() { return ship; }, setShip};
}

export function Gameboard() {
    let playerBoard = new Array(10).fill().map(() => new Array(10).fill().map(() => tileObject(0)));

    //placeVertically
    //placeHorizontally
    //Idea: always presume you are placing the ships by holding them to the down/left side;
    function placeShip(placeV, placeH, shipLength, direction = 'Horitontal') {
        if (placeV < 0 || placeV > 9 || placeH < 0 || placeH > 9) {
            console.log('Invalid Coordinates');
            return;
        }

        const currentShip = Ship(shipLength);
        if (direction == 'Vertical') {
            while (placeV - shipLength + 1 < 0) {
                placeV++;
            }
            for (let i = 0; i < shipLength; i++) {
                playerBoard[placeV][placeH].type = 2;
                playerBoard[placeV--][placeH].setShip(currentShip);
            }
        } else {
            while ((placeH + shipLength - 1) > 9) {
                placeH--;
            }
            for (let i = 0; i < shipLength; i++) {
                playerBoard[placeV][placeH].type = 2;
                playerBoard[placeV][placeH++].setShip(currentShip);
            }
        }
    }

    function receiveAttack() {

    }

    return {
        get playerBoard() {
            return playerBoard;
        },
        placeShip,
        receiveAttack,
    };
}
