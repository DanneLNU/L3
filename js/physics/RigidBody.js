// physics/RigidBody.js
import { Vector2D } from "./Vector2D.js";

export class RigidBody {
  constructor(options) {
    this.position = options.position || new Vector2D(0, 0);
    this.velocity = options.velocity || new Vector2D(0, 0);
    this.acceleration = new Vector2D(0, 0);
    this.mass = options.mass || 1;
    this.invMass = this.mass !== 0 ? 1 / this.mass : 0;
    this.force = new Vector2D(0, 0);
    this.shape = options.shape;
    this.restitution = options.restitution || 0.9;
    this.isStatic = options.isStatic || false;
    this.eventListeners = {};
  }

  applyForce(force) {
    this.force = this.force.add(force);
  }

  integrate(deltaTime) {
    if (this.isStatic) return;

    this.acceleration = this.force.multiply(this.invMass);
    this.velocity = this.velocity.add(this.acceleration.multiply(deltaTime));
    this.position = this.position.add(this.velocity.multiply(deltaTime));
    this.force = new Vector2D(0, 0);
  }

  on(eventName, callback) {
    if (!this.eventListeners[eventName]) this.eventListeners[eventName] = [];
    this.eventListeners[eventName].push(callback);
  }

  emit(eventType, data) {
    const listeners = this.eventListeners[eventType];
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }
}
