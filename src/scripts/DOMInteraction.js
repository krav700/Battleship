import "../styles/boardStyle.css";
import "../styles/styles.css";
import "../styles/ships.css";
import { Player } from "./mainPieces.js";
import explosionVideo from "../assets/explosionVideo.webm";
import { playerOneName, playerTwoName } from "./header.js";

const boards = document.querySelectorAll(".board");
boards[0].classList.add("active");
boards[1].classList.add("active");

const passTurnButton = document.querySelector("#pass-turn");
passTurnButton.addEventListener("click", passedTheTurn);

function passedTheTurn() {
    boards[0].classList.remove("active");
    boards[1].classList.remove("active");
    passTurnButton.classList.add("dissappear");
}

const playerOneBoard = document.querySelector(".playerOne-board");
const playerTwoBoard = document.querySelector(".playerTwo-board");
export let playerOne = Player();
playerOne.setPlayerName("Player One");
export let playerTwo = Player();
playerTwo.setPlayerName("Player Two");

let currentWaterTile;
let currentWaterTileAll;
let droppingPlayer;

loadBoard(playerOne, playerOneBoard);
loadBoard(playerTwo, playerTwoBoard);

updateAllyBoard(playerOne);
updateAllyBoard(playerTwo);
updateAllyBoard(playerOne);

function loadBoard(selectPlayer, selectPlayerBoard) {
    selectPlayer.playerBoard.playerBoard.forEach((arrayTile) => {
        arrayTile.forEach(() => {
            const waterTile = document.createElement("div");
            waterTile.tabIndex = "0";
            waterTile.addEventListener("mouseover", () => {
                waterTile.classList.toggle("target-tile");
            });
            waterTile.addEventListener("mouseleave", () => {
                waterTile.classList.toggle("target-tile");
                waterTile.classList.remove("active-target-tile");
            });
            waterTile.classList.add("water-tile");
            selectPlayerBoard.append(waterTile);
        });
    });
}

function updateAllyBoard(selectPlayer) {
    const waterTileAll = document.querySelectorAll(".water-tile");
    let tileNum = 0;
    selectPlayer == playerTwo ? (tileNum += 100) : (tileNum += 0);
    selectPlayer.playerBoard.playerBoard.forEach((arrayTile) => {
        arrayTile.forEach((tile) => {
            const waterTile = waterTileAll[tileNum++];
            waterTile.removeEventListener("click", waterTile.clickEvent);
            waterTile.classList.add("no-active");
            if (tile.type == 0) {
                waterTile.classList.remove("hit-water-tile");
            } else if (tile.type == 1) {
                waterTile.classList.add("hit-water-tile");
            }
            if (tile.type == 2) {
                waterTile.classList.add("friendly-ship-tile");
            } else if (tile.type == 3) {
                waterTile.classList.add("hit-ship-tile");
            }

            waterTile.addEventListener("dragover", (e) => {
                e.preventDefault();
                currentWaterTile = waterTile;
                currentWaterTileAll = waterTileAll;
                droppingPlayer = selectPlayer;
            });
        });
    });
}

function updateEnemyBoard(selectPlayer) {
    const waterTileAll = document.querySelectorAll(".water-tile");
    let tileNum = 0;
    selectPlayer == playerTwo ? (tileNum += 100) : (tileNum += 0);
    selectPlayer.playerBoard.playerBoard.forEach((arrayTile) => {
        arrayTile.forEach((tile) => {
            const waterTile = waterTileAll[tileNum++];
            waterTile.classList.remove("no-active");
            waterTile.classList.remove("friendly-ship-tile");
            if (tile.type == 0 || tile.type == 2) {
                waterTile.addEventListener("mouseup", () => {
                    waterTile.classList.remove("active-target-tile");
                });
                waterTile.clickEvent = () => {
                    attackTile(tile, selectPlayer, waterTile);
                };
                if (playerOne.placedShips == 5 && playerTwo.placedShips == 5) {
                    waterTile.addEventListener("click", waterTile.clickEvent);
                }
            } else if (tile.type == 1) {
                waterTile.classList.add("hit-water-tile");
                waterTile.classList.add("no-active");
            } else if (tile.type == 3) {
                waterTile.classList.add("hit-ship-tile");
                waterTile.classList.add("no-active");
            }
        });
    });
}
function attackTile(tile, selectPlayer, waterTile) {
    if (tile.type == 1 || tile.type == 3) {
        return;
    }
    if (tile.type == 2) {
        waterTile.classList.add("hit-ship-tile");
        addExplosion(waterTile);
        useRecieveAttack(selectPlayer, waterTile);
        if (tile.ship.isSunk()) {
            explodeEntireShip(tile.ship, selectPlayer);
            const allPlacedShips = document.querySelectorAll(".placed-ship-on-board");
            allPlacedShips.forEach((ship) => {
                ship.parentElement.removeChild(ship.parentElement.firstChild);
            });
            placeRemoveShipsImages(returnOtherPlayer(selectPlayer));
        }
    } else if (tile.type == 0) {
        useRecieveAttack(selectPlayer, waterTile);
        swapPlayers(selectPlayer);
    }
    if (selectPlayer.playerBoard.loose) {
        winner(returnOtherPlayer(selectPlayer));
    }
}

function explodeEntireShip(ship, selectPlayer) {
    const waterTileAll = document.querySelectorAll(".water-tile");
    let tileNum = 0;
    selectPlayer == playerTwo ? (tileNum += 100) : (tileNum += 0);
    selectPlayer.playerBoard.playerBoard.forEach((arrayTile) => {
        arrayTile.forEach((tile) => {
            const waterTile = waterTileAll[tileNum++];
            if (tile.ship == ship) {
                addExplosion(waterTile);
            }
        });
    });
}

function addExplosion(waterTile) {
    if (waterTile.firstChild) {
        waterTile.firstChild.currentTime = 0;
        return;
    } else if (waterTile.textContent == "") {
        const videoEl = document.createElement('video');
        videoEl.muted = true;
        videoEl.playsInline = true;
        const source = document.createElement('source');
        source.src = explosionVideo;
        source.type = 'video/webm';
        videoEl.append(source);
        videoEl.currentTime = 0;
        waterTile.append(videoEl);
        videoEl.play();
        videoEl.onended = () => {
            waterTile.removeChild(videoEl);
        };
    }
}

function useRecieveAttack(selectPlayer, waterTile) {
    const waterTileAll = document.querySelectorAll(".water-tile");
    const waterTileArray = [...waterTileAll];
    let tileIndex = waterTileArray.findIndex((tile) => tile == waterTile);
    if (tileIndex > 99) tileIndex -= 100;
    const shipX = Math.floor(tileIndex / 10);
    const shipY = tileIndex % 10;
    selectPlayer.playerBoard.receiveAttack(shipX, shipY);
}

function swapPlayers(selectPlayer) {
    if (selectPlayer == playerOne) {
        passTurn();
        updateAllyBoard(playerOne);
        updateEnemyBoard(playerTwo);
        const allPlacedShips = document.querySelectorAll(".placed-ship-on-board");
        if (playerOne.placedShips == 5 && playerTwo.placedShips == 5 || playerOne.placedShips == 5 && playerTwo.placedShips == 0) {
            allPlacedShips.forEach((ship) => {
                ship.parentElement.removeChild(ship.parentElement.firstChild);
            });
            if (playerOne.placedShips == 5 && playerTwo.placedShips == 5) {
                placeRemoveShipsImages(selectPlayer);
            }
        }
    } else {
        passTurn();
        updateAllyBoard(playerTwo);
        updateEnemyBoard(playerOne);
        const allPlacedShips = document.querySelectorAll(".placed-ship-on-board");
        if (playerOne.placedShips == 5 && playerTwo.placedShips == 5 || playerOne.placedShips == 5 && playerTwo.placedShips == 0) {
            allPlacedShips.forEach((ship) => {
                ship.parentElement.removeChild(ship.parentElement.firstChild);
            });
            if (playerOne.placedShips == 5 && playerTwo.placedShips == 5) {
                placeRemoveShipsImages(selectPlayer);
            }
        }
    }
}

function returnOtherPlayer(selectPlayer) {
    if (selectPlayer == playerOne) {
        return playerTwo;
    }
    return playerOne;
}

function passTurn() {
    boards[0].classList.add("active");
    boards[1].classList.add("active");
    passTurnButton.classList.remove("dissappear");
}

const playButton = document.querySelector(".play-button");

const resetButton = document.querySelector(".reset-button");
resetButton.addEventListener("click", resetGame);

function resetGame() {
    playerOne.resetPlayerBoard();
    updateAllyBoard(playerOne);
    updateEnemyBoard(playerTwo);
    playerTwo.resetPlayerBoard();
    updateAllyBoard(playerTwo);
    updateEnemyBoard(playerOne);
    const waterTileAll = document.querySelectorAll(".water-tile");
    let shipCount = 0;
    waterTileAll.forEach((tile) => {
        tile.textContent = "";
        tile.classList.remove("hit-water-tile");
        tile.classList.remove("friendly-ship-tile");
        tile.classList.remove("hit-ship-tile");
    });
    const shipsAll = document.querySelectorAll(".ship");
    shipsAll.forEach((ship) => {
        shipCount++;
        if (ship.classList.contains("placed-ship")) {
            ship.classList.remove("placed-ship");
            if (shipCount < 6) {
                ship.draggable = true;
            }
        }
    });
    passTurnButton.classList.add("dissappear");
    playerOneBoard.classList.remove('looser');
    playerTwoBoard.classList.remove('looser');
    passTurnButton.textContent = "Passed The Turn";
    passTurnButton.addEventListener("click", passedTheTurn);
    passTurnButton.removeEventListener("click", resetGame);
};

const ships = document.querySelectorAll(".ship");
let verticalPlacement = false;
document.addEventListener("keydown", (e) => {
    if (e.key === "r" || e.key === "R") {
        verticalPlacement = !verticalPlacement;
        const shipsContainer = document.querySelectorAll(".ships-container");
        shipsContainer[0].classList.toggle("rotate-container");
        shipsContainer[1].classList.toggle("rotate-container");
        ships.forEach((dragShip) => {
            dragShip.classList.toggle("rotate-dragging");
        });
    }
});

ships.forEach((dragShip) => {
    dragShip.addEventListener("dragstart", () => {
        dragShip.classList.add("dragging");
    });

    dragShip.addEventListener("dragend", () => {
        dropShip();
        dragShip.classList.remove("dragging");
    });
});

function dropShip() {
    const draggableShip = document.querySelector(".dragging");
    let draggableShipLength;
    if (draggableShip.classList.contains("biggest-ship")) {
        draggableShipLength = 5;
    } else if (draggableShip.classList.contains("big-ship")) {
        draggableShipLength = 4;
    } else if (draggableShip.classList.contains("medium-ship")) {
        draggableShipLength = 3;
    } else if (draggableShip.classList.contains("patrol-ship")) {
        draggableShipLength = 2;
    } else if (draggableShip.classList.contains("help-ship")) {
        draggableShipLength = 2;
    }
    const waterTileArray = [...currentWaterTileAll];
    let tileIndex = waterTileArray.findIndex(
        (tile) => tile == currentWaterTile
    );
    if (tileIndex > 99) tileIndex -= 100;
    const shipX = Math.floor(tileIndex / 10);
    const shipY = tileIndex % 10;
    if (!verticalPlacement) {
        if (
            droppingPlayer.playerBoard.placeShip(
                shipX,
                shipY,
                draggableShipLength
            )
        ) {
            draggableShip.draggable = false;
            draggableShip.classList.add("placed-ship");
            updateAllyBoard(droppingPlayer);
            droppingPlayer.placedShip();
        }
        placeShipSprite(currentWaterTile, draggableShipLength, draggableShip, false);
    } else {
        if (
            droppingPlayer.playerBoard.placeShip(
                shipX,
                shipY,
                draggableShipLength,
                "Vertical"
            )
        ) {
            draggableShip.draggable = false;
            draggableShip.classList.add("placed-ship");
            updateAllyBoard(droppingPlayer);
            droppingPlayer.placedShip();
        }
        placeShipSprite(currentWaterTile, draggableShipLength, draggableShip, true);
    }
    if (draggableShip.classList.contains("biggest-ship")) {
        droppingPlayer.playerShips.placedShipTiles.biggestShip.tile = currentWaterTile;
        droppingPlayer.playerShips.placedShipTiles.biggestShip.ship = draggableShip;
        droppingPlayer.playerShips.placedShipTiles.biggestShip.shipObejct = droppingPlayer.playerBoard.playerBoard[shipX][shipY].ship;
        if (verticalPlacement) {
            droppingPlayer.playerShips.placedShipTiles.biggestShip.vertical = true;
        }
    } else if (draggableShip.classList.contains("big-ship")) {
        droppingPlayer.playerShips.placedShipTiles.bigShip.tile = currentWaterTile;
        droppingPlayer.playerShips.placedShipTiles.bigShip.ship = draggableShip;
        droppingPlayer.playerShips.placedShipTiles.bigShip.shipObejct = droppingPlayer.playerBoard.playerBoard[shipX][shipY].ship;
        if (verticalPlacement) {
            droppingPlayer.playerShips.placedShipTiles.bigShip.vertical = true;
        }
    } else if (draggableShip.classList.contains("medium-ship")) {
        droppingPlayer.playerShips.placedShipTiles.mediumShip.tile = currentWaterTile;
        droppingPlayer.playerShips.placedShipTiles.mediumShip.ship = draggableShip;
        droppingPlayer.playerShips.placedShipTiles.mediumShip.shipObejct = droppingPlayer.playerBoard.playerBoard[shipX][shipY].ship;
        if (verticalPlacement) {
            droppingPlayer.playerShips.placedShipTiles.mediumShip.vertical = true;
        }
    } else if (draggableShip.classList.contains("patrol-ship")) {
        droppingPlayer.playerShips.placedShipTiles.patrolShip.tile = currentWaterTile;
        droppingPlayer.playerShips.placedShipTiles.patrolShip.ship = draggableShip;
        droppingPlayer.playerShips.placedShipTiles.patrolShip.shipObejct = droppingPlayer.playerBoard.playerBoard[shipX][shipY].ship;
        if (verticalPlacement) {
            droppingPlayer.playerShips.placedShipTiles.patrolShip.vertical = true;
        }
    } else if (draggableShip.classList.contains("help-ship")) {
        droppingPlayer.playerShips.placedShipTiles.helpShip.tile = currentWaterTile;
        droppingPlayer.playerShips.placedShipTiles.helpShip.ship = draggableShip;
        droppingPlayer.playerShips.placedShipTiles.helpShip.shipObejct = droppingPlayer.playerBoard.playerBoard[shipX][shipY].ship;
        if (verticalPlacement) {
            droppingPlayer.playerShips.placedShipTiles.helpShip.vertical = true;
        }
    }
    if (droppingPlayer.placedShips == 5) {
        if (droppingPlayer == playerOne) {
            swapPlayers(playerTwo);
            ships[5].draggable = true;
            ships[6].draggable = true;
            ships[7].draggable = true;
            ships[8].draggable = true;
            ships[9].draggable = true;
        } else {
            swapPlayers(playerOne);
        }
    }
}

function placeRemoveShipsImages(selectPlayer) {
    const playerShipsShortcut = selectPlayer.playerShips.placedShipTiles;
    placeShipSprite(playerShipsShortcut.biggestShip.tile, playerShipsShortcut.biggestShip.length, playerShipsShortcut.biggestShip.ship, playerShipsShortcut.biggestShip.vertical);
    placeShipSprite(playerShipsShortcut.bigShip.tile, playerShipsShortcut.bigShip.length, playerShipsShortcut.bigShip.ship, playerShipsShortcut.bigShip.vertical);
    placeShipSprite(playerShipsShortcut.mediumShip.tile, playerShipsShortcut.mediumShip.length, playerShipsShortcut.mediumShip.ship, playerShipsShortcut.mediumShip.vertical);
    placeShipSprite(playerShipsShortcut.patrolShip.tile, playerShipsShortcut.patrolShip.length, playerShipsShortcut.patrolShip.ship, playerShipsShortcut.patrolShip.vertical);
    placeShipSprite(playerShipsShortcut.helpShip.tile, playerShipsShortcut.helpShip.length, playerShipsShortcut.helpShip.ship, playerShipsShortcut.helpShip.vertical);
    const otherPlayer = returnOtherPlayer(selectPlayer);
    const otherPlayerShips = otherPlayer.playerShips.placedShipTiles;
    if (otherPlayerShips.biggestShip.shipObejct.isSunk()) {
        placeShipSprite(otherPlayerShips.biggestShip.tile, otherPlayerShips.biggestShip.length, otherPlayerShips.biggestShip.ship, otherPlayerShips.biggestShip.vertical);
    } if (otherPlayerShips.bigShip.shipObejct.isSunk()) {
        placeShipSprite(otherPlayerShips.bigShip.tile, otherPlayerShips.bigShip.length, otherPlayerShips.bigShip.ship, otherPlayerShips.bigShip.vertical);
    } if (otherPlayerShips.mediumShip.shipObejct.isSunk()) {
        placeShipSprite(otherPlayerShips.mediumShip.tile, otherPlayerShips.mediumShip.length, otherPlayerShips.mediumShip.ship, otherPlayerShips.mediumShip.vertical);
    } if (otherPlayerShips.patrolShip.shipObejct.isSunk()) {
        placeShipSprite(otherPlayerShips.patrolShip.tile, otherPlayerShips.patrolShip.length, otherPlayerShips.patrolShip.ship, otherPlayerShips.patrolShip.vertical);
    } if (otherPlayerShips.helpShip.shipObejct.isSunk()) {
        placeShipSprite(otherPlayerShips.helpShip.tile, otherPlayerShips.helpShip.length, otherPlayerShips.helpShip.ship, otherPlayerShips.helpShip.vertical);
    }
}

function placeShipSprite(placingTile, draggableShipLength, draggableShip, vertical) {
    const shipElement = document.createElement('div');

    const waterTileArray = [...currentWaterTileAll];
    let tileIndex = waterTileArray.findIndex(
        (tile) => tile == placingTile
    );
    if (!vertical) {
        if (tileIndex % 10 + draggableShipLength - 1 > 9) {
            while (tileIndex % 10 + draggableShipLength - 1 > 9) {
                tileIndex--;
            }
        }
        console.log(tileIndex);
    } else {
        console.log(tileIndex);
        if (tileIndex % 10 == 0) {
            if (tileIndex / 10 % 10 + draggableShipLength - 1 > 9) {
                while (tileIndex / 10 % 10 + draggableShipLength - 1 > 9) {
                    tileIndex -= 10;
                }
            }
        } else {
            if (tileIndex / 10 % 10 + draggableShipLength - 2 > 9) {
                while (tileIndex / 10 % 10 + draggableShipLength - 2 > 9) {
                    tileIndex -= 10;
                }
            }
        }
        console.log(tileIndex);
    }
    placingTile = waterTileArray[tileIndex];

    shipElement.classList.add('placed-ship-on-board');
    switch (draggableShipLength) {
        case 5:
            shipElement.classList.add('biggest-ship', 'ship');
            break;
        case 4:
            shipElement.classList.add('big-ship','ship');
            break;
        case 3:
            shipElement.classList.add('medium-ship','ship');
            break;
        case 2:
            if (draggableShip.classList.contains('patrol-ship')) {
                shipElement.classList.add('patrol-ship','ship');
            } else {
                shipElement.classList.add('help-ship', 'ship');
            }
            break;
        default:
            break;
        }
    if (vertical) {
        shipElement.classList.add('rotate-dragging');
    }
    placingTile.append(shipElement);
}


function winner(selectPlayer) {
    passTurn();
    if (selectPlayer == playerTwo) {
        passTurnButton.textContent = `Winner: ${playerTwoName}`;
        playerOneBoard.classList.add('looser');
    } else {
        passTurnButton.textContent = `Winner: ${playerOneName}`;
        playerTwoBoard.classList.add('looser');
    }
    updateAllyBoard(playerOne);
    updateAllyBoard(playerTwo);
    boards[0].classList.remove("active");
    boards[1].classList.remove("active");
    passTurnButton.removeEventListener("click", passedTheTurn);
    passTurnButton.addEventListener("click", resetGame);
}
