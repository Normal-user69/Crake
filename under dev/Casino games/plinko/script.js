"use strict";
console.clear();
const width = 620;
const height = 534;
// Note class
class Note {
    constructor(note) {
        this.synth = new Tone.PolySynth().toDestination();
        this.synth.set({ volume: -6 });
        this.note = note;
    }
    play() {
        return this.synth.triggerAttackRelease(this.note, "32n", Tone.context.currentTime);
    }
}
const multipliers = [10, 5, 3.5, 2.5, 1.7, 1.5, 1, 0.7, 0.5, 0.2, 0.5, 0.7, 1, 1.5, 1.7, 2.5, 5];
multipliers.forEach((m, i) => (document.getElementById(`note-${i}`).innerHTML = m));
// Create notes
const notes = [
    "C#5",
    "C5",
    "B5",
    "A#5",
    "A5",
    "G#4",
    "G4",
    "F#4",
    "F4",
    "F#4",
    "G4",
    "G#4",
    "A5",
    "A#5",
    "B5",
    "C5",
    "C#5"
].map((note) => new Note(note));
let balls = 10;
const ballsEl = document.getElementById("balls");
// Click noise synth when clicking drop
const clickSynth = new Tone.NoiseSynth({ volume: -26 }).toDestination();
// Drop button
const dropButton = document.getElementById("drop-button");
const autoDropCheckbox = document.getElementById("checkbox");
let autoDropEnabled = false;
let autoDroppingInterval = null;

function updateButtonState() {
    if (balls <= 0) {
        dropButton.disabled = true;
        dropButton.innerHTML = "Out of Balls";
    } else {
        dropButton.disabled = false;
        dropButton.innerHTML = autoDropEnabled ? "Stop" : "Drop";
    }
}

dropButton.addEventListener("click", () => {
    if (balls <= 0) return; // Prevent action if no balls

    if (autoDropEnabled && autoDroppingInterval) {
        dropButton.innerHTML = "Start";
        clearInterval(autoDroppingInterval);
        autoDroppingInterval = null;
    } else if (autoDropEnabled && !autoDroppingInterval) {
        dropButton.innerHTML = "Stop";
        dropABall();
        autoDroppingInterval = setInterval(dropABall, 600);
    } else if (!autoDropEnabled) {
        dropABall();
    }
    updateButtonState();
});

autoDropCheckbox.addEventListener("input", (e) => {
    autoDropEnabled = e.target.checked;
    updateButtonState();
    if (autoDroppingInterval) {
        clearInterval(autoDroppingInterval);
        autoDroppingInterval = null;
    }
});

// Drop a ball
const BALL_RAD = 7;
function dropABall() {
    if (balls > 0) {
        balls -= 1;
        const dropLeft = width / 2 - GAP;
        const dropRight = width / 2 + GAP;
        const dropWidth = dropRight - dropLeft;
        const x = Math.random() * dropWidth + dropLeft;
        const y = -PEG_RAD;
        const ball = Bodies.circle(x, y, BALL_RAD, {
            label: "Ball",
            restitution: 0.6,
            render: {
                fillStyle: "#f23"
            }
        });
        clickSynth.triggerAttackRelease("32n", Tone.context.currentTime);
        Composite.add(engine.world, [ball]);
        updateButtonState(); // Update button state after dropping a ball
    }
}

// module aliases
const Engine = Matter.Engine, Events = Matter.Events, Render = Matter.Render, Runner = Matter.Runner, Bodies = Matter.Bodies, Composite = Matter.Composite;

// create an engine
const engine = Engine.create({
    gravity: {
        scale: 0.0007
    }
});

// create a renderer
const canvas = document.getElementById("canvas");
const render = Render.create({
    canvas,
    engine,
    options: {
        width,
        height,
        wireframes: false
    }
});

// Create pegs
const GAP = 32;
const PEG_RAD = 4;
const pegs = [];
for (let r = 0; r < 16; r++) {
    const pegsInRow = r + 3;
    for (let c = 0; c < pegsInRow; c++) {
        const x = width / 2 + (c - (pegsInRow - 1) / 2) * GAP;
        const y = GAP + r * GAP;
        const peg = Bodies.circle(x, y, PEG_RAD, {
            isStatic: true,
            label: "Peg",
            render: {
                fillStyle: "#fff"
            }
        });
        pegs.push(peg);
    }
}
Composite.add(engine.world, pegs);

// track animations for pegs
const pegAnims = new Array(pegs.length).fill(null);

// Create a ground
const ground = Bodies.rectangle(width / 2, height + 22, width * 2, 40, {
    isStatic: true,
    label: "Ground"
});
Composite.add(engine.world, [ground]);

function checkCollision(event, label1, label2, callback) {
    event.pairs.forEach(({ bodyA, bodyB }) => {
        let body1, body2;
        if (bodyA.label === label1 && bodyB.label === label2) {
            body1 = bodyA;
            body2 = bodyB;
        } else if (bodyA.label === label2 && bodyB.label === label1) {
            body1 = bodyB;
            body2 = bodyA;
        }
        if (body1 && body2) {
            callback(body1, body2);
        }
    });
}

// Trigger event on ball hitting ground
Matter.Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach(({ bodyA, bodyB }) => {
        // check for ball hitting the ground
        checkCollision(event, "Ball", "Ground", (ballToRemove) => {
            Matter.Composite.remove(engine.world, ballToRemove);
            const index = Math.floor((ballToRemove.position.x - width / 2) / GAP + 17 / 2);
            if (index >= 0 && index < 17) {
                // Register ball
                const ballsWon = Math.floor(multipliers[index]);
                balls += ballsWon;
                // Update ball count
                ballsEl.innerHTML = balls;

                //check number of balls 
                if(balls > 0){
                    dropButton.disabled = false;
                    dropButton.innerHTML = autoDropEnabled ? "Stop" : "Drop";
                }
                // Ball hit note at bottom
                const el = document.getElementById(`note-${index}`);
                if (el.dataset.pressed !== "true") {
                    const note = notes[index];
                    note.play();
                    el.dataset.pressed = true;
                    setTimeout(() => {
                        el.dataset.pressed = false;
                    }, 500);
                }
            }
        });
        // check for ball hitting peg
        checkCollision(event, "Peg", "Ball", (pegToAnimate) => {
            const index = pegs.findIndex((peg) => peg === pegToAnimate);
            if (index === -1) {
                throw new Error("Could not find peg in pegs array even though we registered a ball hitting this peg");
            }
            if (!pegAnims[index]) {
                pegAnims[index] = new Date().getTime();
            }
        });
    });
});

// run the renderer
Render.run(render);

// Create custom runner
const ctx = canvas.getContext("2d");
function run() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = new Date().getTime();
    // Draw peg expansions
    pegAnims.forEach((anim, index) => {
        if (!anim)
            return;
        const delta = now - anim;
        if (delta > 1200) {
            pegAnims[index] = null;
            return;
        }
        const peg = pegs[index];
        if (!peg)
            throw new Error("Unknown peg at index " + index);
        const pct = delta / 1200;
        const expandProgression = 1 - Math.abs(pct * 2 - 1);
        const expandRadius = expandProgression * 12;
        ctx.fillStyle = "#fff2";
        ctx.beginPath();
        ctx.arc(peg.position.x, peg.position.y, expandRadius, 0, 2 * Math.PI);
        ctx.fill();
    });
    Engine.update(engine, 1000 / 60);
    // Update ball count
    ballsEl.innerHTML = balls;
    requestAnimationFrame(run);
}
run();
