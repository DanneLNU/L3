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
    physicsWorld.gravity = new Vector2D(0, 40) // Increased gravity to make the player fall faster
    
    // Create the player character and start on the first platform
    const player = new RigidBody({
        position: new Vector2D(150, 380), // Start on the first platform
        velocity: new Vector2D(0, 0),
        mass: 1,
        shape: new Rectangle(20, 20),
        restitution: 0.2
    })
    physicsWorld.addBody(player);

    // Create initial platforms
    const platforms = [
        new RigidBody({
            position: new Vector2D(400, 400),
            shape: new Rectangle(800, 20),
            isStatic: true
        }),
        new RigidBody({
            position: new Vector2D(1200, 300),
            shape: new Rectangle(200, 20),
            isStatic: true
        }),
    ];
    platforms.forEach(platform => physicsWorld.addBody(platform));

    // Create an array to keep track of new platforms
    let nextPlatformX = 1600; // Starting X position for the next platform

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
            player.velocity = player.velocity.add(new Vector2D(0, -65))
        }

        // Apply friction to slow down horizontal movement
        const friction = 0.91
        player.velocity.x *= friction

        // Step physics world
        physicsWorld.step(1 / 60)

        // Move platforms to the left to create a scrolling effect
        const scrollSpeed = 1; // Scroll speed remains slow
        platforms.forEach(platform => {
            platform.position = platform.position.add(new Vector2D(-scrollSpeed, 0))
        })

        // Remove platforms that are out of view and add new ones
        if (platforms[0].position.x + platforms[0].shape.width / 2 < 0) {
            platforms.shift(); // Remove the first platform if it goes off-screen
        }

        // Add new platforms at the right edge as needed
        if (platforms.length < 5) { // Keep a constant number of platforms
            const newPlatformWidth = 200 + Math.random() * 300; // Random width between 200 and 500
            const newPlatformHeight = 20;
            const newPlatformY = 300 + Math.random() * 200; // Random Y position between 300 and 500

            const newPlatform = new RigidBody({
                position: new Vector2D(nextPlatformX, newPlatformY),
                shape: new Rectangle(newPlatformWidth, newPlatformHeight),
                isStatic: true
            });

            platforms.push(newPlatform);
            physicsWorld.addBody(newPlatform);

            nextPlatformX += newPlatformWidth + 200; // Adjust the next platform's X position
        }

        // Game over condition: if the player falls off the screen
        if (player.position.y > canvas.height) {
            console.log('Game Over')
            return // Stop the game loop
        }

        // Collision Detection for platforms
        platforms.forEach((body) => {
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
        ctx.fillStyle = 'blue'
        ctx.fillRect(
            player.position.x - player.shape.width / 2,
            player.position.y - player.shape.height / 2,
            player.shape.width,
            player.shape.height
        )

        // Draw platforms
        ctx.fillStyle = 'green'
        platforms.forEach((body) => {
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
