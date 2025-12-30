import Layer from "./layer.js";
import NeuralNetwork from "./neural.js";

class RegressionNetwork extends NeuralNetwork {
    constructor(inputSize, hiddenLayers, outputSize) {
        super();
        this.setLearningRate(0.01);
        
        // Input to first hidden layer
        this.addLayer(new Layer(inputSize, hiddenLayers[0], 'relu'));
        
        // Additional hidden layers
        for (let i = 1; i < hiddenLayers.length; i++) {
            this.addLayer(new Layer(hiddenLayers[i-1], hiddenLayers[i], 'relu'));
        }
        
        // Output layer (linear activation for regression)
        this.addLayer(new Layer(hiddenLayers[hiddenLayers.length - 1], outputSize, 'linear'));
    }
}
