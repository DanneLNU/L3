// physics/PhysicsWorld.js
import { Vector2D } from './Vector2D.js';
import { RigidBody } from './RigidBody.js';

export class PhysicsWorld {
    constructor() {
        this.bodies = [];
        this.gravity = new Vector2D(0, 9.8);
    }

    addBody(body) {
        this.bodies.push(body);
    }

    step(deltaTime) {
        this.bodies.forEach((body) => {
            if (!body.isStatic) {
                const gravityForce = this.gravity.multiply(body.mass);
                body.applyForce(gravityForce);
            }
        });

        this.bodies.forEach((body) => {
            body.integrate(deltaTime);
        });
    }
}
