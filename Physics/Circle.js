// physics/Circle.js

const Shape = require('./Shape')
const Vector2D = require('./Vector2D')

class Circle extends Shape {
    constructor(radius) {
        super('circle')
        this.radius = radius
    }

    containsPoint(point, position) {
        const distance = point.subtract(position).magnitude()
        return distance <= this.radius
    }
}

module.exports = Circle
