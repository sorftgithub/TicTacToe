// Creat a board game using Object Oriented Programing that allows two players to select x or o and fill up the boxes
// in the board till therre is a winner or a tie

// 1. create a Board class
// a. the constructor that  shows the arrays
class Board{
    constructor(){
        this.grid = Array(9).fill('')
    }
    // b. the function that tell whether our move is good
    placeMarker(index, marker){
        if(this.grid[index] === ''){
            this.grid[index] = marker;
            return true
        }
        return false
    }
    // c. the fuction that shows if all arrays are filled
    isFull(){
        return this.grid.every(cell => cell !== '')
    }
}


// 2. create a player class
class Player{
    constructor(name,marker){
        this.name = name
        this.marker = marker
    }
}

// 3. Create the game class
// a. make the constructors that calls all needed properties
class Game{
    constructor(player1Name, player2Name){
        this.board = new Board()
        this.p1 = new Player(player1Name, "X")
        this.p2 = new Player(player2Name, "O")
        this.currentPlayer = this.p1
        this.gameOver = false
    }
    // b. Craete the play function
    play(index){
        // c. when a player plays, check if the game is not over
        if(this.gameOver){
            return  console.log("The game is already over")
        }
        // d. check  if the move was successful
        const moveSuccessful = this.board.placeMarker(index,this.currentPlayer.marker)
        if(!moveSuccessful){
            console.log("Space taken, try another square")
            return
        }
        // e. If it is not, print to the console the move made and where game stands
        console.log(`${this.currentPlayer.name} placed ${this.currentPlayer.marker} at slot ${index}`)
        console.log(this.board.grid)

        // f. Check if a player won
        if(this.checkWin()){
            console.log(`🎉 Game over! ${this.currentPlayer.name} wins!`)
            this.gameOver = true
            return
        }
        // g. check if the board is full
        if(this.board.isFull()){
            console.log("🤝 It's a tie!")
            this.gameOver = true
            return
        }
        // h. switch players until there is a winner
        this.currentPlayer = this.currentPlayer === this.p1 ? this.p2 : this.p1
    }

    // 4. create the function that checks who won
   checkWin(){
    const g = this.board.grid;
    const winConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    return winConditions.some(combo => {
      const [a, b, c] = combo;
      return g[a] && g[a] === g[b] && g[a] === g[c];
    });
   }
}


// 5. Print the game to the DOM

// a. Creat a Dom class with it constructor and creae a this property for our needed elements
class DOMManager{
    constructor(){
        this.game = new Game("Soft","Ewaade")
        this.cells = document.querySelectorAll('.cell')
        this.status = document.getElementById('status')
        this.resetButton = document.getElementById('reset-btn')
        this.setUpEventListener()
        this.updateUI()
    }

    // b. cretae a function that setsup the eventistener
    setUpEventListener(){
        // Listen for clicks on the cells
        this.cells.forEach(cell =>{
            cell.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'))
                this.handleCellClick(index)
            })
        })
        // Listen for clicks on the reset button
        this.resetButton.addEventListener('click', ()=> this.restartGame())
    }
    // c. crete a function that handles cell click
    handleCellClick(index){
        this.game.play(index)
        // Refresh the screen to reflect game changes
        this.updateUI() 
    }
    // d. Create a function that updates the UI
    updateUI(){
        // Update the textvalue on all 9 buttons matching the array state
        const gridState = this.game.board.grid
        this.cells.forEach((cell, i)=> {
            cell.innerText = gridState[i]
        })

        // Update the main header of the text status
        if(this.game.gameOver){
            if(this.game.board.isFull() && !this.game.checkWin()){
                this.status.innerText = "🤝 It's a tie!"
            }else{
                this.status.innerText = `🎉 ${this.game.currentPlayer.name} wins!`
            }
        }else{
            this.status.innerText = `${this.game.currentPlayer.name}'s turn (${this.game.currentPlayer.marker})`
        }
    }
    // e. Create a function that restart the game
    restartGame(){
            // Hard reset the game instance back to step one
            this.game = new Game("Soft", "Ewaade")
            this.updateUI()
        }
}

// START THE GAME ON WINDOW LOAD
 const app = new DOMManager()