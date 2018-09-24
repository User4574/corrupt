let 
  cursorrow = -1,
  cursorcol = -1,
  rows = 15,
  cols = 15,
  scale = 25,
  grid = [],
  windiv,
  reticule = false,
  errors = false;

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
  textSize(14);

  windiv = createP('');
}

function draw() {
  noStroke();
  for(let row = 0; row < rows; row++) {
    for(let col = 0; col < cols; col++) {
      switch(grid[row][col]['clicked']) {
        case 1:
          fill(255);
          rect(col*scale, row*scale, scale, scale);
          if(errors && error(row, col))
            fill(255, 0, 0);
          else
            fill(0);
          text(nsum(row, col), (col+0.5)*scale, (row+0.5)*scale);
          break;
        case 2:
          fill(0);
          rect(col*scale, row*scale, scale, scale);
          if(errors && error(row, col))
            fill(255, 0, 0);
          else
          fill(255);
          text(nsum(row, col), (col+0.5)*scale, (row+0.5)*scale);
          break;
        default:
          fill(159);
          rect(col*scale, row*scale, scale, scale);
          if(errors && error(row, col))
            fill(255, 0, 0);
          else
          fill(0);
          text(nsum(row, col), (col+0.5)*scale, (row+0.5)*scale);
      }
      if (cursorrow == row && cursorcol == col) {
        noFill();
        strokeWeight(2);
        if(grid[row][col]['clicked'] == 1)
          stroke(0, 0, 255);
        else
          stroke(0, 255, 0);
        ellipse((col+0.5)*scale, (row+0.5)*scale, scale-4);
        noStroke();
      }
    }
  }

  if(reticule) {
    let
      col = Math.floor(mouseX / scale),
    row = Math.floor(mouseY / scale);
    noFill();
    strokeWeight(1);
    stroke(255, 0, 0);
    rect((col-1)*scale, (row-1)*scale, 3*scale, 3*scale);
    rect(col*scale, row*scale, scale, scale);
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

  if( col > -1 && col < cols &&
      row > -1 && row < rows ) {
    switch(mouseButton) {
      case CENTER:
        grid[row][col]['clicked'] = 0;
        break;
      case RIGHT:
        grid[row][col]['clicked'] -= 1;
        break;
      default:
        grid[row][col]['clicked'] += 1;
    }

    if(grid[row][col]['clicked'] == 3)
      grid[row][col]['clicked'] = 0;
    if(grid[row][col]['clicked'] == -1)
      grid[row][col]['clicked'] = 2;
  }

  return false;
}

function keyPressed() {
  switch(keyCode) {
    case 82: //r
      reticule = !reticule;
      break;
    case 69: //e
      errors = !errors;
      break;
    case 37: //Left
      cursorcol -= 1;
      break;
    case 38: //Up
      cursorrow -= 1;
      break;
    case 39: //Right
      cursorcol += 1;
      break;
    case 40: //Down
      cursorrow += 1;
      break;
    case 88: //x
      grid[cursorrow][cursorcol]['clicked'] -= 1;
      break;
    case 90: //z
      grid[cursorrow][cursorcol]['clicked'] += 1;
  }

  if (cursorcol < 0)          cursorcol = 0;
  if (cursorcol > (cols - 1)) cursorcol = (cols - 1);
  if (cursorrow < 0)          cursorrow = 0;
  if (cursorrow > (rows - 1)) cursorrow = (rows - 1);

  if(grid[cursorrow][cursorcol]['clicked'] == 3)
    grid[cursorrow][cursorcol]['clicked'] = 0;
  if(grid[cursorrow][cursorcol]['clicked'] == -1)
    grid[cursorrow][cursorcol]['clicked'] = 2;
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

function error(r, c) {
  if( (r>0        && c>0        && grid[r-1][c-1]['clicked'] == 0 ) ||
      (r>0                      && grid[r-1][c]['clicked']   == 0 ) ||
      (r>0        && c<(cols-1) && grid[r-1][c+1]['clicked'] == 0 ) ||
      (              c>0        && grid[r][c-1]['clicked']   == 0 ) ||
      (              c<(cols-1) && grid[r][c+1]['clicked']   == 0 ) ||
      (r<(rows-1) && c>0        && grid[r+1][c-1]['clicked'] == 0 ) ||
      (r<(rows-1)               && grid[r+1][c]['clicked']   == 0 ) ||
      (r<(rows-1) && c<(cols-1) && grid[r+1][c+1]['clicked'] == 0 ) )
    return false;

  let sum = 0;

  if(r>0 && c>0 && grid[r-1][c-1]['clicked'] == 1) sum += 1;
  if(r>0 && grid[r-1][c]['clicked'] == 1) sum += 1;
  if(r>0 && c<(cols-1) && grid[r-1][c+1]['clicked'] == 1) sum += 1;
  if(c>0 && grid[r][c-1]['clicked'] == 1) sum += 1;
  if(c<(cols-1) && grid[r][c+1]['clicked'] == 1) sum += 1;
  if(r<(rows-1) && c>0 && grid[r+1][c-1]['clicked'] == 1) sum += 1;
  if(r<(rows-1) && grid[r+1][c]['clicked'] == 1) sum += 1;
  if(r<(rows-1) && c<(cols-1) && grid[r+1][c+1]['clicked'] == 1) sum += 1;

  return nsum(r, c) != sum;
}
