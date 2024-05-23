class Game {
  constructor() {
    this.speed = 4;
    this.startScreen = document.getElementById("game-intro");
    this.gameScreen = document.getElementById("game-screen");
    this.gameEndScreen = document.getElementById("game-end");
    this.highScores = document.getElementById("high-scores");
    this.livesElement = document.getElementById("lives");
    this.player = new Player(
      this.gameScreen,
      110,
      180,
      400,
      250,
      "./images/car.png"
    );
    this.height = 600;
    this.width = 500;
    this.obstacles = [];
    this.lives = 5;
    this.score = 0;
    this.isGameOver = false;
    this.gameIntervalId = null;
    this.gameLoopFrequency = 1000 / 60;
    this.counter = 0;
    this.level = 175;
  }

  start() {
    this.gameScreen.style.height = `${this.height}px`;
    this.gameScreen.style.width = `${this.width}px`;
    this.startScreen.style.display = "none";
    this.gameScreen.style.display = "block";
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
  }
  gameLoop() {
    // console.log("inside the game loop");
    this.update();
    this.counter++;
    if (this.counter % this.level === 0) {
      this.obstacles.push(new Obstacle(this.gameScreen, this.speed));
    }
    if (this.score >= 3) {
      this.level = 125;
      this.speed = 8;
    }
    if (this.isGameOver) {
      clearInterval(this.gameIntervalId);
      this.gameOver();
      this.setHighScores();
    }
  }
  update() {
    // console.log(this.obstacles);
    // console.log("inside the update function");
    this.player.move();
    //you have to do a loop over the this.obstacles bc they are in an array
    this.obstacles.forEach((oneObstacle, oneObstacleIndex) => {
      oneObstacle.move();

      //if there is a collision with the oneObstacle and our car which is our player
      const thereWasACollision = this.player.didCollide(oneObstacle);
      if (thereWasACollision) {
        //first remove the obstacle from the array and from the Dom
        this.obstacles.splice(oneObstacleIndex, 1);
        oneObstacle.element.remove();
        //then add a new red car to the this.obstacles array
        // this.obstacles.push(new Obstacle(this.gameScreen, this.speed));
        this.lives -= 1;
        if (this.lives === 0) {
          this.isGameOver = true;
        }
        this.displayHearts();
        // const livesElement = document.getElementById("lives");
        // livesElement.innerText = this.lives;

        //**************for the blinking player ***************/
        this.player.blinkingPlayer();
        setTimeout(() => {
          clearInterval(this.player.blinkingInterval);
          this.player.element.style.display = "block";
        }, 1000);
      }

      //this checks if the top of the red car is bigger (on the bottom) than the game page
      if (oneObstacle.top > 700) {
        this.obstacles.splice(oneObstacleIndex, 1);
        oneObstacle.element.remove();
        //increase the score by 1
        this.score += 1;
        //always update the DOM to your new score

        const scoreElement = document.getElementById("score");
        scoreElement.innerText = this.score;
        // this.obstacles.push(new Obstacle(this.gameScreen, this.speed));
      }
    });
  }
  gameOver() {
    this.gameScreen.style.display = "none";
    this.gameEndScreen.style.display = "block";
  }
  setHighScores() {
    const scoresFromStorage = localStorage.getItem("high-scores");
    if (!scoresFromStorage) {
      localStorage.setItem("high-scores", this.score);
    } else {
      const arrOfScores = scoresFromStorage.split(",");
      arrOfScores.push(this.score);
      arrOfScores.sort((a, b) => b - a);
      const topThreeScores = arrOfScores.slice(0, 3);
      for (let i = 0; i < topThreeScores.length; i++) {
        const liElement = document.createElement("li");
        liElement.innerText = topThreeScores[i];
        this.highScores.appendChild(liElement);
      }
      localStorage.setItem("high-scores", topThreeScores);
    }
  }
  displayHearts() {
    const livesLost = 5 - this.lives;
    this.livesElement.innerText = "";
    for (let i = 0; i < this.lives; i++) {
      const heartElement = document.createElement("img");
      heartElement.setAttribute("src", "../images/Filledheart.png");
      heartElement.setAttribute("class", "hearts");
      this.livesElement.appendChild(heartElement);
    }
    for (let i = 0; i < livesLost; i++) {
      const heartElement = document.createElement("img");
      heartElement.setAttribute("src", "../images/Emptyheart.png");
      heartElement.setAttribute("class", "hearts");
      this.livesElement.appendChild(heartElement);
    }
  }
}
