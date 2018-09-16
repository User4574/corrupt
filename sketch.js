let 
  rows = 15,
  cols = 15,
  scale = 25,
  grid = [],
  windiv;

function setup() {
	createCanvas(scale*cols, scale*rows);

  for(let row = 0; row < rows; row++) {
    grid[row] = [];
    for(let col = 0; col < cols; col++)
      grid[row][col] = {
        'corrupt': (random(2) < 0.7),
        'clicked': 0
      };
  }

  textAlign(CENTER, CENTER);
  noStroke();
  textSize(14);

  windiv = createP('');
}

function draw() {
  for(let row = 0; row < rows; row++) {
    for(let col = 0; col < cols; col++) {
      switch(grid[row][col]['clicked']) {
        case 1:
          fill(255);
          rect(col*scale, row*scale, scale, scale);
          fill(0);
          text(nsum(row, col), (col+0.5)*scale, (row+0.5)*scale);
          break;
        case 2:
          fill(0);
          rect(col*scale, row*scale, scale, scale);
          fill(255);
          text(nsum(row, col), (col+0.5)*scale, (row+0.5)*scale);
          break;
        default:
          fill(159);
          rect(col*scale, row*scale, scale, scale);
          fill(0);
          text(nsum(row, col), (col+0.5)*scale, (row+0.5)*scale);
      }
    }
  }

  let correct = 0;

  for(let row = 0; row < rows; row++) {
    for(let col = 0; col < cols; col++) {
      if( grid[row][col]['corrupt'] && grid[row][col]['clicked'] == 1 ||
         !grid[row][col]['corrupt'] && grid[row][col]['clicked'] == 2 ) 
        correct += 1;
    }
  }
  
  if(correct == rows*cols) {
    noLoop();
    windiv.html('<strong>Winner!<strong>');
  }
}

function mousePressed() {
  let
    col = Math.floor(mouseX / scale),
    row = Math.floor(mouseY / scale);

  grid[row][col]['clicked'] += 1;
  grid[row][col]['clicked'] %= 3;
}

function nsum(r, c) {
  let sum = 0;

  if(r>0 && c>0 && grid[r-1][c-1]['corrupt']) sum += 1;
  if(r>0 && grid[r-1][c]['corrupt']) sum += 1;
  if(r>0 && c<(cols-1) && grid[r-1][c+1]['corrupt']) sum += 1;

  if(c>0 && grid[r][c-1]['corrupt']) sum += 1;
  if(c<(cols-1) && grid[r][c+1]['corrupt']) sum += 1;

  if(r<(rows-1) && c>0 && grid[r+1][c-1]['corrupt']) sum += 1;
  if(r<(rows-1) && grid[r+1][c]['corrupt']) sum += 1;
  if(r<(rows-1) && c<(cols-1) && grid[r+1][c+1]['corrupt']) sum += 1;

  return sum;
}
