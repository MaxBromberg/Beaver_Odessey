document.addEventListener('DOMContentLoaded', () => {
  const height = 6
  const width = 16
  const grid = document.querySelectorAll('.grid div')
  const startButton = document.querySelector('.start')

  let beaverIndex = Math.floor(width*(0.5)*height) //left center
  let lynxIndex = beaverIndex + width - 1 //right center
  let lodgeIndex = (Math.floor(Math.random() * height) - 1) * (width - 1) 
  let trees = []
  let logs = []

  let direction = '>'
  let intervalTime = 0
  let interval = 0


  //start game, restart Game
  function startGame() {
    //reseting everything
    trees.forEach(index => grid[index].classList.remove('tree'))
    grid[beaverIndex].classList.remove('beaver')
    grid[beaverIndex].classList.remove('beaver_tree')
    grid[lynxIndex].classList.remove('lynx')
    grid[lodgeIndex].classList.remove('lodge')
    clearInterval(interval)

    direction = '>'
    intervalTime = 500
    interval = setInterval(moveLynx, intervalTime)
    interval = setInterval(checks, intervalTime)
    beaverIndex = Math.floor(width*(0.5)*height) //left center
    lynxIndex = beaverIndex + width - 1 //right center
    lodgeIndex = Math.floor(Math.random() * height) * (width-1)

    spawnBeaver(beaverIndex)
    grid[lynxIndex].classList.add('lynx')
    forestGen(Math.floor(height*width/6))
    grid[lodgeIndex].classList.add('lodge')
  }


  //Spawns
  function spawnBeaver(index, direction='>') {
    if (testBoundary(beaverIndex, direction)) {
      grid[beaverIndex].classList.remove('beaver')
      grid[beaverIndex].classList.remove('beaver_tree')
      if (grid[index].classList.contains('tree')) {
        grid[index].classList.add('beaver_tree')
      } else {
        grid[index].classList.add('beaver')
      }
      beaverIndex = index
    }
  }

  function spawnLynx(index, direction='>') {
    if (testBoundary(lynxIndex, direction) &&
       !(grid[index].classList.contains('tree')) &&
       !(grid[index].classList.contains('lodge'))) {
      grid[lynxIndex].classList.remove('lynx')
      grid[index].classList.add('lynx')
      lynxIndex = index
    }
  }

  function spawnTree() {
    do {
      trees.push(Math.floor(Math.random() * (width*height)))
    } while (grid[trees[trees.length-1]].classList.contains('beaver') ||
             grid[trees[trees.length-1]].classList.contains('lynx')) //while (if) unoccupied
        grid[trees[trees.length-1]].classList.add('tree')
  }

  function forestGen(numTrees) {
    for (var i = 0; i < numTrees; i++)
      spawnTree()
  }

  function treeToLog(Index) {
    grid[Index].classList.remove('tree')
    grid[Index].classList.add('log')
    }


  // Mechanics
  function moveBeaver(key) {
    if (key.keyCode === 37 || key.keyCode === 65) {
      spawnBeaver(beaverIndex - 1, '<') //left
    } else if (key.keyCode === 39 || key.keyCode === 68) {
      spawnBeaver(beaverIndex + 1, '>') //right
    } else if (key.keyCode === 38 || key.keyCode === 87) {
      spawnBeaver(beaverIndex - width, '^') //up
    } else if (key.keyCode === 40 || key.keyCode === 83) {
      spawnBeaver(beaverIndex + width, '_') //down
    }
  }

  function moveLynx() {
    // super simple finite state machine
    beaverX = beaverIndex % width
    lynxX = lynxIndex % width
    function moveX() {
      if (beaverX < lynxX) {
        spawnLynx(lynxIndex - 1, '<') //left
      } else if (beaverX > lynxX) {
        spawnLynx(lynxIndex + 1, '>') //right
      }
    }
    function moveY() {
      if ((beaverIndex - beaverX) < lynxIndex - lynxX) {
      spawnLynx(lynxIndex - width, '^') //up
      } else if ((beaverIndex - beaverX) > lynxIndex - lynxX) {
      spawnLynx(lynxIndex + width, '_') //down
      }
    }

    moveY()
    moveX()

  }

  function testBoundary(index, direction) {
    if (index % width === width-1 && direction === '>' || // right
        index % width === 0 && direction === '<' || // left
        index >= (width * (height - 1)) && direction === '_' || // bottom
        index < width && direction === '^') // top
      return false;
      else {
        return true;
      }
  }


  //checks for win and lose conditions
  function checks() {
    if (beaverIndex === lynxIndex) {
      alert('Game Over: Lynx got you')
      startGame()
    }
    if (beaverIndex === lodgeIndex) {
      alert('You Win! Safe in Lodge')
      startGame()
    }
  }

  document.addEventListener('keyup', moveBeaver) //executes control function everytime key is pressed
  startButton.addEventListener('click', startGame)
})
