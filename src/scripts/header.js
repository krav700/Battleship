export let playerOneName = "Player One";
export let playerTwoName = "Player Two";

const playerOneInput = document.querySelector('#player-one-input');
export const playerTwoInput = document.querySelector('#player-two-input');

const playerOneSpan = document.querySelector('#player-one-span');
export const playerTwoSpan = document.querySelector('#player-two-span');

playerOneInput.addEventListener('blur', () => {
    playerOneSpan.textContent = playerOneInput.value;
    playerOneInput.value = "";
    playerOneName = playerOneSpan.textContent;
    document.querySelectorAll('.name-span').forEach(el => {
        el.style.setProperty('--text-content', `"${el.textContent}"`);
    });
});

playerOneInput.addEventListener('focus', () => {
    playerOneInput.value = playerOneSpan.textContent;
});

playerTwoInput.addEventListener('blur', () => {
    playerTwoSpan.textContent = playerTwoInput.value;
    playerTwoInput.value = "";
    playerTwoName = playerTwoSpan.textContent;
    document.querySelectorAll('.name-span').forEach(el => {
        el.style.setProperty('--text-content', `"${el.textContent}"`);
    });
});

playerTwoInput.addEventListener('focus', () => {
    playerTwoInput.value = playerTwoSpan.textContent;
});

document.querySelectorAll('.name-span').forEach(el => {
    el.style.setProperty('--text-content', `"${el.textContent}"`);
});