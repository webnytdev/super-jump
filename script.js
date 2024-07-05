const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// load the player/ bird image

const birdImage = new Image();
birdImage.src = 'images/bird.png';


//load obstacle images

const obsatcleImages = [
    'images/obs1.jpg',
    'images/obs2.png',
    'images/obs3.jpg',
    'images/obs4.png'
].map(src =>{
    const img = new Image();
    img.src = src;
    return img;
});


//bird/player proprties

const bird = {
    x : 50,
    y : 200,
    width : 40,
    height : 40 ,
    gravity : 0.7 ,
    lift : -15 ,
    velocity : 0
}

const obstacle = [];
let frameWork = 0;
let score = 0;
let gameOver = false ; 
let baseSpeed = 2;
  

// listening to the key pressed
document.addEventListener("keydown", (e)=>{
    if(e.code === 'ArrowDown' && !gameOver){
        bird.velocity = bird.lift;
    }
})


// draw the bird image on the canvas

function drawBird(){
    ctx.drawImage(birdImage, bird.x , bird.y , bird.width , bird.height);
}

function updateBird(){

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if(bird.y + bird.height > canvas.height){

        bird.y = canvas.height - bird.height ;
        bird.velocity = 0;

    }
}

function drawObstacles(){
    obstacle.forEach(obst => {
        ctx.drawImage(obst.img, obst.x, obst.y , obst.width , obst.height);
    })
};


function updateObstacles() {
    if(frameWork % 100 ===0){
        const height = Math.floor(Math.random() * (canvas.height - 200) + 10 );
        const img = obsatcleImages[Math.floor(Math.random() * obsatcleImages.length)];

        obstacle.push({
            x : canvas.width,
            y : canvas.height - height,
            width : 50 ,
            height : height,
            speed : baseSpeed,
            img : img
        });
    }

    obstacle.forEach(obst =>{

        obst.x -= obst.speed;
    });

    if(obstacle.length > 0 && obstacle[0].x + obstacle[0].width < 0  ){
        obstacle.shift();
        score++;
        if(score % 5 === 0 ){
            baseSpeed += 0.5
        }
    };


}


function checkCollision() {
    obstacle.forEach(obst =>{
        if(
            bird.x < obst.x + obst.width && bird.x + bird.width > obst.x &&
            bird.y < obst.y + obst.height && bird.y + bird.height > obst.y
        ){
            gameOver = true;
        }
    });
}


function drawScore() {
    ctx.fillStyle = 'blue';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}` , 20, 35);
}


function gameLoop() {
    if(gameOver){
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText(`GAME OVER` , canvas.width / 2 - 70 , canvas.height / 2 -20);
        ctx.fillText(`You Scored ${score}`, canvas.width / 2 -85, canvas.height / 2 + 20);

        return;
    }

    ctx.clearRect(0,0, canvas.width, canvas.height);

    drawBird();
    updateBird();
    drawObstacles();
    updateObstacles();
    checkCollision();
    drawScore();

    frameWork++;
    requestAnimationFrame(gameLoop);
}



const allImages = [birdImage, ...obsatcleImages];

let loadedImages = 0;

allImages.forEach(img =>{
    img.onload = () => {
        loadedImages++;
        if(loadedImages === allImages.length){
            gameLoop();
        }
    }
})