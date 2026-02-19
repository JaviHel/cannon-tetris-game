const gameContainer = document.getElementById('game-container')
const cannon = document.querySelector('.cannon')
const shootsContainer = document.querySelector('.shoots-container')
const cubesContainer = document.querySelector('.cubes-container')
const hiScore = document.querySelector('.hi-score-nmbr') 
const score = document.querySelector('.score-nmbr') 
const level = document.querySelector('.level-nmbr') 
const gameOverScreen = document.getElementById('game-over-screen')


let theGameContainer = {w:190,h:380,}
let theCannon = {x:57,y:342,w:57,h:38,}
let thePixel = {w:19,h:19,}


// Control Stick
function movePlyr(e) {
    if (e.key==="d" || e.key==="D") {
        theCannon.x < 152? theCannon.x+=thePixel.w: false;
        cannon.style.left = theCannon.x + 'px'
    } else if (e.key==="a" || e.key==="A") {
        theCannon.x > -19? theCannon.x-=thePixel.w: false;
        cannon.style.left = theCannon.x + 'px'
    }
}; 

// Start Bttn
function startGameBttn(e) {
    if (e.key==="Enter") {
        document.body.style.cursor = 'none'
        window.removeEventListener('keydown', startGameBttn)
        window.addEventListener('keydown', movePlyr)
        window.addEventListener('keydown', actionBttns)
        frames()
        launchMltpleCubes()
        rowCheckerTimer()
    }
}; window.addEventListener('keydown', startGameBttn)

// Action Bttns
function actionBttns(e) {
    if (e.key==="j" || e.key==="J" || e.key===" ") {
        createShoot()
    } else if (e.key==="k") {
        // launchMltpleCubes()
    } else if (e.key==="l") {
        // cancelAnimationFrame(id)
    }
}; 



let shootTrggr=false, id; // Animation Frame id

function createShoot() {
    let shoot = document.createElement('div')
    shoot.classList.add('shoot', 'pixel', 'replace')
    shootsContainer.append(shoot)

    shoot.style.top = theCannon.y + 'px'
    shoot.style.left = theCannon.x+19 + 'px'
    shootTrggr=true
}

let shtFps=0, shtSpeed;

function animateShoot() {
    if (shootTrggr===true) {
        const shoots = document.querySelectorAll('.shoot')
        shtFps+=1
        if (shtFps/shtSpeed==1) {
            shoots.forEach(shoot=>{
                let y = parseInt(getComputedStyle(shoot).top)
                    y-=19
                    shoot.style.top = y + 'px'
                if (y <= 0) {
                    shoot.classList.replace('shoot', 'cube')
                }
            })
            shtFps=0
        }
    }    
}



let hwMny;

function rndmNum() {
    return Math.floor(Math.random()*5)+4
};

function launchMltpleCubes() {
    hwMny=rndmNum()
    for (let i = 0; i < hwMny; i++) {
        createCube()
    }
}

let wdthArr=[], rndmWdth, rndmNmbr 

function buildArray() {
    wdthArr=[]
    for (let i = 0; i < theGameContainer.w; i+=19) {
        wdthArr.push(i)
    }
}; buildArray()

let cbTrggr=false

function createCube() {
    let cube = document.createElement('div')
    cube.classList.add('cube', 'pixel', 'replace')
    cubesContainer.append(cube)
    // Select a random X position with no repetition
    function rndmSlctX() {
        rndmNmbr = Math.floor(Math.random()*wdthArr.length)
        rndmWdth = wdthArr[rndmNmbr]
        // Removes the selected position
        wdthArr.splice(rndmNmbr,1)
    }; rndmSlctX()
    // Reset the array length when "hwmny" reaches '0'
    wdthArr.length <= 10-hwMny? buildArray():
    wdthArr.length <= 10-hwMny? rndmSlctX(): false;
    cube.style.left = rndmWdth + 'px'
    cbTrggr=true
}

let cbFps=0, cbFallSpeed;

function animateCube() {
    if (cbTrggr===true) {
        const cubes = document.querySelectorAll('.cube')    
        cbFps+=1
        if (cbFps/cbFallSpeed==1) {
            cubes.forEach(cube=>{
                let y = parseInt(getComputedStyle(cube).top)
                y+=19
                cube.style.top = y + 'px'
                if (y > 380) {
                    cube.remove()
                }
            })
            launchMltpleCubes()
            cbFps=0
        }
    }
}



function collision() {
    let shoots = document.querySelectorAll('.shoot')
    let cubes = document.querySelectorAll('.cube')

    shoots.forEach(shoot=>{
        let shootY = parseInt(getComputedStyle(shoot).top)
        let shootX = parseInt(getComputedStyle(shoot).left)
        let shootH = parseInt(getComputedStyle(shoot).width)
        cubes.forEach(cube=>{
            let cubeY = parseInt(getComputedStyle(cube).top)
            let cubeX = parseInt(getComputedStyle(cube).left)
            let cubeH = parseInt(getComputedStyle(cube).width)

            if (shootY <= cubeY+cubeH &&
                shootX == cubeX) {
                shoot.classList.replace('shoot', 'cube')
            }
        })
    })

    cubes.forEach(cube=>{
        let cubeY = parseInt(getComputedStyle(cube).top)
        let cubeX = parseInt(getComputedStyle(cube).left)
        let cubeH = parseInt(getComputedStyle(cube).width)

        if (cubeY+cubeH > theGameContainer.h) {
            cancelAnimationFrame(id)
            gameOver()
        } else if (cubeY+cubeH > theCannon.y &&
                   cubeX == theCannon.x+19) {
            cancelAnimationFrame(id)
            gameOver()
        }
    })
}



function rowAssigner() {
    if (cbTrggr===true) {
        const cubes = document.querySelectorAll('.cube')
        cubes.forEach(cube=>{
            let y = parseInt(getComputedStyle(cube).top)
            cube.classList.replace('replace', `px${y}`)
            cube.classList.replace(`px${y-19}`, `px${y}`)
        })
        rowTrggr=true
    }
}



let timerId;

function rowCheckerTimer() {
    timerId = setTimeout(rowChecker, 100)
}

function rowChecker() {
    // Checks every row
    for (let i = 0; i < theGameContainer.h; i+=19) {
        const theRow = document.querySelectorAll(`.px${i}`)
        if (theRow.length>=10) {
            scoreCounter()
            removeRowAnim(theRow)
            clearTimeout(timerId)
            break
        } else {
            theRow.length=0
            clearTimeout(timerId)
            rowCheckerTimer()
        }
    }
}



function removeRowAnim(theRow) {
    // window.removeEventListener('keydown', actionBttns)
    theRow.forEach(row=>{
        let keyFrames = {
            background:'transparent',
        }
        let options = {
            duration:100,
            easing:'linear',
            iterations:4,
            fill:'forwards',
        }
        row.animate(keyFrames, options);
    })
    
    let tmrId = setTimeout(stopAnim, 400)
    
    function stopAnim() {
        riseCubesOneStep(theRow)
        theRow.forEach(row=>{
            row.remove()
        })
        clearTimeout(tmrId)
        rowCheckerTimer()
        // window.addEventListener('keydown', actionBttns)
    }
}



function riseCubesOneStep(theRow) {
    let y = parseInt(getComputedStyle(theRow[0]).top)
    for (let i = y+19; i < theGameContainer.h; i+=19) {
        const otherCubes = document.querySelectorAll(`.px${i}`)
        otherCubes.forEach(cube=>{
            let y = parseInt(getComputedStyle(cube).top)
            cube.style.top = y-19 + 'px'
            cube.classList.replace(`px${y}`, `px${y-19}`)
        })
    }
}



// Saved Score
hiScore.innerText = 0 + +localStorage.getItem('cannon-tetris-hi-score')

function scoreCounter() {
    score.innerText= parseInt(score.innerText)+10
    if (+score.innerText>+hiScore.innerText) {
        localStorage.setItem('cannon-tetris-hi-score', parseInt(score.innerText))
        hiScore.innerText = 0 + +localStorage.getItem('cannon-tetris-hi-score')
    }
    levelDiff()
}



shtSpeed=6; cbFallSpeed=250;
let diffEvery=50, fasterShtEvery=200;

function levelDiff() {
    if (+score.innerText==diffEvery) {
        level.innerText++
        cbFps=0; cbFallSpeed-=10;
        diffEvery+=50;
    } else if (cbFallSpeed==fasterShtEvery) {
        shtFps=0; shtSpeed-=1;
        fasterShtEvery-=50;
    }
}



function gameOver() {
    let cubes = document.querySelectorAll('.cube')
    for (let i = 0; i < cubes.length; i++) {
        cubes[i].remove()
    }
    let shoots = document.querySelectorAll('.shoot')
    for (let i = 0; i < shoots.length; i++) {
        shoots[i].remove()
    }
    cannon.style.display = 'none'
    gameOverScreen.style.display = 'unset'
    window.addEventListener('keydown', resetGame)
    window.removeEventListener('keydown', movePlyr)
    window.removeEventListener('keydown', actionBttns)
}



function resetGame(e) {
    if (e.key==='Enter') {
        window.removeEventListener('keydown', resetGame)
        window.location.reload()
    }
}



function frames() {
    id = requestAnimationFrame(frames)

    animateShoot()
    animateCube()
    collision()
    rowAssigner()
}