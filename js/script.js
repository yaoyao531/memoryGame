// global variables
const inputs = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
let clickedObjects = [];
let seconds = 90;
let flips = 0;
let toggleBtn = true;
let timer;
let counter = 0;
const maxFlips = 60;


// run after page is loaded
window.onload = function () {
    const startButton = document.getElementById("start-btn");
    startButton.addEventListener('click', startGame);
    const resetButton = document.getElementById("reset-btn");
    resetButton.addEventListener('click', resetGame);
}

// Utility functions
function startGame() {
    shuffleInputs(inputs);
    initGame();
    initTimer();
    toggleButton();
    hideStar();
}

function resetGame() {
    revertGame();
    resetTimer();
    resetFlips();
    toggleButton();
}

function initTimer() {
    timer = setInterval(function () {
        document.getElementById("countdown").innerHTML = `${seconds}s`;
        seconds--;
        // If the count down is over, write some text 
        if (seconds < 0) {
            clearInterval(timer);
            document.getElementById("countdown").innerHTML = "EXPIRED";
            setTimeout(function () {
                window.confirm('Time is out! Try again?');
                resetGame();
            }, 500);
        }
    }, 1000);
}

function initGame() {
    const gameCards = document.getElementsByClassName("game_card");
    for (let i in gameCards) {
        if (typeof (gameCards[i]) === 'object') {
            gameCards[i].addEventListener('click', clickGameCard);
            gameCards[i].setAttribute("data-value", inputs[i]);
            gameCards[i].setAttribute("id", `card-${i}`);
        }
    }
}

function toggleButton() {
    const startButton = document.getElementById("start-btn");
    const resetButton = document.getElementById("reset-btn");
    if (toggleBtn) {
        startButton.style.display = "none";
        resetButton.style.display = "inline";
    } else {
        startButton.style.display = "inline";
        resetButton.style.display = "none";
    }
    toggleBtn = !toggleBtn;
}

function clickGameCard(elem) {
    let card = elem.target;
    if (card.nodeName === 'DIV') {
        increaseFlips();
        if (flips === maxFlips) {
            window.confirm('Reach max flips! Try again?');
            resetGame();
            return;
        }
        const cardValue = card.getAttribute('data-value');
        const cardId = card.getAttribute('id');
        if (clickedObjects.length === 1 && cardId === clickedObjects[0].id) {
            return;
        }
        card.innerHTML = `<span class="letter">${cardValue}</span>`;
        clickedObjects.push({ value: cardValue, id: cardId });
        if (clickedObjects.length === 2) {
            const obj1 = clickedObjects[0];
            const obj2 = clickedObjects[1];
            const div1 = document.getElementById(obj1.id);
            const div2 = document.getElementById(obj2.id);
            if (obj1.value === obj2.value) {
                div1.style.backgroundColor = 'blue';
                div2.style.backgroundColor = 'blue';
                div1.removeEventListener('click', clickGameCard);
                div2.removeEventListener('click', clickGameCard);
                
                setTimeout(function () {
                    counter++;
                    if (counter === 8) {
                        const rating = calRatings();
                        showStar(rating);
                        const winningMsg = `You Win!! You used ${flips} flips, and ${90 - seconds} seconds`;
                        window.confirm(winningMsg);
                        resetGame();
                    }
                }, 1000);
            } else {
                div1.style.backgroundColor = 'red';
                div2.style.backgroundColor = 'red';
                setTimeout(() => {
                    div1.innerHTML = null;
                    div2.innerHTML = null;
                    div1.style.backgroundColor = 'darkslategray';
                    div2.style.backgroundColor = 'darkslategray';
                }, 1000);
            }
            clickedObjects.splice(0, clickedObjects.length);
        } else {
            const obj1 = clickedObjects[0];
            const div1 = document.getElementById(obj1.id);
            div1.style.backgroundColor = 'green';
        }
    }
}

function increaseFlips() {
    flips++;
    document.getElementById("count").innerHTML = `${flips}`;
}

function revertGame() {
    const gameCards = document.getElementsByClassName("game_card");
    clickedObjects.splice(0, clickedObjects.length);
    counter = 0;
    for (let i in gameCards) {
        if (typeof (gameCards[i]) === 'object') {
            gameCards[i].removeEventListener('click', clickGameCard);
            gameCards[i].removeAttribute("data-value", inputs[i]);
            gameCards[i].removeAttribute("id", `card-${i}`);
            gameCards[i].innerHTML = '';
            gameCards[i].style.backgroundColor = 'darkslategray';
        }
    }
}

function resetTimer() {
    clearInterval(timer);
    seconds = 90;
    document.getElementById("countdown").innerHTML = `${seconds}s`;
}

function resetFlips() {
    flips = 0;
    document.getElementById("count").innerHTML = `${flips}`;
}

function shuffleInputs(inputs) {
    for (let i in inputs) {
        const swapIdx = Math.trunc(Math.random() * inputs.length);
        const tmp = inputs[swapIdx];
        inputs[swapIdx] = inputs[i];
        inputs[i] = tmp;
    }
}

function calRatings() {
    if (flips <= 20 && seconds >= 60) {
        return 3;
    } else if (flips <= 40 && seconds >= 30) {
        return 2;
    }
    return 1;
}

function showStar(rating) {
    const gameRating = document.getElementById("ratings");
    const title = document.createElement('h2');
    title.innerHTML = 'Previous Game Rating';
    gameRating.appendChild(title);
    if (gameRating == null) return;
    for (let i = 0; i < rating; i++) {
        const star = document.createElement('span');
        star.setAttribute('class', 'fa fa-star checked');
        gameRating.appendChild(star);
    }
    gameRating.style.display = 'block';
}

function hideStar() {
    const gameRating = document.getElementById("ratings");
    gameRating.innerHTML = "";
    gameRating.style.display = 'none';
}