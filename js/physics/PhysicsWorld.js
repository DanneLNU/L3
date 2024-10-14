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

    step(deltaTime) {
        console.log('PhysicsWorld step method is called');
        
        // Apply gravity and integrate the forces
        this.bodies.forEach((body) => {
            if (!body.isStatic) {
                const gravityForce = this.gravity.multiply(body.mass);
                body.applyForce(gravityForce);
            }
        });

        // Update the position and velocity
        this.bodies.forEach((body) => {
            body.integrate(deltaTime);
        });
    }
}
