export default class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = Array(rows).fill().map(() => Array(cols).fill(0));
    }

    static fromArray(arr) {
        return new Matrix(arr.length, 1).map((_, i) => arr[i]);
    }

    static multiply(a, b) {
        if (a.cols !== b.rows) {
            throw new Error('Columns of A must match rows of B');
        }
        return new Matrix(a.rows, b.cols)
            .map((_, i, j) => {
                let sum = 0;
                for (let k = 0; k < a.cols; k++) {
                    sum += a.data[i][k] * b.data[k][j];
                }
                return sum;
            });
    }

    static subtract(a, b) {
        return new Matrix(a.rows, a.cols)
            .map((_, i, j) => a.data[i][j] - b.data[i][j]);
    }

    static transpose(matrix) {
        return new Matrix(matrix.cols, matrix.rows)
            .map((_, i, j) => matrix.data[j][i]);
    }

    randomize() {
        return this.map(() => Math.random() * 2 - 1);
    }

    map(func) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = func(this.data[i][j], i, j);
            }
        }
        return this;
    }

    static map(matrix, func) {
        return new Matrix(matrix.rows, matrix.cols)
            .map((_, i, j) => func(matrix.data[i][j], i, j));
    }

    add(other) {
        if (other instanceof Matrix) {
            if (this.rows !== other.rows || this.cols !== other.cols) {
                throw new Error('Matrix dimensions must match for addition');
            }
            return this.map((val, i, j) => val + other.data[i][j]);
        } else {
            return this.map(val => val + other);
        }
    }

    multiply(other) {
        if (other instanceof Matrix) {
            if (this.rows !== other.rows || this.cols !== other.cols) {
                throw new Error('Matrix dimensions must match for element-wise multiplication');
            }
            return this.map((val, i, j) => val * other.data[i][j]);
        } else {
            return this.map(val => val * other);
        }
    }

    toArray() {
        let arr = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                arr.push(this.data[i][j]);
            }
        }
        return arr;
    }

    print() {
        console.table(this.data);
        return this;
    }
}