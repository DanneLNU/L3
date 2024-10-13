// physics/Shape.js
export class Shape {
    constructor(type) {
        this.type = type;
    }
}

export class Rectangle extends Shape {
    constructor(width, height) {
        super('rectangle');
        this.width = width;
        this.height = height;
    }
}
