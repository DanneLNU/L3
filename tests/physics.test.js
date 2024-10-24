// tests/physics.test.js

import { Vector2D } from '../js/physics/Vector2D.js'
import { Circle, Rectangle, Polygon } from '../js/physics/Shape.js'
import { RigidBody } from '../js/physics/RigidBody.js'
import { PhysicsWorld } from '../js/physics/PhysicsWorld.js'

test('Vector addition', () => {
    const v1 = new Vector2D(1, 2)
    const v2 = new Vector2D(3, 4)
    const result = v1.add(v2)
    expect(result.x).toBe(4)
    expect(result.y).toBe(6)
})

test('Circle contains point', () => {
    const circle = new Circle(10)
    const position = new Vector2D(0, 0)
    const insidePoint = new Vector2D(5, 5)
    const outsidePoint = new Vector2D(15, 15)

    expect(circle.containsPoint(insidePoint, position)).toBe(true)
    expect(circle.containsPoint(outsidePoint, position)).toBe(false)
})

test('Vector subtraction', () => {
    const v1 = new Vector2D(5, 7)
    const v2 = new Vector2D(2, 3)
    const result = v1.subtract(v2)
    expect(result.x).toBe(3)
    expect(result.y).toBe(4)
})

test('Vector magnitude', () => {
    const v = new Vector2D(3, 4)
    const magnitude = v.magnitude()
    expect(magnitude).toBe(5)
})

test('Vector normalization', () => {
    const v = new Vector2D(3, 4)
    const normalized = v.normalize()
    expect(normalized.x).toBeCloseTo(0.6)
    expect(normalized.y).toBeCloseTo(0.8)
})

test('Rectangle contains point', () => {
    const rectangle = new Rectangle(20, 10)
    const position = new Vector2D(0, 0)
    const insidePoint = new Vector2D(5, 0)
    const outsidePoint = new Vector2D(15, 0)

    expect(rectangle.containsPoint(insidePoint, position)).toBe(true)
    expect(rectangle.containsPoint(outsidePoint, position)).toBe(false)
})

test('Polygon contains point', () => {
    const vertices = [
        new Vector2D(-5, -5),
        new Vector2D(5, -5),
        new Vector2D(5, 5),
        new Vector2D(-5, 5),
    ]
    const polygon = new Polygon(vertices)
    const position = new Vector2D(0, 0)
    const insidePoint = new Vector2D(0, 0)
    const outsidePoint = new Vector2D(10, 10)

    expect(polygon.containsPoint(insidePoint, position)).toBe(true)
    expect(polygon.containsPoint(outsidePoint, position)).toBe(false)
})

test('RigidBody integration updates position and velocity', () => {
    const body = new RigidBody({
        position: new Vector2D(0, 0),
        velocity: new Vector2D(1, 0),
        mass: 1,
        shape: new Circle(5),
    })
    body.applyForce(new Vector2D(1, 0)) // Apply force to change acceleration
    body.integrate(1) // Integrate over 1 second

    expect(body.velocity.x).toBe(2) // Velocity should have increased
    expect(body.position.x).toBe(2) // Position should be updated accordingly
})

test('PhysicsWorld step updates body positions', () => {
    const world = new PhysicsWorld()
    const body = new RigidBody({
        position: new Vector2D(0, 0),
        velocity: new Vector2D(1, 0),
        mass: 1,
        shape: new Circle(5),
    })
    world.addBody(body)
    world.step(1) // Step the world by 1 second

    expect(body.position.x).toBe(1)
    expect(body.position.y).toBeCloseTo(9.8)
})

test('Collision between two circles', () => {
    const world = new PhysicsWorld()

    const circleBodyA = new RigidBody({
        position: new Vector2D(0, 0),
        mass: 1,
        shape: new Circle(10),
        velocity: new Vector2D(1, 0),
        restitution: 1,
    })

    const circleBodyB = new RigidBody({
        position: new Vector2D(15, 0),
        mass: 1,
        shape: new Circle(10),
        velocity: new Vector2D(-1, 0),
        restitution: 1,
    })

    world.addBody(circleBodyA)
    world.addBody(circleBodyB)

    // Step the world to cause collision
    world.step(1) // Adjust deltaTime as needed

    // After collision, velocities should be swapped
    expect(circleBodyA.velocity.x).toBe(-1)
    expect(circleBodyB.velocity.x).toBe(1)
})

test('RigidBody emits collision event', () => {
    const world = new PhysicsWorld()

    const circleBodyA = new RigidBody({
        position: new Vector2D(0, 0),
        mass: 1,
        shape: new Circle(10),
        velocity: new Vector2D(1, 0),
    })

    const circleBodyB = new RigidBody({
        position: new Vector2D(15, 0),
        mass: 1,
        shape: new Circle(10),
        velocity: new Vector2D(-1, 0),
    })

    let collisionOccurred = false
    circleBodyA.on('collision', (event) => {
        collisionOccurred = true
        expect(event.other).toBe(circleBodyB)
    })

    world.addBody(circleBodyA)
    world.addBody(circleBodyB)

    world.step(1)

    expect(collisionOccurred).toBe(true)
})
