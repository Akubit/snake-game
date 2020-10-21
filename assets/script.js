//Variables
const grid = document.querySelector(".grid")
const start = document.getElementById("start")
const restart = document.getElementById("restart")
const score = document.getElementById("score")
const area = 15
let squares = []
let snake = [2,1,0]
let direction = 1
let speed = 666
let points = 0
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


//Move
function move() {
    if( (snake[0] - area < 0 && direction === -area) || 
        (snake[0] + area >= (area * area) && direction === area) ||
        (snake[0] % area === (area-1) && direction === 1) || 
        (snake[0] % area) === 0 && direction === -1 ||
        (squares[snake[0] + direction].classList.contains('snake'))
        ){
            console.log('Perdu !')
            return clearInterval(timerId)
        }

    let tail = snake.pop()
    squares[tail].classList.remove('snake')
    snake.unshift(snake[0] + direction)
     
    if (snake[0] === apple) {
        squares[apple].classList.remove('apple')
        squares[tail].classList.add('snake')
        snake.push(tail)
        createApples()
        points++
        score.textContent = points
        clearInterval(timerId)
        speed = speed * 0.9
        timerId = setInterval(move, speed)
        console.log(speed)
    }
    squares[snake[0]].classList.add('snake')
    console.log(snake)
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
    switch (e.keyCode) {
        case 37: //left
            direction = direction === 1 ?  1 : -1
            break;
        case 38: //up
            direction = direction === area ? area : -area
            break; 
        case 39: //right
            direction = direction === -1 ?  -1 : 1
            break; 
        case 40: // down
        direction = direction === -area ? -area : area
            break;
    }
}

//Start Game 
function startGame () {
    //Snake creation
    snake.forEach(index => squares[index].classList.add('snake'))
    timerId = setInterval(move, speed)
    createApples()
}

document.addEventListener('keydown', control)

start.addEventListener('click', startGame)