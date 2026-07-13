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

// a. Creat a Dom class with it constructor and create a this property for our needed elements
class DOMManager{
    constructor(){
        this.setupForm = document.getElementById('setup-form')
        this.gameContainer = document.getElementById('game-container')
        this.p1Input = document.getElementById("p1-name")
        this.p2Input = document.getElementById('p2-name')
        this.cells = document.querySelectorAll('.cell')
        this.status = document.getElementById('status')
        this.switchButton = document.getElementById('switch-btn')
        this.resetButton = document.getElementById('reset-btn')
        this.p1Label = document.getElementById('p1-score-label')
        this.p2Label = document.getElementById('p2-score-label')
        this.p1Display = document.getElementById('p1-score-display')
        this.p2Display = document.getElementById('p2-score-display')
        this.game = null //The game starts as null because we don't have players names yey
        this.p1Score = 0
        this.p2Score = 0
        this.nextGameStarter = 'p1'
        this.setUpEventListener()
    }

    // cretae a function that setsup the evenlistener
    setUpEventListener(){
        // Listen for the name form submission
        this.setupForm.addEventListener('submit', (e) => {
            e.preventDefault() //Prevent the page from refreshing on submit
            this.startGame()
        })
        // Listen for clicks on the board cells
        this.cells.forEach(cell =>{
            cell.addEventListener('click', (e) => {
                //Only allow clicking if the game has started or not over
                if(!this.game || this.game.gameOver) return;
                const index = parseInt(e.target.getAttribute('data-index'))
                this.handleCellClick(index)
            })
        })
        // Listen for clicks on the reset button
        this.resetButton.addEventListener('click', ()=> this.restartGame())
        this.switchButton.addEventListener('click', () => this.handleStarterSwitch())
    }

    startGame(){
        // Extract the name directly from the input 
        const p1Name = this.p1Input.value.trim();
        const p2Name = this.p2Input.value.trim();
        // Start the game
        this.game = new Game(p1Name, p2Name)

        // Create a unique key for this specific matchup (alphabetically sorted)
        const sortedNames = [p1Name.toLowerCase(), p2Name.toLowerCase()].sort()
        this.matchupKey = `ttt_matchup_${sortedNames[0]}_vs_${sortedNames[1]}`;

        // 💾 LOCAL STORAGE UPDATE: Load the combined object for this matchup
        // We store it as a small JSON object: { [p1Name]: score, [p2Name]: score }
        const savedScores = JSON.parse(localStorage.getItem(this.matchupKey)) || {};
        
        // If this matchup has history, load it. Otherwise, defaults to 0!
        this.p1Score = savedScores[p1Name] || 0;
        this.p2Score = savedScores[p2Name] || 0;

        // Update labels on the scoreboard to display their names
        this.p1Label.innerText = `${p1Name} (X)`;
        this.p2Label.innerText = `${p2Name} (O)`;

        // Hide the setup form and show the game board
        this.setupForm.classList.add('hidden')
        this.gameContainer.classList.remove('hidden')

        // Default starting configuration
        this.nextGameStarter = 'p1'

        this.updateUI()
    }

    // Switches who starts the next match and flashes a quick alert
    handleStarterSwitch(){
        this.nextGameStarter = (this.nextGameStarter === 'p1') ? 'p2' : 'p1';

        // Get current names to notify players who is selected
    const nextName = this.nextGameStarter === 'p1' ? this.game.p1.name : this.game.p2.name;
    
    alert(`🔄 Setting changed! ${nextName} will go first on the next game reset.`);
  
    }

    //  crete a function that handles cell click
    handleCellClick(index){
        this.game.play(index)
        // Check if the speific move triggered a win condition
        if(this.game.gameOver && this.game.checkWin()){
            this.handleWinAllocation()
        }
        // Refresh the screen to reflect game changes
        this.updateUI() 
    }
    // Create a function that saves the score in ocal storage
    handleWinAllocation(){
        if(this.game.currentPlayer === this.game.p1){
            this.p1Score++;
        }else{
            this.p2Score++;
        }
        // 🔄 NEW: Save BOTH scores together under the unique matchup key
    const scoreData = {
      [this.game.p1.name]: this.p1Score,
      [this.game.p2.name]: this.p2Score
        };
        // Save the combined object to local storage as a text string
        localStorage.setItem(this.matchupkey, JSON.stringify(scoreData))
    }


    //  Create a function that updates the UI
    updateUI(){
        // Update the textvalue on all 9 buttons matching the array state
        const gridState = this.game.board.grid
        this.cells.forEach((cell, i)=> {
            cell.innerText = gridState[i]
        })
        // Synchronize main text status headers
        this.p1Display.innerText = this.p1Score;
        this.p2Display.innerText = this.p2Score;

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
            this.game = new Game(this.game.p1.name, this.game.p2.name)
            if(this.nextGameStarter === 'p2'){
                this.game.currentPlayer = this.game.p2
            }
            this.updateUI()
        }
}

// START THE GAME ON WINDOW LOAD
 const app = new DOMManager()