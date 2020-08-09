
/**
 * Global varible
 * 
 * pen colour(RGB), 
 * background colour(RGB),
 * pen type
 */
var sR = 120;
var sG = 255;
var sB = 255;
var gR = 0;
var gG = 0;
var gB = 50;
var lastPenType = "line";
var penType = "line";
var buttonType = "pen";
var timer;
var FPS = 60;
var eraserSize = 20;
var isInstructionDone = false;
var InstructionCounter = 0;
var isInit = 0;
var boardType = "tradition";
var ElemsStatus = true;
var pPoint = 0;
var Point = 0;
var saveC = false;

//main elements
var buttons = [];
var elems = [];
var colBar;

//icons image
var burshIcon;
var eraserIcon;
var saveIcon;
var trashbinIcon;
var newIcon;
var tridationIcon;

function preload() {
  // load any assets (images, sounds etc.) here
  burshIcon = loadImage("assets/brush.png");
  eraserIcon = loadImage("assets/eraser.png");
  saveIcon = loadImage("assets/save.png");
  trashbinIcon = loadImage("assets/trashbin.png");
  newIcon = loadImage("assets/doorA.png");
  tridationIcon = loadImage("assets/doorB.png");
}

/**
 * This function defined buttons
 * objects which for all buttons
 * on the screen, save, clear 
 * screen, pause, start ,eraser, 
 * and types of brush and a button
 * decide to change colour(brush or background)
 * @param X  , button's X location
 * @param Y  , button's Y location
 * @param W  , button's width and height
 * @param type , button's type
 */
function btns(X, Y, W, type){
  this.X = X;
  this.Y = Y;
  this.W = W;
  this.type = type;
}
btns.prototype.isMouseOn = function(){
  if (mouseX >= this.X && mouseX <= this.X + this.W &&
    mouseY >= this.Y && mouseY <= this.Y + this.W) {
      if(boardType == "tradition" && this.type != "tradition" && this.type != "eraser" && this.type != "nEra") return false;
      else return true;
    }
  else 
      return false;

}
btns.prototype.clickBtn = function(){
  if(this.type == "pen"){
      buttonType = "bkg";
      this.type = "bkg";
  }else if(this.type == "bkg"){
    buttonType = "pen";
    this.type = "pen";
  }else if(this.type == "eraser"){
    if(penType != "eraser")
      lastPenType = penType;
    if(penType == "eraser")
      penType = lastPenType;
    else penType = "eraser";
    this.type = "nEra";
  }else if(this.type == "nEra"){
    if(penType == "eraser")
      penType = lastPenType;
    else if(penType != "eraser")
      penType = "eraser";
    this.type = "eraser"
  }else if(this.type == "pause"){
    ElemsStatus = false;
    for(var i = 0; i < elems.length; i++){
      elems[i].status = ElemsStatus;
    }
    this.type = "start";
  }else if(this.type == "start"){
    ElemsStatus = true;
    for(var i = 0; i < elems.length; i++){
      elems[i].status = ElemsStatus;
    }
    this.type = "pause"
  }else if(this.type == "save"){
    saveC = true;
  }else if(this.type == "cls"){
    elems = [];
  }else if(this.type == "line"){
    lastPenType = "ellipse";
    penType = "ellipse";
    this.type = "ellipse";
  }else if(this.type == "ellipse"){
    //the "arc" is triangle, type defined as "triangle" or "tri" is not wrking
    //those are String, should not be conflict with triangle in p5.js. weird
    lastPenType = "arc";
    penType = "arc";
    this.type = "triangle";
  }else if(this.type == "triangle"){
    lastPenType = "rect";
    penType = "rect";
    this.type = "rect";
  }else if(this.type == "rect"){
    lastPenType = "line";
    penType = "line";
    this.type = "line";
    eraserSize = 20;
  }else if(this.type == "tradition"){
    boardType = "new";
    this.type = "new";
    eraserSize = 20;
    elems = [];
    if(isInit == 0){
    InstructionCounter = -1;
    isInstructionDone = false;
    isInit = 1;
    }
  }else if(this.type == "new"){
    boardType = "tradition";
    buttonType = "pen"
    elems = [];
    this.type = "tradition";
  }
}
btns.prototype.disp = function(){
  stroke(0);
  strokeWeight(1);
  if(boardType == "tradition" && this.type != "tradition" && this.type != "eraser" && this.type != "nEra")
    fill(161, 161, 161, 100);
  else 
    fill(255,255,255);
  rect(this.X, this.Y, this.W, this.W, 5);
  if(this.type == "bkg"){
    fill(0);
    rect(this.X+3, this.Y+5, 24,20);
    fill(255);
    rect(this.X+5, this.Y+7, 20,16);
    fill(0);
    rect(this.X+7, this.Y+9, 16,12);
    noFill();
  }else if(this.type == "pen"){
    image(burshIcon, this.X+3,this.Y+3, 24,24);
  }else if(this.type == "eraser" || this.type == "nEra"){
    image(eraserIcon, this.X+3,this.Y+3, 24,24);
  }else if(this.type == "save"){
    image(saveIcon, this.X+3,this.Y+3, 24,24);
  }else if(this.type == "pause"){
    fill(0);
    translate(this.X + this.W / 2, this.Y + this.W / 2);
    rectMode(CENTER);
    rect(-4, 0, 4, 15);
    rect(4, 0, 4, 15);
    rectMode(CORNER);
    resetMatrix();
  }else if(this.type == "start"){
    fill(0);
    translate(this.X + this.W / 2, this.Y + this.W / 2);
    triangle(-3, -7, -3, 7, 8, 0);
    resetMatrix();
  }else if(this.type == "cls"){
    image(trashbinIcon, this.X+3,this.Y+3, 24,24);
  }else if(this.type == "line"){
    fill(0);
    translate(this.X + this.W/2, this.Y + this.W/2);
    line(-10,10,10,-10);
    resetMatrix();
  }else if(this.type == "ellipse"){
    fill(0);
    translate(this.X + this.W/2, this.Y + this.W/2);
    ellipse(0, 0, 10, 10);
    resetMatrix();
  }else if(this.type == "rect"){
    fill(0);
    translate(this.X + this.W/2, this.Y + this.W/2);
    rect(-5,-5,10,10);
    resetMatrix();
  }else if(this.type == "triangle"){
    fill(0);
    translate(this.X + this.W/2, this.Y + this.W/2);
    triangle(-5,5,0,-5,5,5);
    resetMatrix();
  }else if(this.type == "tradition"){
    image(newIcon, this.X+3, this.Y+3, 24, 24);
  }else if(this.type == "new"){
    image(tridationIcon, this.X+3, this.Y+3, 24, 24);
  }
}

/**
 * This is a function for defined
 * object colour bar, able user
 * pick up colour. Impelement by using
 * HSB colour mode.
 * 
 * @param X , bar's X location
 * @param Y , bar's Y location
 * @param W , bar's Width
 */
function colourBar(X, Y, W){
  this.X = X;
  this.Y = Y;
  this.W = W;
  this.color;
}
colourBar.prototype.isMouseInBar = function(){
  if(mouseX >= this.X && mouseX <= this.X + this.W &&
    mouseY >= this.Y && mouseY <= this.Y +300)
      return true;
  else 
    return false;
}
colourBar.prototype.click = function(){
  var h = (mouseY - this.Y) / (300/360);
  if(h >= 360){
    h = 360;
  }
  var rgbh = convertToRGB(h,80,80);
  if(buttonType == "bkg"){
    if((mouseY - this.Y) <75)
      rgbh = convertToRGB(0,0,0);
    else if((mouseY - this.Y) < 150)
      rgbh = convertToRGB(240,100,19);
    else if((mouseY - this.Y) < 225)
      rgbh = convertToRGB(180,21,100);
    else
      rgbh = convertToRGB(0,0,100);
    gR = rgbh[0];
    gG = rgbh[1];
    gB = rgbh[2];
  }else if(buttonType == "pen"){
    sR = rgbh[0];
    sG = rgbh[1];
    sB = rgbh[2];
  }
}
colourBar.prototype.disp = function(){
  noStroke();
  colorMode(HSB);
  if(buttonType == "bkg"){
    stroke(255);
    strokeWeight(1);
    for(var i = 0; i <300; i += 75){
      if(i == 0)
        fill(0,0,0);
      else if(i == 75)
        fill(240,100,19);
      else if(i == 150)
        fill(180,21,100);
      else
        fill(0,0,100);
      rect(this.X, this.Y+i, this.W, 75);
    }
  }
  else{
    noStroke();
  //Minimum value between each colour is 4, Thus i+=4.
   for(var i = 0; i <=360; i += 4){
       fill(i,100,100);
        rect(this.X, this.Y+i*(300/360), this.W, 5*(300/360));
    }
  }
  colorMode(RGB);
}
colourBar.prototype.pointer = function(){
  noFill();
  strokeWeight(3);
  stroke(166,166,166);
  if(Point >= this.Y + 295) Point = this.Y+295;
  rect(this.X, Point, 29, 6);
}

var SizeRandomized;
/**
 * The Elements define all sketchs type, animation etc.
 * 
 * 
 * @param {*} XY , the element vector position, original
 * @param {*} size , the move size of element, any emelents animation will within the value. 
 * @param {*} R , colour R value
 * @param {*} G , colour G value
 * @param {*} B , colour B value
 */
function Elements(XY, size, R, G, B){
  this.XY = createVector(XY.x, XY.y);
  this.XY.x += (random(20) - 10);
  this.XY.y += (random(20) - 10);
  this.sizeInUse = createVector(0,0);
  this.scale = 0.5;
  SizeRandomized = size/2 + random(0, 10);
  this.base = createVector(SizeRandomized, SizeRandomized);
  this.timer = 0;
  this.rotation = random(TWO_PI);
  this.R = R;
  this.G = G;
  this.B = B;
  if(boardType == "tradition") this.type = boardType;
  else this.type = penType;
  this.lastX = pmouseX;
  this.lastY = pmouseY;
  this.curX = mouseX;
  this.curY = mouseY;
  this.status = ElemsStatus;
  this.EraserSize = eraserSize;
}
Elements.prototype.rander = function(){
  noStroke();
  var colour = [this.sizeInUse.x*this.R/15,this.sizeInUse.x*this.G/15,this.sizeInUse.x*this.B/15];
  if(this.type == "line"){
    strokeWeight(sin(this.timer) * (0.5 + this.sizeInUse.x/2));
    stroke(colour[0],colour[1], colour[2],round(sin(this.timer) * 100));
    line(this.lastX, this.lastY, this.curX, this.curY);
    strokeWeight(sin(this.timer)/10+this.sizeInUse.x/2);
    stroke(colour[0],colour[1], colour[2]);
    line(this.lastX, this.lastY, this.curX, this.curY);
  }else if(this.type == "ellipse"){
    translate(this.XY.x, this.XY.y);
    fill(colour[0],colour[1], colour[2],round(sin(this.timer) * 100));
    ellipse(cos(this.timer) * this.base.x, sin(this.timer) * this.base.y, this.sizeInUse.x * 1.2, this.sizeInUse.y * 1.2);
    fill(colour[0],colour[1], colour[2]);
    ellipse(cos(this.timer) * this.base.x, sin(this.timer) * this.base.y, this.sizeInUse.x, this.sizeInUse.y);
    resetMatrix();
  }else if(this.type == "rect"){
    translate(this.XY.x, this.XY.y);
    noStroke();
    rotate(this.rotation);
    stroke(colour[0],colour[1], colour[2],round(sin(this.timer) * 100));
    strokeWeight(sin(this.timer) * (0.5 + this.sizeInUse.x/2));
    fill(colour[0],colour[1], colour[2]);
    rect(sin(this.timer) * this.base.x, cos(this.timer) * this.base.y, this.sizeInUse.x, this.sizeInUse.y );
    resetMatrix();
  }else if(this.type == "arc"){
    //the "arc" is triangle, type defined as "triangle" or "tri" is not wrking
    //those are String, should not be conflict with triangle in p5.js. weird
    translate(this.XY.x, this.XY.y);
    noStroke();
    rotate(this.rotation);
    var sinP1 = sin(this.timer) * this.base.x - this.sizeInUse.x * 0.5;
    var cosP1 = cos(this.timer) * this.base.y - this.sizeInUse.y  * 0.5;
    var sinP2 = sin(this.timer) * this.base.x + this.sizeInUse.x  * 0.5;
    var cosP2 = cos(this.timer) * this.base.y - this.sizeInUse.y  * 0.5;
    var sinP3 = sin(this.timer) * this.base.x * 0.5;
    var cosP3 = cos(this.timer) * this.base.y + this.sizeInUse.y  * 0.9 * 0.5;
    stroke(colour[0],colour[1], colour[2],round(sin(this.timer) * 100));
    strokeWeight(sin(this.timer) * (0.5 + this.sizeInUse.x/2));
    fill(colour[0],colour[1], colour[2]);
    triangle(sinP1,cosP1,sinP2,cosP2,sinP3,cosP3);
    resetMatrix();
  }else if(this.type == "tradition"){
    fill(this.R, this.G, this.B);
    if(this.R == 255 && this.G == 255 && this.B == 255) strokeWeight(this.EraserSize);
    else strokeWeight(2);
    stroke(this.R, this.G, this.B);
    line(this.lastX, this.lastY, this.curX, this.curY);
  }
}
Elements.prototype.movation = function(){
  this.sizeInUse = createVector(this.base.x + sin(this.timer)*this.base.x*this.scale, this.base.y + sin(this.timer)*this.base.y*this.scale);
  if(this.status) this.timer += 1/FPS;
}

/**
 * Defined the instruction introduce
 * buttons and functions of draw board
 * 
 * Only show once after open at tradtion and
 * new edtion
 */
function Instruction(){
  if(boardType == "tradition"){
      diag("t");
      if(InstructionCounter == 0) {
        textSize(15);
        text("Change pen colour ->", windowWidth-200,150);
      }
      if(InstructionCounter == 1){
        textSize(15);
        text("Eraser ->", windowWidth-110,390);
      }
      if(InstructionCounter == 2){
        textSize(15);
        text("Try new! ->", windowWidth-120,510);
      }
      if(InstructionCounter == 3) isInstructionDone = true;
  }
  else{
    fill(255);
    diag("n");
    if(InstructionCounter == 0) {
      textSize(15);
      text("Change pen colour ->", windowWidth-200,150);
      text("Change pen colour ->",windowWidth-190,330);
    }
    if(InstructionCounter == 1){
      textSize(15);
      buttonType = "bkg";
      text("Change background colour ->", windowWidth-250,150);
      text("Change background colour ->",windowWidth-240,330);
    }
    if(InstructionCounter == 2){
      textSize(15);
      buttonType = "pen";
      text("Set pen type ->", windowWidth-150,360);
    }
    if(InstructionCounter == 3){
      textSize(15);
      text("Eraser ->", windowWidth-110,390);
    }
    if(InstructionCounter == 4){
      textSize(15);
      text("Clean screen ->", windowWidth-150,420);
    }
    if(InstructionCounter == 5){
      textSize(15);
      text("Save your creation ->", windowWidth-185,450);
    }
    if(InstructionCounter == 6){
      textSize(15);
      text("Stop/start animation ->", windowWidth-190,480);
    }
    if(InstructionCounter == 7){
      textSize(15);
      text("Classic ->", windowWidth-120,510);
    }
    if(InstructionCounter == 8) isInstructionDone = true;
  }
}

/**
 * Defined a diag about the title in the instruction
 * @param {*} type , which diag should to display
 */
function diag(type){
  fill(166,166,166,100);
  rect(20,20,200,100,5);
  fill(0)
  textSize(20)
  if(type == "t"){
    text("Classic draw board",35,70);
  }
  else if("n"){
    fill(255);
    text("New draw board",50,70);
  }
}
  
  function setup() {
      createCanvas(windowWidth, windowHeight);
      strokeCap(PROJECT);//set the stroke no round
      reset();
      // any additional setup code goes here
  }

  /**
   * This function is for set up all
   * buttons, bar. For resize window as well
   */
  function reset(){
    Point = 5;
    colBar = new colourBar(windowWidth-34,5,29);
    buttons = [];
    buttons.push(new btns(windowWidth-35,310,30, "pen"));
    buttons.push(new btns(windowWidth-35,310+30,30, "line"));
    buttons.push(new btns(windowWidth-35,310+60,30, "eraser"));
    buttons.push(new btns(windowWidth-35,310+90,30, "cls"));
    buttons.push(new btns(windowWidth-35,310+120,30, "save"));
    buttons.push(new btns(windowWidth-35,310+150,30, "pause"));
    buttons.push(new btns(windowWidth-35,310+180,30, "tradition"));
  }
  
  function draw() {
    timer += 1/FPS;
    colorMode(RGB);
    
    if(boardType == "tradition") background(255);
    else background(color(gR,gG,gB));

    if(!isInstructionDone)
      Instruction();
    if(isInstructionDone)
      drawElem();
    setCursor();
    if(!saveC){
      colBar.disp();
      colBar.pointer();
      for(var i = 0; i < buttons.length; i++){
        buttons[i].disp();
      }
    }
    if(saveC){
      saveCanvas("Your_creation", "png");
      saveC = false;
    }
    
      // your "draw loop" code goes here
  }

  /**
   * The main funciton for display the elements
   * on screen. Also supply the operation with
   * elements. 
   */
  function drawElem(){
    if(mouseIsPressed && mouseX < (windowWidth - 40)){
      if(penType == "eraser" && boardType == "tradition"){
        var location = createVector(mouseX,mouseY);
        elems.push(new Elements(location, sqrt((mouseX-pmouseX)*(mouseX-pmouseX)+(mouseY-pmouseY)*(mouseY-pmouseY)), 255,255,255));
      }
      else if(penType == "line" || penType == "arc" || penType == "ellipse" || penType == "rect" || penType == "triangle"){
          var location = createVector(mouseX,mouseY);
          elems.push(new Elements(location, sqrt((mouseX-pmouseX)*(mouseX-pmouseX)+(mouseY-pmouseY)*(mouseY-pmouseY)), sR,sG,sB));
      }else if(penType == "eraser" && elems.length > 0){
          for(var i = 0; i < elems.length; i++){
            if(sqrt((elems[i].XY.x - mouseX)*(elems[i].XY.x - mouseX)+(elems[i].XY.y - mouseY)*(elems[i].XY.x - mouseY)) <= eraserSize){
              elems.splice(i,1);
              break;
            }
          }
      }
    }
    for(var i = 0; i <elems.length; i++){
      elems[i].rander();
      elems[i].movation();
    }
  }

/**
 * Setting cursor.
 * Customize cursor to relate to pen type
 */
function setCursor(){
  if(mouseX > windowWidth - 40){
    if(colBar.isMouseInBar()) cursor(HAND);
    var y = 305;
    for(var i = 0; i < buttons.length; i++){
      if(buttons[i].isMouseOn()) cursor(HAND);
      y+=30;
    }
    if(mouseY <= y) cursor(HAND);
  }else{
    noCursor();
    strokeWeight(1);
    resetMatrix();
    fill(sR,sG,sB);
    if(penType == "line" || boardType == "tradition" && penType != "eraser"){
      translate(mouseX, mouseY);
      noFill();
      if(boardType == "tradition") stroke(0);
      else stroke(255 - gR);
      ellipse(0, 0, 20, 20);
      fill(sR, sG, sB);
      noStroke();
      ellipse(0, 0, 5, 5);
      resetMatrix();
    }else if(penType == "ellipse"){
      ellipse(mouseX, mouseY, 10, 10);
    }else if(penType == "rect"){
      rect(mouseX-5,mouseY-5,10,10);
    }else if(penType == "arc"){
      triangle(mouseX - 5, mouseY + 5, mouseX + 5, mouseY + 5, mouseX, mouseY - 5);
    }else if(penType == "eraser" && boardType == "tradition"){
      translate(mouseX, mouseY);
      noFill();
      stroke(0);
      ellipse(0, 0, eraserSize, eraserSize);
      fill(255-gR, 255-gR, 255-gR);
      noStroke();
      ellipse(0, 0, 6, 6);
      resetMatrix();
    }else if(penType == "eraser"){
      translate(mouseX, mouseY);
      noFill();
      stroke(255 - gR);
      ellipse(0, 0, eraserSize, eraserSize);
      fill(255-gR, 255-gR, 255-gR);
      noStroke();
      ellipse(0, 0, 6, 6);
      resetMatrix();
    }
  }
}

/**
 * set the windows dynamically
 */
function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
  reset();
}

/**
 * Event, mouse
 */
function mouseDragged(){
  if(colBar.isMouseInBar()){
    colBar.click();
    pPoint = mouseY;
    Point += (pPoint - Point) * 0.7;

  }
}
function mouseClicked(){
  for(var i = 0; i < buttons.length; i++){
    if(buttons[i].isMouseOn()) buttons[i].clickBtn();
  }
  if(colBar.isMouseInBar()){
    colBar.click();
    pPoint = mouseY;
    Point += (pPoint - Point)
  }
  if(!isInstructionDone) InstructionCounter++;
}

/**
 * A handler for changeable eraser size.
 * use mouse wheels, not relate to direction
 * on the wheel. Size between 10 and 400.
 * Increase first, reach 400 then decrease to 10
 * repeat.
 */
var inc = true;
function mouseWheel(event){
  if(inc){
    eraserSize += abs(event.delta);
    if(eraserSize >= 400) inc = false;
  }
  else{
    eraserSize -= abs(event.delta);
    if(eraserSize <= 10) inc = true;
  }
}



/**
 * A function to convert HSB color
 * to RGB color
 * 
 * intake Hue, Saturation, Brightness, return RGB, 
 * 
 * algorithm from https://en.wikipedia.org/wiki/HSL_and_HSV
 * 
 * @param H 
 * @param S 
 * @param B 
 */
function convertToRGB(H, S, B){
  if(H >= 360){
    H -= 360;
  }
    var sat = S / 100;//max : 1
		var bri = B / 100;
		var v = sat * bri;
		var h = H / 60;
		var t = v * (1 - Math.abs(h % 2 - 1));
    var m = bri - v;
    
		v = Math.floor((v + m) * 255);//original value between 0 - 1, convert to 255
		t = Math.floor((t + m) * 255);
		m = Math.floor(m * 255);
    var outRGB = []
		if (h >= 0 && h < 1) {outRGB.push(v); outRGB.push(t); outRGB.push(m)}
		if (h >= 1 && h < 2) {outRGB.push(t); outRGB.push(v); outRGB.push(m)}
		if (h >= 2 && h < 3) {outRGB.push(m); outRGB.push(v); outRGB.push(t)}
		if (h >= 3 && h < 4) {outRGB.push(m); outRGB.push(t); outRGB.push(v)}
		if (h >= 4 && h < 5) {outRGB.push(t); outRGB.push(m); outRGB.push(v)}
    if (h >= 5 && h < 6) {outRGB.push(v); outRGB.push(m); outRGB.push(t)}
    return outRGB;
}
