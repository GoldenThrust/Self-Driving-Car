
// Level class: Represents a single layer in the neural network
export default class Level {
    constructor(inputCount = 0, outputCount = 0, activation) {
        this.inputs = new Array(inputCount).fill(0);
        this.outputs = new Array(outputCount).fill(0);
        this.biases = new Array(outputCount).fill(0);
        this.weights = Array.from({ length: inputCount }, () => new Array(outputCount).fill(0));
        this.activation = activation;
        Level.#randomize(this);
    }

    // Randomizes weights and biases
    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    // Feedforward logic for a single layer
    static feedForward(givenInputs, level, activation) {
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        if (activation === 'softmax') {
            let exponentSum = 0;
            for (let i = 0; i < level.outputs.length; i++) {
                let sum = 0;
                for (let j = 0; j < level.inputs.length; j++) {
                    sum += level.inputs[j] * level.weights[j][i];
                }
                level.outputs[i] = sum + level.biases[i];
                exponentSum += Math.exp(level.outputs[i]);
            }


            for (let i = 0; i < level.outputs.length; i++) {
                level.outputs[i] = Level.activation(level.outputs[i], activation, exponentSum);
            }
        } else {
            for (let i = 0; i < level.outputs.length; i++) {
                let sum = 0;
                for (let j = 0; j < level.inputs.length; j++) {
                    sum += level.inputs[j] * level.weights[j][i];
                }
                level.outputs[i] = Level.activation(sum + level.biases[i], activation, level);
            }
        }

        return level.outputs;
    }

    static activation(x, activation, sum = null) {
        switch (activation) {
            case 'relu':
                return Math.max(0, x);
            case 'sigmoid':
                return 1 / (1 + Math.exp(-x));
            case 'tanh':
                return Math.tanh(x);
            case 'softmax':
                if (sum == null) throw new Error("Sum is needed");
                return x/sum;
            case 'linear':
                return x;
            default:
                if (x > 0) {
                    return 1;
                } else {
                    return 0;
                }
        }
    }

    // ReLU activation function
    static ReLU(x) {
        return Math.max(0, x);
    }

    static hyperPlane(x) {

    }
}
