// physics/Shape.js
export class Shape {
    constructor(type) {
        this.type = type;
    }
}

export class Circle extends Shape {
    constructor(radius) {
        super('circle');
        this.radius = radius;
    }

    containsPoint(point, position) {
        const distance = point.subtract(position).magnitude();
        return distance <= this.radius;
    }
}

export class Rectangle extends Shape {
    constructor(width, height) {
        super('rectangle');
        this.width = width;
        this.height = height;
    }

    containsPoint(point, position, angle = 0) {
        const localPoint = point.subtract(position).rotate(-angle);
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        return (
            localPoint.x >= -halfWidth &&
            localPoint.x <= halfWidth &&
            localPoint.y >= -halfHeight &&
            localPoint.y <= halfHeight
        );
    }
}

export class Polygon extends Shape {
    constructor(vertices) {
        super('polygon');
        this.vertices = vertices;
        this.calculateCentroid();
    }

    calculateCentroid() {
        let centroid = new Vector2D(0, 0);
        this.vertices.forEach((vertex) => {
            centroid = centroid.add(vertex);
        });
        this.centroid = centroid.multiply(1 / this.vertices.length);
    }

    containsPoint(point, position, angle = 0) {
        const localPoint = point.subtract(position).rotate(-angle);
        let isInside = false;
        const n = this.vertices.length;

        for (let i = 0, j = n - 1; i < n; j = i++) {
            const xi = this.vertices[i].x;
            const yi = this.vertices[i].y;
            const xj = this.vertices[j].x;
            const yj = this.vertices[j].y;

            const intersect =
                (yi > localPoint.y) !== (yj > localPoint.y) &&
                localPoint.x < ((xj - xi) * (localPoint.y - yi)) / (yj - yi + 0.0001) + xi;
            if (intersect) isInside = !isInside;
        }

        return isInside;
    }
}
