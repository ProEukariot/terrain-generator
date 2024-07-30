let w = window.innerWidth, h = window.innerHeight;
let scl = 5;
let heights = [];
let trees = [];
let branches = 4;
let specChance = 0.1;
//let HEIGHT_MAP_DEBUG = [];

function setup() {
    {
        let noiseX = 0;
        for (let i = 0; i < w / scl + 1; i++) {
            heights[i] = [];
            let noiseY = 0;
            for (let j = 0; j < h / scl + 1; j++) {
                heights[i][j] = (noise(noiseX, noiseY) - 0.5) * scl * 20;
                //random(-1, 1) * scl;
                //---hts[-5scl,5scl]
                noiseY += 0.02;
            }
            noiseX += 0.02;
        }
    }
    {
        let noiseX = 1000;
        for (let i = 0; i < w / scl + 1; i++) {
            trees[i] = [];
            //HEIGHT_MAP_DEBUG[i] = [];
            let noiseY = 1000;
            for (let j = 0; j < h / scl + 1; j++) {
                let chance = noise(noiseX, noiseY);
                //let rand = random() * 2;
                // trees[i][j] = rand < chance;

                if (chance > 0.6) {
                    trees[i][j] = true;
                } else if (chance > 0.5) {
                    trees[i][j] = random() < 0.5;
                } else if (chance > 0.2) {
                    trees[i][j] = random() < 0.01;
                } else {
                    trees[i][j] = false;
                }

                //trees[i][j] = chance > 0.6;
                //HEIGHT_MAP_DEBUG[i][j] = chance * 2;
                //trees[i][j] = rand < 0.5;
                noiseY += 0.05;
            }
            noiseX += 0.05;
        }
    }
    noLoop();
    let cnv = createCanvas(w, h, WEBGL);
    cnv.position(0, 0);
}
function draw() {
    background(165, 145, 235);
    //noStroke();
    stroke(100, 255, 100);
    strokeWeight(0.1);
    scale(0.8);
    rotateX(PI / 3);
    translate(-w / 2, -h / 2);
    for (let j = 0; j < h / scl; j++) {
        beginShape(TRIANGLE_STRIP);
        for (let i = 0; i < w / scl + 1; i++) {
            let r = map(heights[i][j], -5 * scl, 5 * scl, 0, 250);
            let g = 200;
            let b = map(heights[i][j], -5 * scl, 5 * scl, 0, 100);
            console.log(r, g, b);
            fill(r, g, b);

            // stroke(150, 255, 150);
            //console.log(heights[i][j])
            // vertex(i * scl, j * scl, 0);
            // vertex(i * scl, (j + 1) * scl, 0);
            vertex(i * scl, j * scl, heights[i][j]);
            vertex(i * scl, (j + 1) * scl, heights[i][j + 1]);
        }
        endShape();
    }
    // strokeWeight(5);
    // fill(255,0,0);
    let bound = 1;
    for (let i = 0; i < w / scl + 1; i++) {
        for (let j = 0; j < h / scl + 1; j++) {
            let rand = random(0, bound);
            // fill(HEIGHT_MAP_DEBUG[i][j] * 255);
            // ellipse(i * scl, j * scl, scl/2, scl/2);
            // noFill();
            if (trees[i][j]) {
                let tree = new Tree(i, j);
                tree.draw(branches);
                //line(i * scl, j * scl, 0, i * scl, j * scl, 5 * scl);
                // fill(255, 0, 0);
                // noStroke();
                // ellipse(i * scl, j * scl, scl/2, scl/2);
            }
        }
    }
}
class Tree {
    height = scl - (random() / 2 * scl);
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    #branch(num, special) {
        strokeWeight(num);
        line(0, 0, 0, 0, 0, this.height);
        if (num > 0) {
            push();
            translate(0, 0, this.height)
            rotateY(PI / (random() * 9 + 3));
            scale(0.5 + (random() / 5));
            this.#branch(num - 1, special);
            pop()
            push();
            translate(0, 0, this.height)
            rotateY(-PI / (random() * 6 + 3));
            scale(0.5 + (random() / 5));
            this.#branch(num - 1, special);
            pop();
        }
        else {
            if (special) {
                fill(200 + random(0, 50), 120 + random(0, 50), 200 + random(0,
                    50));
            } else {
                fill(random(0, 50), 200 + random(0, 50), random(0, 50));
            }
            ellipse(0, 0, scl * random(1, 2), scl * random(1, 2));
        }
    }
    draw(branches) {
        strokeWeight(branches);
        stroke(random(0, 50) + 120, random(0, 50) + 50, random(0, 50));
        translate(this.x * scl, this.y * scl, heights[this.x][this.y]);
        this.#branch(branches, specChance > random());
        translate(-this.x * scl, -this.y * scl, -heights[this.x][this.y]);
    }
}