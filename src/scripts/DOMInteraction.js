import "../styles/boardStyle.css";
import "../styles/styles.css";
import "../styles/ships.css";
import { Player } from "./mainPieces.js";
import explosionVideo from "../assets/explosionVideo.mp4";
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
export const playerOne = Player();
playerOne.setPlayerName("Player One");
export const playerTwo = Player();
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
        source.type = 'video/mp4';
        videoEl.append(source);
        videoEl.currentTime = 0;
        waterTile.append(videoEl);
        videoEl.play();
        videoEl.onended = () => {
            waterTile.textContent = "";
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
    } else {
        passTurn();
        updateAllyBoard(playerTwo);
        updateEnemyBoard(playerOne);
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
resetButton.addEventListener("click", () => {
    playerOne.resetPlayerBoard();
    updateAllyBoard(playerOne);
    updateEnemyBoard(playerTwo);
    playerTwo.resetPlayerBoard();
    updateAllyBoard(playerTwo);
    updateEnemyBoard(playerOne);
});

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
    } else if (draggableShip.classList.contains("small-ship")) {
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

function winner(selectPlayer) {
    passTurn();
    if (selectPlayer == playerTwo) {
        passTurnButton.textContent = `Winner: ${playerTwoName}`;
    } else passTurnButton.textContent = `Winner: ${playerOneName}`;
    updateAllyBoard(playerOne);
    updateAllyBoard(playerTwo);
    boards[0].classList.remove("active");
    boards[1].classList.remove("active");
    passTurnButton.removeEventListener("click", passedTheTurn);
}
