const grid = document.querySelector('.grid');
const doodler = document.createElement('div');
const startButt = document.querySelector('button')

//variables 

let isStarted = false;
let doodlerLPosition = 50;
let jumpStartPoint = 60;
let doodlerMaxHeight = 600;
let doodlerBPosition = jumpStartPoint;
let doodlerUpTime
let doodlerDownTime
let isGameOver = false;
let platCount = 6;
let platforms = [];
let isJumping = true;
let isMovingRight = false;
let isMovingLeft = false;
let doodlerLeftTime;
let doodlerRightTime;
let score = 0;

//Doodler creation


function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add('doodler');
    doodlerLPosition = platforms[0].left
    doodler.style.left = doodlerLPosition + 'px'
    doodler.style.bottom = doodlerBPosition + 'px'
};

//doodler functions 

function doodlerJump() {
    isJumping = true
    doodlerUpTime = setInterval(() => {
        doodlerBPosition += 10
        doodler.style.bottom = doodlerBPosition + 'px'
        if (doodlerBPosition > jumpStartPoint + 190) {
            doodlerFall()
        }
    }, 50);
    doodler.classList.add('jumping_doodler')
    clearInterval(doodlerDownTime)
};

function doodlerFall() {
    isJumping = false;
    clearInterval(doodlerUpTime)
    doodlerDownTime = setInterval(() => {
        doodlerBPosition -= 10;
        doodler.style.bottom = doodlerBPosition + 'px'
        if (doodlerBPosition <= 0) {
            gameOver()
        }
        //controling doodler fall on platforms 
        platforms.forEach(platform => {

            if ((doodlerBPosition >= platform.bottom) &&
                (doodlerBPosition <= platform.bottom + 10) &&
                ((doodlerLPosition + 50) >= platform.left) &&
                (doodlerLPosition <= platform.left + 65) &&
                !isJumping
            ) {
                console.log('touched a platform')
                jumpStartPoint = doodlerBPosition;
                doodlerJump()
            };
        });

    }, 50);
    doodler.classList.remove('jumping_doodler')

};

function doodlerMovement(e) {

    if (e.key === "ArrowLeft") {
        moveLeft()
    } else if (e.key === "ArrowRight") {
        moveRight()
    } else if (e.key === "ArrowUp") {
        moveUp()
    }
}

// function doodlerMovement(e) {

// };


function moveLeft() {
    if (isMovingRight) {
        clearInterval(doodlerRightTime);
        isMovingRight = false;
    }
    doodlerLeftTime = setInterval(() => {
        if (doodlerLPosition >= 0) {
            doodlerLPosition -= 3;
            doodler.style.left = doodlerLPosition + 'px';
        } else moveRight()
    }, 20);
};

function moveRight() {
    if (isMovingLeft) {
        clearInterval(doodlerLeftTime);
        isMovingLeft = false;
    }

    doodlerRightTime = setInterval(() => {
        if (doodlerLPosition <= 360) {
            doodlerLPosition += 3;
            doodler.style.left = doodlerLPosition + 'px';
        } else moveLeft()
    }, 20);
};

function moveUp() {
    isMovingLeft = false;
    isMovingRight = false;
    clearInterval(doodlerRightTime);
    clearInterval(doodlerLeftTime);
};

//creation of platforms


class Platform {
    constructor(newPlatBottom) {
        this.bottom = newPlatBottom;
        this.left = Math.random() * 315;
        this.platVisual = document.createElement('div');

        const platVisual = this.platVisual
        platVisual.style.left = this.left + 'px'
        platVisual.style.bottom = this.bottom + 'px'
        platVisual.classList.add('platform')
        grid.appendChild(platVisual)

    };
};

function createPlatform() {
    for (let plat = 0; plat < platCount; plat++) {
        let platGap = 600 / platCount;
        let newPlatBottom = 100 + plat * platGap;
        let newPlatform = new Platform(newPlatBottom)
        platforms.push(newPlatform)
    };
};

function movePlatforms() {
    if (doodlerBPosition > 60) {
        platforms.forEach(plat => {
            plat.bottom -= 5
            let platVisual = plat.platVisual
            platVisual.style.bottom = plat.bottom + 'px'

            if (plat.bottom < 10) {
                let firstPlatform = platforms[0].platVisual;
                firstPlatform.classList.remove('platform')
                platforms.shift()
                score++
                console.log(platforms)
                let newPlatform = new Platform(600)
                platforms.push(newPlatform);
            }
        });
    };
};


//game over function

function gameOver() {

    isGameOver = true;

    while (grid.firstChild && isGameOver) {
        grid.removeChild(grid.firstChild)

    }
    grid.innerHTML = `<h2>Your Score is: ${score}</h2>
        <button onClick=(start()) class="restart-butt"></button> `


    clearInterval(doodlerUpTime)
    clearInterval(doodlerDownTime)
    clearInterval(doodlerRightTime)
    clearInterval(doodlerLeftTime)
    startButt.classList.remove("started")


};

//start game function


function start() {
    isGameOver = false;
    if (!isGameOver) {
        createPlatform()
        createDoodler()
        setInterval(movePlatforms, 50)
        doodlerJump()
        document.addEventListener('keyup', doodlerMovement)
        startButt.classList.add("started")

    }
}


startButt.addEventListener('click', start)






//create a button for start