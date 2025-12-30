import { lerp } from "../../utils.js";
import Level from "./level.js";

export default class NeuralNetwork {
    constructor(neuronCounts) {
        if (neuronCounts.length < 2) {
            throw new Error("Neural network must have at least two layers (input and output).");
        }
        this.levels = [];

        for (let i = 0; i < neuronCounts.length - 2; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1], 'tanh'));
        }

        this.levels.push(new Level(neuronCounts[neuronCounts.length - 2], neuronCounts[neuronCounts.length - 1], 'tanh'));
    }

    // Feedforward logic for the entire network
    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(givenInputs, network.levels[0], network.levels[0].activation);
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i], network.levels[i].activation);
        }

        return outputs;
    }


    // Mutates the network to introduce variability
    static mutate(network, amount = 1) {
        network.levels.forEach(level => {
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
            }

            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(level.weights[i][j], Math.random() * 2 - 1, amount);
                }
            }
        });
    }

    // Cross-over mutation for genetic algorithms
    static crossOverMutate(network1, network2, amount = 1) {
        if (network1.levels.length !== network2.levels.length) {
            throw new Error("Networks must have the same structure for cross-over mutation.");
        }

        network1.levels.forEach((level1, index) => {
            const level2 = network2.levels[index];
            for (let i = 0; i < level1.biases.length; i++) {
                level1.biases[i] = lerp(level1.biases[i], level2.biases[i], amount);
            }

            for (let i = 0; i < level1.weights.length; i++) {
                for (let j = 0; j < level1.weights[i].length; j++) {
                    level1.weights[i][j] = lerp(level1.weights[i][j], level2.weights[i][j], amount);
                }
            }
        });
    }
}
