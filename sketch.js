var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg;

function preload(){
  trex_running = loadAnimation("trex1.gif","trex3.gif","trex4.gif");
  trex_collided = loadAnimation("trex_collided.gif");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.gif");
  
  obstacle1 = loadImage("obstacle1.gif");
  obstacle2 = loadImage("obstacle2.gif");
  obstacle3 = loadImage("obstacle3.gif");
  obstacle4 = loadImage("obstacle4.gif");
  obstacle5 = loadImage("obstacle5.gif");
  obstacle6 = loadImage("obstacle6.gif");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-80,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
                      
  ground = createSprite(width/2,height-10,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.3;

  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.scale=0.5;
  
  invisibleGround = createSprite(width/2,height-10,width,20);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("circle",0,0,trex.radius);
  score = 0;
  
}

function draw() {
  
  background('orange');
  text("Score: "+ score, width/2,height-400);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)

    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if((touches.length>0) || keyDown("space")&& trex.y >= height-120) {
        trex.velocityY = -12;
        touches = [];
    }
    
    
    trex.velocityY = trex.velocityY + 0.8
  

    spawnClouds();
  
 
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
     
     if(mousePressedOver(restart)) {
      reset();
    }
   }
  
   trex.collide(invisibleGround);


  drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach(); 
  trex.changeAnimation("running",trex_running);
  score = 0;
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width/2,height-30,width,20);
   obstacle.velocityX = -(6 + score/100);
   obstacle.addImage(obstacle6);
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
             break;
      default: break;
    }
    obstacle.scale = 0.6;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width/2,height-10,40,10);
    cloud.y = Math.round(random(height-200,height-300));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    cloud.lifetime = 200;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
}