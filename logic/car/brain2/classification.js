import Layer from "./layer.js";
import NeuralNetwork from "./neural.js";

export default class ClassificationNetwork extends NeuralNetwork {
    constructor(inputSize, hiddenLayers, numClasses) {
        super();
        this.setLearningRate(0.1);
        
        // Input to first hidden layer
        this.addLayer(new Layer(inputSize, hiddenLayers[0], 'sigmoid'));
        
        // Additional hidden layers
        for (let i = 1; i < hiddenLayers.length; i++) {
            this.addLayer(new Layer(hiddenLayers[i-1], hiddenLayers[i], 'sigmoid'));
        }
        
        // Output layer (softmax for classification)
        this.addLayer(new Layer(hiddenLayers[hiddenLayers.length - 1], numClasses, 'linear'));
    }

    predictClass(inputArray) {
        const probabilities = this.predict(inputArray);
        const maxIndex = probabilities.indexOf(Math.max(...probabilities));
        return { class: maxIndex, probabilities };
    }
}
