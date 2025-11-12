export function Ship(length) {
    let hitTimes = 0;
    let sunk = false;

    function hit() {
        hitTimes++;
    }

    function isSunk() {
        if (hitTimes == length) sunk = true;
    }

    return { length, hitTimes, sunk, hit, isSunk};
}

