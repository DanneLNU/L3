// physics/PhysicsWorld.js
import { Vector2D } from './Vector2D.js';

export class PhysicsWorld {
    constructor() {
        this.bodies = [];
        this.gravity = new Vector2D(0, 9.8);
    }

    addBody(body) {
        this.bodies.push(body);
    }

    removeBody(body) {
        this.bodies = this.bodies.filter((b) => b !== body);
    }

    step(deltaTime) {
        // Apply gravity
        this.bodies.forEach((body) => {
            if (!body.isStatic) {
                const gravityForce = this.gravity.multiply(body.mass);
                body.applyForce(gravityForce);
            }
        });

        // Integrate motion
        this.bodies.forEach((body) => {
            body.integrate(deltaTime);
        });

        // Handle collisions
        this.handleCollisions();
    }

    handleCollisions() {
        const pairs = this.getPotentialCollisions();

        pairs.forEach(([bodyA, bodyB]) => {
            const collision = this.checkCollision(bodyA, bodyB);
            if (collision) {
                this.resolveCollision(bodyA, bodyB, collision);
                bodyA.emit('collision', { other: bodyB });
                bodyB.emit('collision', { other: bodyA });
            }
        });
    }

    getPotentialCollisions() {
        const pairs = [];
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                pairs.push([this.bodies[i], this.bodies[j]]);
            }
        }
        return pairs;
    }

    checkCollision(bodyA, bodyB) {
        const typeA = bodyA.shape.type;
        const typeB = bodyB.shape.type;

        if (typeA === 'circle' && typeB === 'circle') {
            return this.circleCircleCollision(bodyA, bodyB);
        }
        if (typeA === 'rectangle' && typeB === 'rectangle') {
            return this.rectangleRectangleCollision(bodyA, bodyB);
        }
        return null;
    }

    circleCircleCollision(bodyA, bodyB) {
        const diff = bodyB.position.subtract(bodyA.position)
        const distance = diff.magnitude()
        const radiusSum = bodyA.shape.radius + bodyB.shape.radius

        if (distance < radiusSum) {
            const normal = diff.normalize()
            const penetration = radiusSum - distance
            return { normal, penetration }
        }
        return null
    }

    rectangleRectangleCollision(bodyA, bodyB) {
        const ax = bodyA.position.x - bodyA.shape.width / 2;
        const ay = bodyA.position.y - bodyA.shape.height / 2;
        const aWidth = bodyA.shape.width;
        const aHeight = bodyA.shape.height;

        const bx = bodyB.position.x - bodyB.shape.width / 2;
        const by = bodyB.position.y - bodyB.shape.height / 2;
        const bWidth = bodyB.shape.width;
        const bHeight = bodyB.shape.height;

        if (
            ax < bx + bWidth &&
            ax + aWidth > bx &&
            ay < by + bHeight &&
            ay + aHeight > by
        ) {
            const overlapX = Math.min(ax + aWidth - bx, bx + bWidth - ax);
            const overlapY = Math.min(ay + aHeight - by, by + bHeight - ay);

            if (overlapX < overlapY) {
                const normal = new Vector2D(
                    ax + aWidth / 2 < bx + bWidth / 2 ? -1 : 1,
                    0
                );
                return { normal, penetration: overlapX };
            } else {
                const normal = new Vector2D(
                    0,
                    ay + aHeight / 2 < by + bHeight / 2 ? -1 : 1
                );
                return { normal, penetration: overlapY };
            }
        }
        return null;
    }

    resolveCollision(bodyA, bodyB, collision) {
        const { normal, penetration } = collision;
        const totalInvMass = bodyA.invMass + bodyB.invMass;
        if (totalInvMass === 0) return;

        const moveA = normal.multiply(-penetration * (bodyA.invMass / totalInvMass));
        const moveB = normal.multiply(penetration * (bodyB.invMass / totalInvMass));

        if (!bodyA.isStatic) {
            bodyA.position = bodyA.position.add(moveA);
        }
        if (!bodyB.isStatic) {
            bodyB.position = bodyB.position.add(moveB);
        }

        const relativeVelocity = bodyB.velocity.subtract(bodyA.velocity);
        const velocityAlongNormal = relativeVelocity.dot(normal);

        if (velocityAlongNormal > 0) return;

        const restitution = Math.min(bodyA.restitution, bodyB.restitution);

        const impulseMagnitude = -(1 + restitution) * velocityAlongNormal / totalInvMass;

        const impulse = normal.multiply(impulseMagnitude);

        if (!bodyA.isStatic) bodyA.velocity = bodyA.velocity.subtract(impulse.multiply(bodyA.invMass));
        if (!bodyB.isStatic) bodyB.velocity = bodyB.velocity.add(impulse.multiply(bodyB.invMass));
    }
}