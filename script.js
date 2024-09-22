// script.js




// Define the base speed for the game (in milliseconds)
let baseSpeed = 50;  // Start with a delay of 50ms at level 1
let currentSpeed = baseSpeed;
let level = 1; // Start with level 1

// Function to adjust speed based on the current level
function updateSpeed() {
    // Decrease the delay (increase speed) by 10ms for each new level
    currentSpeed = baseSpeed - (level - 1) * 10; 
    
    // Ensure the speed doesn't get too fast (set a minimum speed limit)
    if (currentSpeed < 50) {
        currentSpeed = 50;  // Minimum speed limit
    }
}

// Call this function whenever the player advances to the next level
function nextLevel() {
    level++;  // Move to the next level
    updateSpeed();  // Adjust the speed based on the new level
    
    // Any other logic related to advancing to the next level
}

// Main game loop with speed control
function gameLoop() {
    if (!gameOver) {
        moveSnake();
        drawGame();

        setTimeout(gameLoop, currentSpeed);  // Use current speed for the game loop delay
    }
}

// Start the game with the initial speed
setTimeout(gameLoop, currentSpeed);


// Game variables
let language = 'en';
let gameStarted = false;

// Get HTML elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cityDisplay = document.getElementById('cityDisplay');
const gameTitle = document.getElementById('gameTitle');
const startScreen = document.getElementById('startScreen');
const selectLanguageText = document.getElementById('selectLanguageText');
const startGameButton = document.getElementById('startGameButton');

// Function to select language
function selectLanguage(selectedLanguage) {
    language = selectedLanguage;
    // Update game title and start screen text
    gameTitle.innerText = strings[language].gameTitle;
    selectLanguageText.style.display = 'none';
    const languageButtons = document.getElementsByClassName('languageButton');
    for (let i = 0; i < languageButtons.length; i++) {
        languageButtons[i].style.display = 'none';
    }
    startGameButton.innerText = strings[language].startGame;
    startGameButton.style.display = 'block';
}

// Update the strings object
const strings = {
    en: {
        gameTitle: 'Discovering Cities',
        selectLanguage: 'Select Language',
        startPrompt: 'Press any key or tap the screen to start the game',
        startGame: 'Start Game',
        discoverCity: 'You discovered: ',
        moreToGo: ' more to go in Level ',
        hitWall: 'Game Over! You hit the wall.',
        hitSelf: 'Game Over! You ran into yourself.',
        hitRedDot: 'Game Over! You touched a red dot.',
        completedAllLevels: 'Congratulations! You have completed all levels!',
        citiesToDiscover: 'Discover ',
        moreCities: ' more cities!',
        level: 'Level',
        citiesDiscovered: 'Cities Discovered',
    },
    zh: {
        gameTitle: '发现城市',
        selectLanguage: '选择语言',
        startPrompt: '按任意键或触摸屏幕开始游戏',
        startGame: '开始游戏',
        discoverCity: '你发现了：',
        moreToGo: '个城市，进入第',
        hitWall: '游戏结束！你撞到了墙上。',
        hitSelf: '游戏结束！你撞到了自己。',
        hitRedDot: '游戏结束！你碰到了红点。',
        completedAllLevels: '恭喜你！你已完成所有级别！',
        citiesToDiscover: '发现',
        moreCities: '个城市！',
        level: '级别',
        citiesDiscovered: '已发现城市',
    }
};



// Rest of the game variables
let gridSize;
let tileCountX;
let tileCountY;
let snakePosX;
let snakePosY;
let velocityX;
let velocityY;
let snakeTrail;
let tailLength;
let currentLevel;
let citiesToDiscover;
let citiesDiscovered;
let citiesList;
let currentCity = "";
let cityPosX;
let cityPosY;
let redDots;
let gameInterval;

// Function to select language

// Update the selectLanguage function to show the start prompt
// script.js

// Existing variables and functions...

// Function to select language
function selectLanguage(selectedLanguage) {
    language = selectedLanguage;
    // Update the game title and start screen text
    gameTitle.innerText = strings[language].gameTitle;
    startScreen.innerHTML = `<p>${strings[language].startPrompt}</p>`;
    startScreen.style.display = 'block'; // Ensure the start screen is visible

    // Add event listeners for starting the game
    if (!gameStarted) {  // Prevent adding listeners multiple times
        document.addEventListener('keydown', startGame);
        startScreen.addEventListener('touchstart', startGame, { passive: true });
        startScreen.addEventListener('click', startGame);
    }
}


// Update the startGame function
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        startScreen.style.display = 'none';
        canvas.style.display = 'block';
        controls.style.display = 'flex';  // Show the controls
        cityDisplay.innerText = `${strings[language].level} 1: ${strings[language].citiesToDiscover}${citiesToDiscover - citiesDiscovered}${strings[language].moreCities}`;

        document.addEventListener('keydown', keyPush);
        resetGame();
        gameInterval = setInterval(game, 100);
    }
}




// City data
const cityNamesEn = [
    "New York", "London", "Tokyo", "Paris", "Sydney",
    "Rio de Janeiro", "Moscow", "Dubai", "Singapore", "Barcelona",
    "Berlin", "Madrid", "Rome", "Toronto", "Beijing",
    "Shanghai", "Mumbai", "Los Angeles", "Chicago", "Houston",
    "Philadelphia", "Phoenix", "San Antonio", "San Diego", "Dallas",
    "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus",
    "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver",
    "Washington", "Boston", "El Paso", "Detroit", "Nashville",
    "Memphis", "Portland", "Oklahoma City", "Las Vegas", "Louisville",
    "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno",
    "Sacramento", "Kansas City", "Long Beach", "Mesa", "Atlanta",
    "Colorado Springs", "Virginia Beach", "Raleigh", "Omaha", "Miami",
    "Oakland", "Minneapolis", "Tulsa", "Wichita", "New Orleans"
];

const cityNamesZh = [
    "纽约", "伦敦", "东京", "巴黎", "悉尼",
    "里约热内卢", "莫斯科", "迪拜", "新加坡", "巴塞罗那",
    "柏林", "马德里", "罗马", "多伦多", "北京",
    "上海", "孟买", "洛杉矶", "芝加哥", "休斯顿",
    "费城", "凤凰城", "圣安东尼奥", "圣地亚哥", "达拉斯",
    "圣何塞", "奥斯汀", "杰克逊维尔", "沃思堡", "哥伦布",
    "夏洛特", "旧金山", "印第安纳波利斯", "西雅图", "丹佛",
    "华盛顿", "波士顿", "埃尔帕索", "底特律", "纳什维尔",
    "孟菲斯", "波特兰", "俄克拉荷马城", "拉斯维加斯", "路易斯维尔",
    "巴尔的摩", "密尔沃基", "阿尔伯克基", "图森", "弗雷斯诺",
    "萨克拉门托", "堪萨斯城", "长滩", "梅萨", "亚特兰大",
    "科罗拉多斯普林斯", "弗吉尼亚海滩", "罗利", "奥马哈", "迈阿密",
    "奥克兰", "明尼阿波利斯", "塔尔萨", "威奇托", "新奥尔良"
];

function resetGame() {
    // Initialize level and cities
    currentLevel = 1;
    citiesDiscovered = 0;
    citiesToDiscover = currentLevel * 10;
    citiesList = language === 'en' ? cityNamesEn.slice() : cityNamesZh.slice();
    initializeLevel();
}

function initializeLevel() {
    // Adjust canvas size
    let initialCanvasWidth = 600;
    let initialCanvasHeight = 400;
    let scaleFactor = Math.pow(0.9, currentLevel - 1);

    canvas.width = initialCanvasWidth * scaleFactor;
    canvas.height = initialCanvasHeight * scaleFactor;

    // Recalculate gridSize and tile counts
    gridSize = 20; // Keeping gridSize constant for simplicity
    tileCountX = Math.floor(canvas.width / gridSize);
    tileCountY = Math.floor(canvas.height / gridSize);

    // Adjust canvas size to be a multiple of gridSize
    canvas.width = tileCountX * gridSize;
    canvas.height = tileCountY * gridSize;

    // Reset snake properties
    snakePosX = Math.floor(tileCountX / 2);
    snakePosY = Math.floor(tileCountY / 2);
    velocityX = 0; // Start with zero velocity
    velocityY = 0;
    tailLength = 1; // Start with tail length of 1 to prevent immediate self-collision
    snakeTrail = [];
    // Initialize snake trail positions
    snakeTrail.push({ x: snakePosX, y: snakePosY });

    cityDisplay.innerText = `${strings[language].level} ${currentLevel}: ${strings[language].citiesToDiscover}${citiesToDiscover - citiesDiscovered}${strings[language].moreCities}`;

    // Reset positions of dots
    cityPosX = Math.floor(Math.random() * tileCountX);
    cityPosY = Math.floor(Math.random() * tileCountY);

    // Initialize red dots
    redDots = [];
    for (let i = 0; i < currentLevel; i++) {
        let redDotX = Math.floor(Math.random() * tileCountX);
        let redDotY = Math.floor(Math.random() * tileCountY);
        // Ensure red dot doesn't spawn on the snake or city
        while ((redDotX === cityPosX && redDotY === cityPosY) ||
               (redDotX === snakePosX && redDotY === snakePosY)) {
            redDotX = Math.floor(Math.random() * tileCountX);
            redDotY = Math.floor(Math.random() * tileCountY);
        }
        redDots.push({ x: redDotX, y: redDotY });
    }
}

function game() {
    update();
    draw();
}

function update() {
    // Start moving only when a direction key is pressed
    if (velocityX === 0 && velocityY === 0) {
        return;
    }

    snakePosX += velocityX;
    snakePosY += velocityY;

    // Check for wall collision
    if (snakePosX < 0 || snakePosX >= tileCountX || snakePosY < 0 || snakePosY >= tileCountY) {
        gameOver(strings[language].hitWall);
        return;
    }

    // Move snake trail
    snakeTrail.push({ x: snakePosX, y: snakePosY });
    while (snakeTrail.length > tailLength) {
        snakeTrail.shift();
    }

    // Check collision with self
    for (let i = 0; i < snakeTrail.length - 1; i++) {
        if (snakeTrail[i].x === snakePosX && snakeTrail[i].y === snakePosY) {
            gameOver(strings[language].hitSelf);
            return;
        }
    }

    // Check if snake eats the green dot (city)
    if (snakePosX >= cityPosX - 0.5 && snakePosX < cityPosX + 1.5 &&
        snakePosY >= cityPosY - 0.5 && snakePosY < cityPosY + 1.5) {
        tailLength++;
        citiesDiscovered++;
        // Pick a random city
        if (citiesList.length > 0) {
            let cityIndex = Math.floor(Math.random() * citiesList.length);
            currentCity = citiesList.splice(cityIndex, 1)[0];
        } else {
            currentCity = "";
        }
        cityDisplay.innerText = `${strings[language].discoverCity}${currentCity}! ${strings[language].citiesToDiscover}${citiesToDiscover - citiesDiscovered}${strings[language].moreCities}`;

        // Place the green dot in a new location
        cityPosX = Math.floor(Math.random() * tileCountX);
        cityPosY = Math.floor(Math.random() * tileCountY);

        // Move red dots to new random positions
        for (let i = 0; i < redDots.length; i++) {
            let redDotX = Math.floor(Math.random() * tileCountX);
            let redDotY = Math.floor(Math.random() * tileCountY);
            // Ensure red dot doesn't spawn on the snake or city
            while ((redDotX === cityPosX && redDotY === cityPosY) ||
                   (redDotX === snakePosX && redDotY === snakePosY)) {
                redDotX = Math.floor(Math.random() * tileCountX);
                redDotY = Math.floor(Math.random() * tileCountY);
            }
            redDots[i] = { x: redDotX, y: redDotY };
        }

        // Check if level is complete
        if (citiesDiscovered >= citiesToDiscover) {
            currentLevel++;
            if (currentLevel > 10) {
                alert(strings[language].completedAllLevels);
                resetGame();
            } else {
                citiesToDiscover = currentLevel * 10;
                citiesDiscovered = 0;
                initializeLevel();
            }
        }
    }

    // Check if snake hits any red dot (obstacle)
    for (let i = 0; i < redDots.length; i++) {
        if (snakePosX === redDots[i].x && snakePosY === redDots[i].y) {
            gameOver(strings[language].hitRedDot);
            return;
        }
    }
}

function draw() {
    // Clear the canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    ctx.fillStyle = 'blue';
    for (let i = 0; i < snakeTrail.length; i++) {
        ctx.fillRect(
            snakeTrail[i].x * gridSize,
            snakeTrail[i].y * gridSize,
            gridSize - 2,
            gridSize - 2
        );
    }

    // Draw the enlarged green dot (city)
    const citySize = gridSize * 2; // Double the size
    ctx.fillStyle = 'green';
    ctx.fillRect(
        cityPosX * gridSize - gridSize / 2,
        cityPosY * gridSize - gridSize / 2,
        citySize - 2,
        citySize - 2
    );

    // Add city name to the green dot
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial'; // Increased font size
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let cityName = currentCity || '';
    if (cityName.length > 8) {
        cityName = cityName.substring(0, 8) + '...'; // Truncate long names
    }
    ctx.fillText(
        cityName,
        (cityPosX * gridSize),
        (cityPosY * gridSize)
    );

    // Draw the red dots (obstacles)
    ctx.fillStyle = 'red';
    for (let i = 0; i < redDots.length; i++) {
        ctx.fillRect(
            redDots[i].x * gridSize,
            redDots[i].y * gridSize,
            gridSize - 2,
            gridSize - 2
        );
    }
}

// In the gameOver function, ensure we re-add the touch and click event listeners
function gameOver(message) {
    // Construct the game over message with level and cities discovered
    let gameOverMessage = `${message}\n${strings[language].level} ${currentLevel}\n${strings[language].citiesDiscovered}: ${citiesDiscovered}/${citiesToDiscover}`;

    alert(gameOverMessage);
    // Stop the game interval
    clearInterval(gameInterval);
    // Reset the game
    gameStarted = false;
    canvas.style.display = 'none';
    controls.style.display = 'none'; // Hide the controls
    startScreen.style.display = 'block';
    selectLanguageText.style.display = 'none';
    startGameButton.style.display = 'block';
    startGameButton.innerText = strings[language].startGame;
    document.removeEventListener('keydown', keyPush);
}


// Control the snake with keyboard arrows
function keyPush(evt) {
    switch (evt.keyCode) {
        case 37: // Left arrow
            if (velocityX !== 1) { // Prevent reverse direction
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case 38: // Up arrow
            if (velocityY !== 1) { // Prevent reverse direction
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case 39: // Right arrow
            if (velocityX !== -1) { // Prevent reverse direction
                velocityX = 1;
                velocityY = 0;
            }
            break;
        case 40: // Down arrow
            if (velocityY !== -1) { // Prevent reverse direction
                velocityX = 0;
                velocityY = 1;
            }
            break;
    }
}

// No need to start the game automatically
// The game will start after the player selects a language and presses a key
// Existing variables and functions...

// Existing variables and functions...

// Update the startGame function to show controls
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        startScreen.style.display = 'none';
        canvas.style.display = 'block';
        controls.style.display = 'flex'; // Show the controls
        cityDisplay.innerText = `${strings[language].level} 1: ${strings[language].citiesToDiscover}${citiesToDiscover - citiesDiscovered}${strings[language].moreCities}`;
        document.removeEventListener('keydown', startGame);
        document.addEventListener('keydown', keyPush);
        resetGame();
        gameInterval = setInterval(game, 100);
    }
}

// script.js

// Existing variables and functions...

// Get the control buttons
const upButton = document.getElementById('upButton');
const downButton = document.getElementById('downButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const controls = document.getElementById('controls');

// Add event listeners for touch and click events
upButton.addEventListener('touchstart', () => changeDirection('up'));
upButton.addEventListener('click', () => changeDirection('up'));

downButton.addEventListener('touchstart', () => changeDirection('down'));
downButton.addEventListener('click', () => changeDirection('down'));

leftButton.addEventListener('touchstart', () => changeDirection('left'));
leftButton.addEventListener('click', () => changeDirection('left'));

rightButton.addEventListener('touchstart', () => changeDirection('right'));
rightButton.addEventListener('click', () => changeDirection('right'));

// Function to change direction
function changeDirection(direction) {
    switch (direction) {
        case 'left':
            if (velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case 'up':
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case 'right':
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
        case 'down':
            if (velocityY !== -1) {
                velocityX = 0;
                velocityY = 1;
            }
            break;
    }
}

// No changes needed in the rest of the code.


// Update the gameOver function to hide controls
function gameOver(message) {
    // Construct the game over message with level and cities discovered
    let gameOverMessage = `${message}\n${strings[language].level} ${currentLevel}\n${strings[language].citiesDiscovered}: ${citiesDiscovered}/${citiesToDiscover}`;
    
    alert(gameOverMessage);
    // Stop the game interval
    clearInterval(gameInterval);
    // Reset the game
    gameStarted = false;
    canvas.style.display = 'none';
    controls.style.display = 'none'; // Hide the controls
    startScreen.style.display = 'block';
    startScreen.innerHTML = `<p>${strings[language].startPrompt}</p>`;
    document.addEventListener('keydown', startGame);
    document.removeEventListener('keydown', keyPush);
}

// No need to update the HTML or CSS for swipe gestures

// script.js

// Existing variables and functions...

// Prevent double-tap zoom on the entire document
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    let now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// Prevent pinch-to-zoom on the canvas and controls
const preventDefault = function (event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
};

canvas.addEventListener('touchstart', preventDefault, { passive: false });
controls.addEventListener('touchstart', preventDefault, { passive: false });