export function Ship(length) {
    let hitTimes = 0;
    let sunk = false;

    function hit() {
        hitTimes++;

    }

    function isSunk() {
        if (hitTimes == length) {
            sunk = true;
            return sunk;
        }
        return sunk;
    }

    return { length, get hitTimes() { return hitTimes; }, get sunk() { return sunk }, hit, isSunk};
}

