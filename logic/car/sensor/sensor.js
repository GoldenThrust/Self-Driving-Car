import { getIntersection, lerp } from "../../utils.js";

export default class Sensor {
    constructor(ctx, object) {
        this.ctx = ctx;
        this.object = object;
        this.rayCount = 10;
        this.rayLength = innerWidth * 0.15;
        // this.raySpread = (Math.PI/180) * 150;
        this.raySpread = Math.PI/2;

        this.rays = [];
        this.readings = [];
    }

    draw() {
        for (let i = 0; i < this.rayCount; i++) {
            let end = this.rays[i][1];
            if (this.readings[i]) {
                end = this.readings[i];
            }

            this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = "yellow";

            this.ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = "red";

            this.ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.stroke();
        }
    }

    update(roadBorders, traffics) {
        this.#castRays();
        this.readings = [];
        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders, traffics)
            );
        }
    }

    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.object.angle;

            const start = {
                x: this.object.x,
                y: this.object.y
            };
            const end = {
                x: this.object.x - Math.sin(rayAngle) * this.rayLength,
                y: this.object.y - Math.cos(rayAngle) * this.rayLength
            }

            this.rays.push([start, end]);
        }
    }

    #getReading(ray, roadBorders, traffics) {
        let touches = [];

        for (let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1],
            );


            if (touch) {
                touches.push(touch);
            }
        }

        for (let i = 0; i < traffics.length; i++) {
            const polygon = traffics[i].polygon;


            for (let j = 0; j < polygon.length; j++) {
                const touch = getIntersection(
                    ray[0],
                    ray[1],
                    polygon[j],
                    polygon[(j+1)%polygon.length],
                );


                if (touch) {
                    touches.push(touch);
                }
            }

        }

        if (touches.length == 0) {
            return null;
        }
        else {
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets);

            return touches.find(e => e.offset == minOffset);
        }

    }
}