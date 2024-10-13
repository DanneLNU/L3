// platformer.js

import { Vector2D } from './physics/Vector2D.js'
import { RigidBody } from './physics/RigidBody.js'
import { Rectangle } from './physics/Shape.js'
import { PhysicsWorld } from './physics/PhysicsWorld.js'

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas')
    const ctx = canvas.getContext('2d');

    // Create the physics world
    const physicsWorld = new PhysicsWorld()
    physicsWorld.gravity = new Vector2D(0, 20)
    
    // Create the player character
    const player = new RigidBody({
        position: new Vector2D(100, 100),
        velocity: new Vector2D(0, 0),
        mass: 1,
        shape: new Rectangle(20, 20),
        restitution: 0.2
    })
    physicsWorld.addBody(player);

    // Create static platforms
    const ground = new RigidBody({
        position: new Vector2D(400, 550),
        shape: new Rectangle(800, 20),
        isStatic: true
    })
    physicsWorld.addBody(ground);

    const platform = new RigidBody({
        position: new Vector2D(300, 400),
        shape: new Rectangle(200, 20),
        isStatic: true
    })
    physicsWorld.addBody(platform);

    // Handle input
    const keys = {}
    document.addEventListener('keydown', (event) => {
        keys[event.key] = true
    })
    document.addEventListener('keyup', (event) => {
        keys[event.key] = false
    })

    // Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Handle player input
    if (keys['ArrowLeft']) {
        player.velocity = player.velocity.add(new Vector2D(-4.5, 0))
    }
    if (keys['ArrowRight']) {
        player.velocity = player.velocity.add(new Vector2D(4.5, 0))
    }
    if ((keys['ArrowUp'] || keys[' ']) && player.velocity.y === 0) { // Allow jump only if player is not falling
        player.velocity = player.velocity.add(new Vector2D(0, -65)) // Adjust -25 to change jump height
    }

    // Apply friction to slow down horizontal movement
    const friction = 0.91; // Adjust this value between 0 (no friction) to 1 (high friction)
    player.velocity.x *= friction

    // Step physics world
    physicsWorld.step(1 / 60);

    // Collision Detection
    [ground, platform].forEach((body) => {
        if (player.position.y + player.shape.height / 2 > body.position.y - body.shape.height / 2 &&
            player.position.y - player.shape.height / 2 < body.position.y + body.shape.height / 2 &&
            player.position.x + player.shape.width / 2 > body.position.x - body.shape.width / 2 &&
            player.position.x - player.shape.width / 2 < body.position.x + body.shape.width / 2) {
            
            // Resolve collision by placing the player on top of the platform
            player.position.y = body.position.y - body.shape.height / 2 - player.shape.height / 2
            
            // Stop downward velocity
            if (player.velocity.y > 0) {
                player.velocity.y = 0
            }
        }
    })

    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(
        player.position.x - player.shape.width / 2,
        player.position.y - player.shape.height / 2,
        player.shape.width,
        player.shape.height
    )

    // Draw platforms
    ctx.fillStyle = 'green';
    [ground, platform].forEach((body) => {
        ctx.fillRect(
            body.position.x - body.shape.width / 2,
            body.position.y - body.shape.height / 2,
            body.shape.width,
            body.shape.height
        )
    })

    // Request next frame
    requestAnimationFrame(gameLoop)
}

// Start game loop
gameLoop()
})