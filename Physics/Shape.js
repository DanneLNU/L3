// physics/Shape.js

class Shape {
    /**
     * Creates a new Shape.
     * @param {string} type - The type of the shape (e.g., 'circle', 'rectangle', 'polygon').
     */
    constructor(type) {
        this.type = type
    }

    /**
     * Checks if a point is inside the shape.
     * This method should be overridden by subclasses.
     * @param {Vector2D} point - The point to check.
     * @param {Vector2D} position - The position of the shape.
     * @param {number} [angle=0] - The rotation angle of the shape in radians.
     * @returns {boolean} True if the point is inside the shape.
     */
    containsPoint(point, position, angle = 0) {
        throw new Error('containsPoint() must be implemented by subclasses')
    }
}

module.exports = Shape
