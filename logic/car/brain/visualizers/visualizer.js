import { getRGBA, lerp } from "../../../utils.js";

export default class Visualizer {
    static drawNetwork(ctx, network) {
        const margin = 20;
        const top = margin;
        const left = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;

        const levelHeight = height / network.levels.length;

        for (let i = network.levels.length - 1; i >= 0; i--) {
            const levelTop = top + lerp(height - levelHeight, 0, network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1))

            ctx.setLineDash([7, 3]);
            Visualizer.drawLevel(ctx, network.levels[i], left, levelTop, width, levelHeight, i == network.levels.length - 1 ? ['S', 'A', 'F', 'MS'] : [])
        }

    }

    static drawLevel(ctx, level, left, top, width, height, outputsLabel) {
        const right = left + width;
        const bottom = top + height;

        const nodeRadius = 15;

        const { inputs, outputs, weights, biases } = level;

        // network chain
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom)
                ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top)
                ctx.lineWidth = 1;

                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }



        // input nodes
        for (let i = 0; i < inputs.length; i++) {
            const x = Visualizer.#getNodeX(inputs, i, left, right);

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
        }

        // outputs nodes
        for (let i = 0; i < outputs.length; i++) {
            const x = Visualizer.#getNodeX(outputs, i, left, right);

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([2, 2]);
            ctx.stroke();
            ctx.setLineDash([]);

            if (outputsLabel[i]) {
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'white';
                ctx.font = `${nodeRadius * 1}px Arial`;
                ctx.fillText(outputsLabel[i], x, top)
                ctx.lineWidth = 2;
                ctx.strokeText(outputsLabel[i], x, top);
            }
        }

    }

    static #getNodeX(nodes, index, left, right) {
        return lerp(
            left,
            right,
            nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
        );
    }
}