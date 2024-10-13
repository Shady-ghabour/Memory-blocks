const startBtn = document.querySelector(".cont-btns span");
const userName = document.querySelector(".name span");
const controlDiv = document.querySelector(".cont-btns");
const block = document.querySelector(".block-cont");
const blocks = Array.from(block.children);
const duration = 1000;
let wrongTries = document.querySelector(".wrong-tries span");
const successAudio = document.getElementById("success");
const failAudio = document.getElementById("fail");
const winAudio = document.getElementById("win");
let orderRange = [...Array(blocks.length).keys()];
let bestScore = Infinity;


function flipBlock (selectedBlock){
    selectedBlock.classList.add("flipped");

    let flippedBlocks = blocks.filter(flippedBlock => flippedBlock.classList.contains("flipped"));

    if(flippedBlocks.length === 2){
        
        stopClicking();

        isMatch(flippedBlocks[0], flippedBlocks[1]);
    }

    // Check if all blocks are matched
    if (blocks.every(block => block.classList.contains("matched"))) {
        wonGame();
        winAudio.play();
    }

    if(parseInt(wrongTries.innerHTML) === 11){
        lostGame();
        blocks.forEach(block => {
            block.style.pointerEvents = "none";
        });
    }
}

function stopClicking(){

    block.classList.add("no-clicking");

setTimeout(() => {
    block.classList.remove("no-clicking");   
}, duration);

}

function isMatch(firstImage, secondImage){

    if (firstImage.dataset.technology === secondImage.dataset.technology){

        firstImage.classList.remove("flipped");
        secondImage.classList.remove("flipped");

        firstImage.classList.add("matched");
        secondImage.classList.add("matched");

        successAudio.currentTime = 0;
        successAudio.play();

    }else{

        wrongTries.innerHTML = parseInt(wrongTries.innerHTML) + 1;

        setTimeout(() => {
            firstImage.classList.remove("flipped");
            secondImage.classList.remove("flipped");
        }, duration);

        failAudio.currentTime = 0;
        failAudio.play();
    }
}

function wonGame() {
    const div = document.createElement("div");

    const span = document.createElement("span");
    
    div.className = "won";

    span.className = "btn"

    span.innerHTML = "Play Again";

    let currentTries = parseInt(wrongTries.innerHTML);

    if (currentTries < bestScore){
        bestScore = currentTries;
    }

    div.innerHTML = `Congratulations! You won the game with ${wrongTries.innerHTML} wrong tries :) Best score: ${bestScore}`

    div.appendChild(span);
    span.addEventListener("click", resetGame);
    // Append the div to the body or another container
    document.body.appendChild(div);
}

function lostGame(){
    const div = document.createElement("div");

    const span = document.createElement("span");
    
    div.className = "lost";

    span.className = "btn"

    span.innerHTML = "Play Again"

    div.innerHTML = `You lost the game :(`

    div.appendChild(span);
    
    span.addEventListener("click", resetGame);
    // Append the div to the body or another container
    document.body.appendChild(div);
}

function resetGame(){
     // Remove the won or lost message
    const wonMessage = document.querySelector(".won");
    const lostMessage = document.querySelector(".lost");
    if (wonMessage) {
        wonMessage.remove();
    }
    if (lostMessage) {
        lostMessage.remove();
    }

    // Reset game state
    wrongTries.innerHTML = "0";
    blocks.forEach(block => {
        block.classList.remove("flipped", "matched");
        block.style.pointerEvents = "auto"; // Re-enable pointer events
    });

    // Shuffle blocks
    shuffle(orderRange);
    blocks.forEach((block, index) => {
        block.style.order = orderRange[index];
    });

    // Re-enable clicking
    block.classList.remove("no-clicking");
}

function shuffle (arr){
    let current = arr.length,
    temp,
    random;

    while(current > 0 ){
        random = Math.floor(Math.random() * current);

        current --;

        temp = arr[current];
        arr[current] = arr[random];
        arr[random] = temp;
    }
    return arr;
}

startBtn.onclick = function () {
    let name = prompt("What's Your Name?");

    if(name === null || name === ""){
        window.alert("Please enter a name to start the game!")
    } else {
        userName.innerHTML = name;
        controlDiv.remove();
    }
}

shuffle(orderRange);

blocks.forEach((block, index)=>{
    block.style.order = orderRange[index];

    block.addEventListener("click", () => {
        flipBlock(block);
    })
})