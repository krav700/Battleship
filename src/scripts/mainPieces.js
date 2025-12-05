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

    return {
        type,
        get ship() {
            return ship;
        },
        setShip,
    };
}

export function Gameboard() {
    let playerBoard = new Array(10)
        .fill()
        .map(() => new Array(10).fill().map(() => tileObject(0)));
    let sunkenShips = 0;
    let loose = false;
    //placeVertically
    //placeHorizontally
    //Idea: always presume you are placing the ships by holding them to the down/left side;
    function placeShip(placeV, placeH, shipLength, direction = "Horitontal") {
        if (placeV < 0 || placeV > 9 || placeH < 0 || placeH > 9) {
            console.log("Invalid Coordinates");
            return false;
        }

        const currentShip = Ship(shipLength);
        if (direction == "Vertical") {
            while (placeV + shipLength - 1 > 9) {
                placeV--;
            }
            let tempPlaceV = placeV;
            for (let i = 0; i < currentShip.length; i++) {
                if (playerBoard[tempPlaceV++][placeH].type == 2) {
                    console.log("There is already a ship there");
                    return false;
                }
            }
            for (let i = 0; i < shipLength; i++) {
                playerBoard[placeV][placeH].type = 2;
                playerBoard[placeV++][placeH].setShip(currentShip);
            }
        } else {
            while (placeH + shipLength - 1 > 9) {
                placeH--;
            }
            let tempPlaceH = placeH;
            for (let i = 0; i < currentShip.length; i++) {
                if (playerBoard[placeV][tempPlaceH++].type == 2) {
                    console.log("There is already a ship there");
                    return false;
                }
            }
            for (let i = 0; i < shipLength; i++) {
                playerBoard[placeV][placeH].type = 2;
                playerBoard[placeV][placeH++].setShip(currentShip);
            }
        }
        return true;
    }

    function receiveAttack(hitX, hitY) {
        if (
            playerBoard[hitX][hitY].type == 1 ||
            playerBoard[hitX][hitY].type == 3
        ) {
            console.log("Already shot there");
            return;
        }

        if (playerBoard[hitX][hitY].type == 2) {
            playerBoard[hitX][hitY].ship.hit();
            playerBoard[hitX][hitY].type = 3;
            if (playerBoard[hitX][hitY].ship.isSunk()) {
                sunkenShips++;
                console.log("SUNKEN");
                if (sunkenShips == 5) {
                    loose = true;
                }
            }
        } else if (playerBoard[hitX][hitY].type == 0) {
            playerBoard[hitX][hitY].type = 1;
        }
    }

    return {
        get playerBoard() {
            return playerBoard;
        },
        placeShip,
        receiveAttack,
        get loose() {
            return loose;
        },
    };
}

export function Player() {
    let playerName = "";

    function setPlayerName(name) {
        playerName = name;
    }

    let placedShips = 0;

    function placedShip() {
        placedShips++;
    }

    let playerBoard = Gameboard();

    function resetPlayerBoard() {
        playerBoard = Gameboard();
        placedShips = 0;
        playerShips = placingShipsImages();
    }

    let playerShips = placingShipsImages();

    return {
        get playerName() {
            return playerName;
        },
        setPlayerName,
        get playerBoard() {
            return playerBoard;
        },
        resetPlayerBoard,
        get placedShips() {
            return placedShips;
        },
        placedShip,
        playerShips
    };
}

function placingShipsImages() {
    let placedShipTiles = {
        biggestShip: {
            ship: undefined,
            shipObject: undefined,
            length: 5,
            tile: undefined,
            vertical: false
        },
        bigShip: {
            ship: undefined,
            shipObject: undefined,
            length: 4,
            tile: undefined,
            vertical: false
        },
        mediumShip: {
            ship: undefined,
            shipObject: undefined,
            length: 3,
            tile: undefined,
            vertical: false
        },
        patrolShip: {
            ship: undefined,
            shipObject: undefined,
            length: 2,
            tile: undefined,
            vertical: false
        },
        helpShip: {
            ship: undefined,
            shipObject: undefined,
            length: 2,
            tile: undefined,
            vertical: false
        },
    };
    return { placedShipTiles };
}
