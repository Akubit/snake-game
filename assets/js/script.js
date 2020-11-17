//Variables
const grid = document.querySelector(".grid")
const start = document.getElementById("start")
const restart = document.getElementById("restart")
const startBtn = document.getElementById("startBtn")
const restartBtn = document.getElementById("restartBtn")
const score = document.getElementById("score")
const highscore = document.getElementById("highscore")
const collect = document.getElementById("collect")
const death = document.getElementById("death")
const gameOverScore = document.getElementById("gameOverScore")
const area = 15
let squares = []
let snake = [2,1,0]
let direction = 1
let speed = 300
let points = 0
let highPoints = localStorage.getItem("akubit-snake-highscore")
let apple = randomApple()
let timerId


// Grid creation
function createGrid () {
    grid.style.gridTemplate = `repeat(${area}, 1fr) / repeat(${area}, 1fr)`;
    for (let cell = 0; cell < (area*area) ; cell++) {
        const div = document.createElement('div')
        div.classList.add('cell')
        grid.append(div)
        squares.push(div)
    }
}
createGrid()

// init 
function init () {
    if (highPoints === null) {
        localStorage.setItem("akubit-snake-highscore", 0)
        highPoints = localStorage.getItem("akubit-snake-highscore")
    } 
    highscore.textContent = highPoints
}

//Move
function move() {
    if( (snake[0] - area < 0 && direction === -area) || 
        (snake[0] + area >= (area * area) && direction === area) ||
        (snake[0] % area === (area-1) && direction === 1) || 
        (snake[0] % area) === 0 && direction === -1 ||
        (squares[snake[0] + direction].classList.contains('snake'))
        ){
            death.currentTime = 0;
            death.play();
            restart.style.display = 'flex'
            if (points > highPoints) {
                localStorage.setItem("akubit-snake-highscore", points)
                gameOverScore.innerText = `NEW HIGHSCORE !
                ${points}`
            } else {
                gameOverScore.innerText = `SCORE
                ${points}`
            }
            return clearInterval(timerId)
        }

    highPoints = localStorage.getItem('akubit-snake-highscore')
    let tail = snake.pop()
    squares[tail].classList.remove('snake')
    snake.unshift(snake[0] + direction)
     
    if (snake[0] === apple) {
        collect.currentTime = 0;
        collect.play();
        squares[apple].classList.remove('apple')
        squares[tail].classList.add('snake')
        snake.push(tail)
        createApples()
        points++
        if (points > highPoints) {
            highscore.textContent = points
        }
        score.textContent = points
        clearInterval(timerId)
        speed = speed * 0.985
        timerId = setInterval(move, speed)
    }
    squares[snake[0]].classList.add('snake')
}

//Apple generation
function createApples () {
    do {
        while (snake.includes(apple)) apple = randomApple()
    } while (snake[0] === apple)
    squares[apple].classList.add('apple')
}

function randomApple() {
    return Math.floor(Math.random() * squares.length) 
}

// D-pad controls
function control(e) {
    let snakeDir = snake[1]-snake[0]
    switch (e.keyCode) {
        case 37: //left
            direction = direction === 1 || snakeDir === -1 ?  1 : -1
            break;
        case 38: //up
            direction = direction === area || snakeDir === -area ? area : -area
            break; 
        case 39: //right
            direction = direction === -1 || snakeDir === 1 ?  -1 : 1
            break; 
        case 40: // down
        direction = direction === -area || snakeDir === area ? -area : area
            break;
    }
    

}

//Start Game 
function startGame () {
    //Snake creation
    snake = [2,1,0]
    direction = 1
    speed = 300
    points = 0
    apple = randomApple()
    score.textContent = points
    snake.forEach(index => squares[index].classList.add('snake'))
    timerId = setInterval(move, speed)
    createApples()
    start.style.display = 'none'
}

//Start Game 
function restartGame () {
    //Snake creation
    snake.forEach(index => squares[index].classList.remove('snake'))
    squares[apple].classList.remove('apple')
    snake = []
    apple = 0;
    restart.style.display = 'none'
    startGame()
}

init()
document.addEventListener('keydown', control)

startBtn.addEventListener('click', startGame)
restartBtn.addEventListener('click', restartGame)
