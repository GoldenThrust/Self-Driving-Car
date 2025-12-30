import { polysIntersect } from "../utils.js";
import Level from "./brain/level.js";
import NeuralNetwork from "./brain/neuralnetwork.js";
import Controller from "./controller/controller.js";
import Sensor from "./sensor/sensor.js";

export default class Car {
    constructor(ctx, x, y, width, height, maxSpeed = 20, color = 'red', controllerType = 'KEYBOARD') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.ctx = ctx;
        this.angle = 0;
        this.speed = 0;
        this.acceleration = 5;
        this.friction = 0.05;
        this.maxSpeed = maxSpeed;
        this.damaged = false;
        this.mutationRatio = 100;
        this.polygon = this.#getVertices();
        this.controllerType = controllerType;
        this.controller = new Controller(controllerType);
        if (controllerType !== 'DUMMY') {
            this.sensor = new Sensor(ctx, this);
            this.brain = new NeuralNetwork([this.sensor.rayCount, 20, 24, 14, 31, 24, 4])
        }
    }

    draw(drawSensor = false) {
        this.#drawVertices();
        if (this.sensor && drawSensor)
            this.sensor.draw();


        this.ctx.beginPath();
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = 'red';
        this.ctx.strokeStyle = 'red';
        this.ctx.font = "16px Arial";
        this.ctx.fillText(this.mutationRatio, this.x, this.y)
        this.ctx.strokeText(this.mutationRatio, this.x, this.y)
    }

    update(roadBorders, traffics) {
        if (this.sensor) {
            this.sensor.update(roadBorders, traffics);
            const offsets = this.sensor.readings.map(
                s => s == null ? 0 : 1 - s.offset
            );
            
            let outputs = new Array(4).fill(0);
            
            if (this.controllerType === 'KEYBOARD') {
                // NeuralNetwork.backpropagate(this.brain, offsets, [this.controller.forward, this.controller.left, this.controller.right, this.controller.backward], 0.1);
            } else {
                outputs = NeuralNetwork.feedForward(offsets, this.brain, Level.hyperPlane);
            }
            
            if (!this.damaged) {
                // this.controllerUpdate();
                this.AIUpdate(outputs);
                this.polygon = this.#getVertices();
                this.damaged = this.#checkDamage(roadBorders, traffics);
            }



            if (this.controllerType === 'AI') {
                this.controller.forward = outputs[0];
                this.controller.left = outputs[1];
                this.controller.right = outputs[2];
                this.controller.backward = outputs[3];
            }
        }
    }

    AIUpdate(outputs) {
        this.speed += outputs[0] * this.acceleration;
        this.maxSpeed = Math.abs(outputs[1] * 10);
        this.angle += (outputs[2] * Math.PI/90) * (this.speed > 0 ? 1 : -1);
        this.friction = Math.abs(outputs[3]) * this.acceleration/2;


        
        if (this.friction > this.acceleration/2) this.friction = this.acceleration/2;
        
        
        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;

        if (this.speed < -this.maxSpeed / 2) this.speed = -this.maxSpeed / 2;

        if (this.speed > 0) this.speed -= this.friction;

        if (this.speed < 0) this.speed += this.friction;

        if (Math.abs(this.speed) < this.friction) this.speed = 0;


        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;

    }


    controllerUpdate() {
        if (this.controller.forward) this.speed += this.acceleration;

        if (this.controller.backward) this.speed -= this.acceleration;

        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;

        if (this.speed < -this.maxSpeed / 2) this.speed = -this.maxSpeed / 2;

        if (this.speed > 0) this.speed -= this.friction;

        if (this.speed < 0) this.speed += this.friction;

        if (Math.abs(this.speed) < this.friction) this.speed = 0;

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controller.left) this.angle += 0.03 * flip;

            if (this.controller.right) this.angle -= 0.03 * flip;
        }


        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;

    }

    #checkDamage(roadBorders, traffics) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }

        for (let i = 0; i < traffics.length; i++) {
            if (polysIntersect(this.polygon, traffics[i].polygon)) {
                return true;
            }
        }

        return false;
    }

    #getVertices() {
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);

        const vertices = [
            {
                x: this.x - Math.sin(this.angle - alpha) * rad,
                y: this.y - Math.cos(this.angle - alpha) * rad
            }, // Top-left
            {
                x: this.x - Math.sin(this.angle + alpha) * rad,
                y: this.y - Math.cos(this.angle + alpha) * rad
            },  // Top-right
            {
                x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
                y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
            },   // Bottom-left
            {
                x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
                y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
            },  // Bottom-right
        ];

        return vertices;
    }


    #drawVertices() {
        const vertices = this.#getVertices();

        this.ctx.save();
        if (this.damaged) {
            this.ctx.fillStyle = 'grey';
        } else {
            this.ctx.fillStyle = this.color;
        }
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(vertices[0].x, vertices[0].y);

        vertices.forEach((vertex, i) => {
            if (i) {
                this.ctx.lineTo(vertex.x, vertex.y);
            }
        });

        this.ctx.lineTo(vertices[0].x, vertices[0].y);
        this.ctx.fill();

        this.ctx.restore();
    }

}