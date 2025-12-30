import NeuralNetwork from "./logic/car/brain/neuralnetwork.js";
import Visualizer from "./logic/car/brain/visualizers/visualizer.js";
import Car from "./logic/car/car.js";
import Road from "./logic/road/road.js";
import { generateCars, generateRandomCars, generateTrafficCars, getRandomNumber, getRandomNumberInt } from "./logic/utils.js";
const p = document.createElement('p');
document.body.appendChild(p);
p.setAttribute('style', 'position: absolute; top: 0; left: 0; margin: 10px; color: white; z-index: 1;');

// main canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.id = 'mainCanvas';
canvas.width = innerWidth;
canvas.height = innerHeight;
document.body.appendChild(canvas);

// Neural network Visualization Canvas
const vCanvas = document.createElement('canvas');
const vCtx = vCanvas.getContext('2d');
vCanvas.id = 'visualCanvas';
vCanvas.width = innerWidth * 0.35;
vCanvas.height = innerHeight * 0.9;
document.body.appendChild(vCanvas);

let timeDamage = 0;

const road = new Road(ctx, canvas.width / 2, canvas.width / 5)
// const car = new Car(ctx, road.getLaneCenter(2), 200, 30, 60, 5, 'red');
// const car = new Car(ctx, road.getLaneCenter(2), 200, 30, 60, 5, 'red', 'AI');
const traffics = generateTrafficCars(100, road, Car, ctx);
// const traffics = [
//     new Car(ctx, road.getLaneCenter(2), -100, 30, 60, 5, 'red'),
//     new Car(ctx, road.getLaneCenter(1), -300, 30, 60, 5, 'red'),
//     new Car(ctx, road.getLaneCenter(3), -500, 30, 60, 5, 'red'),
//     new Car(ctx, road.getLaneCenter(2), -800, 30, 60, 5, 'red'),
//     new Car(ctx, road.getLaneCenter(1), -900, 30, 60, 5, 'red'),
//     new Car(ctx, road.getLaneCenter(3), -1150, 30, 60, 5, 'red'),
//     new Car(ctx, road.getLaneCenter(2), -200, 30, 60, 5, 'red'),
//     new Car(ctx, road.getLaneCenter(3), -300, 30, 60, 5, 'red'),
//     new Car(ctx, road.getLaneCenter(1), -800, 30, 60, 5, 'red'),
//     new Car(ctx, road.getLaneCenter(2), -1300, 30, 60, 5, 'red'),
//     new Car(ctx, road.getLaneCenter(3), -1400, 30, 60, 5, 'red'),
//     new Car(ctx, road.getLaneCenter(1), -100, 30, 60, 5, 'red'),
// ];
const cars = generateCars(1000, road, Car, ctx, 'AI');
let bestCar = cars[0];
const brain = localStorage.getItem('bestBrain');
if (brain) {
    cars.forEach((car, i) => {
        car.brain = JSON.parse(brain);
        if (i !== 0) {
            car.mutationRatio = getRandomNumber(0, 100);
            NeuralNetwork.mutate(car.brain, car.mutationRatio);
        }
    })
    bestCar.brain = JSON.parse(brain);
}

function main(time) {
    // car
    traffics.forEach((traffic) => {
        traffic.update(road.borders, cars);
    })


    // const undamagedCar =  cars.filter(c => !c.damaged);
    // bestCar = undamagedCar.find(c => c.y == Math.min(
    //     ...undamagedCar.map(c => c.y)
    // ));
    bestCar = cars.find(c => c.y == Math.min(
        ...cars.map(c => c.y)
    )) ?? cars[0];
    p.innerHTML = `<pre>
    Speed: ${bestCar.speed}
    Max Speed: ${bestCar.maxSpeed}
    Angle: ${bestCar.angle}
    Friction: ${bestCar.friction}</pre>`

    // const myCar = cars.find(c => c.controllerType == 'KEYBOARD');

    if (bestCar.damaged && timeDamage === 0) {
        timeDamage = time / 1000;
    } else if (bestCar.damaged && timeDamage > 0) {
        if (time / 1000 - timeDamage > 10) {
            save();
            location.reload();
        }
    } else {
        timeDamage = 0;
    }

    if (time / (1000 * 60) > 5) {
        save();
        location.reload();
    }

    ctx.clearRect(0, 0, innerWidth, innerHeight);
    vCtx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.save();
    ctx.translate(0, -bestCar.y + canvas.height * 0.7)

    // road
    road.draw();
    traffics.forEach((traffic) => {
        traffic.draw();
    })

    ctx.globalAlpha = 0.3;
    cars.forEach((car) => {
        if (!car.damaged) {
            car.update(road.borders, traffics);
            car.draw();
        }
    })
    ctx.globalAlpha = 1;
    bestCar.draw(true);
    // myCar.draw();


    if (bestCar.brain) {
        vCtx.lineDashOffset = -time / 50;
        Visualizer.drawNetwork(vCtx, bestCar.brain)
    }
    ctx.restore();

    const damagedCars = cars.filter(c => c.damaged);

    ctx.fillStyle = 'White';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Cars: ${cars.length} - Damaged: ${damagedCars.length} Health: ${cars.length - damagedCars.length} - time: ${Math.floor(time / (1000 * 60))}min : ${Math.floor(time / 1000) % 60}s`, innerWidth * 0.8, 20);
    requestAnimationFrame(main);
}

function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain))
}

addEventListener('keydown', (e) => {
    console.log(e.code)
    if (e.code === 'Enter') {
        save();
    } else if (e.code === 'Delete') {
        localStorage.removeItem('bestBrain')
    }
})
requestAnimationFrame(main);