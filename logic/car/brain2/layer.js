import Matrix from "./matrix.js";

export default class Layer {
    constructor(inputSize, outputSize, activation = 'sigmoid') {
        this.weights = new Matrix(outputSize, inputSize).randomize();
        this.bias = new Matrix(outputSize, 1).randomize();
        this.activation = activation;
        this.input = null;
        this.output = null;
        this.error = null;
    }

    static activate(x, activation) {
        switch (activation) {
            case 'sigmoid':
                return Matrix.map(x, val => 1 / (1 + Math.exp(-val)));
            case 'relu':
                return Matrix.map(x, val => Math.max(0, val));
            case 'tanh':
                return Matrix.map(x, val => Math.tanh(val));
            case 'softmax':
                const expValues = Matrix.map(x, val => Math.exp(val));
                const sum = expValues.toArray().reduce((a, b) => a + b, 0);
                return Matrix.map(expValues, val => val / sum);
            case 'linear':
                return Matrix.map(x, val => { if (val > 0) return 1; else return 0 })
            default:
                return x;
        }
    }

    static activateDerivative(x, activation) {
        switch (activation) {
            case 'sigmoid':
                return Matrix.map(x, val => val * (1 - val));
            case 'relu':
                return Matrix.map(x, val => val > 0 ? 1 : 0);
            case 'tanh':
                return Matrix.map(x, val => 1 - val * val);
            case 'linear':
            default:
                return new Matrix(x.rows, x.cols).map(() => 1);
        }
    }

    forward(input) {
        this.input = input;
        const weightedSum = Matrix.multiply(this.weights, input).add(this.bias);
        this.output = Layer.activate(weightedSum, this.activation);
        return this.output;
    }

    backward(error, learningRate) {
        let gradient;

        if (this.activation === 'softmax') {
            gradient = error;
        } else {
            const activationDerivative = Layer.activateDerivative(this.output, this.activation);
            gradient = error.multiply(activationDerivative);
        }

        const weightGradients = Matrix.multiply(gradient, Matrix.transpose(this.input));
        const inputError = Matrix.multiply(Matrix.transpose(this.weights), gradient);

        // weightGradients and gradient are Matrix instances; use instance multiply for scalar
        this.weights = this.weights.add(weightGradients.multiply(-learningRate));
        this.bias = this.bias.add(gradient.multiply(-learningRate));

        this.error = inputError;
        return inputError;
    }
}
