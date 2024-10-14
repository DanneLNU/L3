// platformer.js

import { Vector2D } from './physics/Vector2D.js'
import { RigidBody } from './physics/RigidBody.js'
import { Rectangle } from './physics/Shape.js'
import { PhysicsWorld } from './physics/PhysicsWorld.js'

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas')
    const ctx = canvas.getContext('2d');

    // Create UI Elements
    const playButton = document.createElement('button')
    playButton.textContent = 'Play'
    playButton.style.position = 'absolute'
    playButton.style.top = '50%'
    playButton.style.left = '50%'
    playButton.style.transform = 'translate(-50%, -50%)'
    playButton.style.padding = '20px'
    playButton.style.fontSize = '20px'
    document.body.appendChild(playButton)

    const gameOverText = document.createElement('div')
    gameOverText.textContent = 'You Died!'
    gameOverText.style.position = 'absolute'
    gameOverText.style.top = '40%'
    gameOverText.style.left = '50%'
    gameOverText.style.transform = 'translate(-50%, -50%)'
    gameOverText.style.fontSize = '30px'
    gameOverText.style.color = 'red'
    gameOverText.style.display = 'none'
    document.body.appendChild(gameOverText)

    let gameState = 'waiting' // Possible states: waiting, playing, gameOver

    let physicsWorld, player, platforms, nextPlatformX

    function initializeGame() {
        // Create the physics world
        physicsWorld = new PhysicsWorld()
        physicsWorld.gravity = new Vector2D(0, 60) // Increased gravity to make the player fall faster

        // Create the player character and start on the first platform
        player = new RigidBody({
            position: new Vector2D(150, 380), // Start on the first platform
            velocity: new Vector2D(0, 0),
            mass: 1,
            shape: new Rectangle(20, 20),
            restitution: 0.2
        })
        physicsWorld.addBody(player)

        // Create initial platforms
        platforms = [
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
        ]
        platforms.forEach(platform => physicsWorld.addBody(platform))

        // Initialize the position for the next platform
        nextPlatformX = 1600
    }

    // Handle input
    const keys = {}
    document.addEventListener('keydown', (event) => {
        if (gameState === 'playing') {
            keys[event.key] = true
        }
    })
    document.addEventListener('keyup', (event) => {
        if (gameState === 'playing') {
            keys[event.key] = false
        }
    })

    // Game loop
    function gameLoop() {
        if (gameState !== 'playing') return

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
            player.velocity = player.velocity.add(new Vector2D(0, -85)) // Increased jump height
        }

        // Apply friction to slow down horizontal movement
        const friction = 0.91
        player.velocity.x *= friction

        // Step physics world
        physicsWorld.step(1 / 60)

        // Move platforms to the left to create a scrolling effect
        const scrollSpeed = 1
        platforms.forEach(platform => {
            platform.position = platform.position.add(new Vector2D(-scrollSpeed, 0))
        })

        // Remove platforms that are out of view and add new ones
        if (platforms[0].position.x + platforms[0].shape.width / 2 < 0) {
            platforms.shift()
        }

        // Add new platforms at the right edge as needed
        if (platforms.length < 5) {
            const newPlatformWidth = 200 + Math.random() * 300
            const newPlatformHeight = 20
            const newPlatformY = 300 + Math.random() * 200

            const newPlatform = new RigidBody({
                position: new Vector2D(nextPlatformX, newPlatformY),
                shape: new Rectangle(newPlatformWidth, newPlatformHeight),
                isStatic: true
            })

            platforms.push(newPlatform)
            physicsWorld.addBody(newPlatform)

            nextPlatformX += newPlatformWidth + 200
        }

        // Game over condition: if the player falls off the screen
        if (player.position.y > canvas.height) {
            gameState = 'gameOver'
            gameOverText.style.display = 'block'
            playButton.textContent = 'Restart'
            playButton.style.display = 'block'
            return
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

    // Play button click event
    playButton.addEventListener('click', () => {
        if (gameState === 'waiting' || gameState === 'gameOver') {
            playButton.style.display = 'none'
            gameOverText.style.display = 'none'
            gameState = 'playing'
            initializeGame()
            gameLoop()
        }
    })
})
