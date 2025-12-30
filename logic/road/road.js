import { lerp } from "../utils.js";

export default class Road {
    constructor(ctx, x, width, laneCount = 3) {
        this.ctx = ctx;
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width / 2;
        this.right = x + width / 2;

        const infinity = 1000000;

        this.top = -infinity;
        this.bottom = infinity;

        const topLeft = {x: this.left, y: this.top};
        const topRight = {x: this.right, y: this.top}
        const bottomLeft = {x: this.left, y: this.bottom}
        const bottomRight = {x: this.right, y: this.bottom}

        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ]
    }

    draw() {
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = "white";

        for (let i = 1; i < this.laneCount; i++) {
            this.ctx.setLineDash([20, 20]);
    
            const x = lerp(this.left, this.right, i / this.laneCount);
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.top);
            this.ctx.lineTo(x, this.bottom);
            this.ctx.stroke();
        }

        this.ctx.setLineDash([]);

        this.borders.forEach(border=> {
            this.ctx.beginPath();
            this.ctx.moveTo(border[0].x, border[0].y);
            this.ctx.lineTo(border[1].x, border[1].y);
            this.ctx.stroke();
        })
    }

    getLaneCenter(laneIndex) { 
        laneIndex = Math.min(laneIndex, this.laneCount) - 1;
        const laneWidth = this.width/this.laneCount;
        return this.left+laneWidth/2+laneIndex*laneWidth;
    }
}