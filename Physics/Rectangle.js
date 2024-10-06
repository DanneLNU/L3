// physics/Rectangle.js

const Shape = require('./Shape')
const Vector2D = require('./Vector2D')

class Rectangle extends Shape {
    constructor(width, height) {
        super('rectangle')
        this.width = width
        this.height = height
    }

    containsPoint(point, position, angle = 0) {
        const localPoint = point.subtract(position).rotate(-angle)
        const halfWidth = this.width / 2
        const halfHeight = this.height / 2

        return (
            localPoint.x >= -halfWidth &&
            localPoint.x <= halfWidth &&
            localPoint.y >= -halfHeight &&
            localPoint.y <= halfHeight
        );
    }
}

module.exports = Rectangle
