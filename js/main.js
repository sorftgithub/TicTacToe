// Creat a board game using Object Oriented Programing that allows two players to select x or o and fill up the boxes
//  in the board till therre is a winner or a tie 


class Board{
    constructor(){
        this.grid = Array(9).fill("")   // Create a class of board with 9 empty slots
    }
    // create a method thats places a marker in a cell or doesn't if it's taken
    placeMarker(index, marker){
        if(this.grid[index] === ""){
            this.grid[index] = marker;
            return true;
        }
        return false;
    }
    isFull(){
        return this.grid.every(cell => cell !== "") //all cells are filled
    }
}

class Player{
    constructor(name, marker){
        this.name = name;
        this.marker = marker
    }
}

class Game{
    constructor(player1Name, player2Name){
        this.board = new Board()
        this.p1 = new Player(player1Name, "X")
        this.p2 = new Player(player2Name, "O")
        this.currentPlayer = this.p1
        this.gameOver = false
    }

   play(index){
    if(this.gameOver) return console.log("The game is already over")

    // Ask the board to update itself
    const moveSuccessful = this.board.placeMarker(index, this.currentPlayer.marker)
    if(!moveSuccessful){
        console.log("Space taken, try another square")
        return;
    }

    console.log(`${this.currentPlayer.name} placed an ${this.currentPlayer.marker} at slot ${index}`);
    console.log(this.board.grid); // Quick peek at current state

    if(this.checkWin()){
        console.log(`🎉 Game over! ${this.currentPlayer.name} wins!`)
        this.gameOver = true
        return;
    }
    if(this.board.isFull()){
        console.log("🤝 It's a tie!")
        this.gameOver = true
        return;
    }
    // Switch turns
    this.currentPlayer = this.currentPlayer === this.p1 ? this.p2 : this.p1
   } 

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

// Printing it to the dom
class DOMManager{
    constructor(){
        // Initialize a clean instance of the game logic engine
        this.game = new Game("Leon","Bob")

        // Grab all the html elements we need to manipulate
        this.cells = document.querySelectorAll('.cell');
        this.statusText = document.getElementById('status');
        this.resetButton = document.getElementById('reset-btn')
        // Bind our event listeners so 'this' doesn't get lost when clicking
        this.setupEventListeners()
        this.updateUI()
    }

    setupEventListeners(){
        // listen for clicks on the board cells
        this.cells.forEach(cell =>{
            cell.addEventListener('click', (e) =>{
                const index = parseInt(e.target.getAttribute('data-index'))
                this.handleCellClick(index)
            })
        })
        // Listen for clicks on the restart button
        this.resetButton.addEventListener('click', () => this.restartGame())
    }
    handleCellClick(index){
        // Tell the game class logic to process the move
        this.game.play(index);

        // Refresh the screen to reflect the changes
        this.updateUI();
    }
    updateUI(){
        const gridState = this.game.board.grid  //Acess your array

        // Update the textvalue on all 9 buttons matching the array state
        this.cells.forEach((cell, i) =>{
            cell.innerText = gridState[i]
        })

        // Update the main header text status
        if(this.game.gameOver){
            if(this.game.board.isFull() && !this.game.checkWin()){
                this.statusText.innerText = "🤝 It's a tie!"
            }else{
                this.statusText.innerText = `🎉 ${this.game.currentPlayer.name} wins!`
            }
        }else{
            this.statusText.innerText = `${this.game.currentPlayer.name}'s turn (${this.game.currentPlayer.marker})`;
        }
    }
    
        restartGame(){
            // Hard reset the game instance back to step one
            this.game = new Game("Leon", "Bob")
            this.updateUI()
        }
}

// START THE GAME ON WINDOW LOAD
 const app = new DOMManager()