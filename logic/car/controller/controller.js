export default class Controller {
    constructor(type) {
        this.forward, this.backward, this.left, this.right = false;
        if (type === 'KEYBOARD') this.#addKeyboardEventListener()
        else if (type === 'DUMMY') this.forward = true;
        // else if (type === 'AI') this.backward = true;
    }

    #addKeyboardEventListener() {
        addEventListener("keydown", (e) => {
            switch (e.key) {
                case "ArrowUp":
                    this.forward = 1;
                    break;
                case "ArrowDown":
                    this.backward = 1;
                    break;
                case "ArrowLeft":
                    this.left = 1;
                    break;
                case "ArrowRight":
                    this.right = 1;
                    break;
            }
        })

        addEventListener("keyup", (e) => {
            switch (e.key) {
                case "ArrowUp":
                    this.forward = 0;
                    break;
                case "ArrowDown":
                    this.backward = 0;
                    break;
                case "ArrowLeft":
                    this.left = 0;
                    break;
                case "ArrowRight":
                    this.right = 0;
                    break;
            }
        })
    }
}