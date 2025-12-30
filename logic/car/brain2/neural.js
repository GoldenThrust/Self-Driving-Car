import Matrix from "./matrix.js";

export default class NeuralNetwork {
    constructor() {
        this.layers = [];
        this.learningRate = 0.1;
    }

    addLayer(layer) {
        this.layers.push(layer);
        return this;
    }

    setLearningRate(rate) {
        this.learningRate = rate;
        return this;
    }

    predict(inputArray) {
        let input = Matrix.fromArray(inputArray);
        for (let layer of this.layers) {
            input = layer.forward(input);
        }

        
        return input.toArray();
    }

    train(inputArray, targetArray) {
        // Forward pass
        let output = this.predict(inputArray);
        
        // Calculate output error
        const outputMatrix = Matrix.fromArray(output);
        const targetMatrix = Matrix.fromArray(targetArray);
        let error = Matrix.subtract(outputMatrix, targetMatrix);

        // Backward pass
        for (let i = this.layers.length - 1; i >= 0; i--) {
            error = this.layers[i].backward(error, this.learningRate);
        }

        return output;
    }

    calculateLoss(predictions, targets) {
        let loss = 0;
        for (let i = 0; i < predictions.length; i++) {
            loss += Math.pow(predictions[i] - targets[i], 2);
        }
        return loss / predictions.length;
    }

    fit(trainingData, epochs, verbose = true) {
        const losses = [];
        
        for (let epoch = 0; epoch < epochs; epoch++) {
            let totalLoss = 0;
            
            for (let example of trainingData) {
                const { input, target } = example;
                const prediction = this.train(input, target);
                totalLoss += this.calculateLoss(prediction, target);
            }

            
            const avgLoss = totalLoss / trainingData.length;
            losses.push(avgLoss);
            
            if (verbose && epoch) {
                console.log(`Epoch ${epoch}, Loss: ${avgLoss.toFixed(6)}`);
            }
        }
        
        return losses;
    }

    summary() {
        console.log('Neural Network Summary:');
        console.log(`Learning Rate: ${this.learningRate}`);
        console.log(`Number of Layers: ${this.layers.length}`);
        this.layers.forEach((layer, index) => {
            console.log(`Layer ${index}: ${layer.weights.rows}x${layer.weights.cols} (${layer.activation})`);
        });
    }
}