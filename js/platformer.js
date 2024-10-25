// platformer.js

import { Vector2D } from "./physics/Vector2D.js";
import { RigidBody } from "./physics/RigidBody.js";
import { Rectangle } from "./physics/Shape.js";
import { PhysicsWorld } from "./physics/PhysicsWorld.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const playButton = document.getElementById("playButton");
  const gameOverText = document.getElementById("gameOverText");

  let gameState = "waiting"; // Possible states: waiting, playing, gameOver

  let physicsWorld, player, platforms, nextPlatformX, spikes;

  function initializeGame() {
    // Create the physics world
    physicsWorld = new PhysicsWorld();
    physicsWorld.gravity = new Vector2D(0, 60);

    // Create the player character and start on the first platform
    player = new RigidBody({
      position: new Vector2D(150, 380), // Start on the first platform
      velocity: new Vector2D(0, 0),
      mass: 1,
      shape: new Rectangle(100, 100),
      restitution: 0.2,
    });
    physicsWorld.addBody(player);

    // Create initial platforms
    platforms = [
      new RigidBody({
        position: new Vector2D(400, 400),
        shape: new Rectangle(800, 20),
        isStatic: true,
      }),
      new RigidBody({
        position: new Vector2D(1200, 300),
        shape: new Rectangle(200, 20),
        isStatic: true,
      }),
    ];
    platforms.forEach((platform) => physicsWorld.addBody(platform));

    // Initialize the position for the next platform
    nextPlatformX = 1600;

    // Create spikes on some platforms
    spikes = [];
    platforms.forEach((platform) => {
      if (Math.random() > 0.9) {
        const spikeCount = Math.floor(1 + Math.random() * 2); // 1 or 2 spikes
        for (let i = 0; i < spikeCount; i++) {
          const spikeX =
            platform.position.x -
            platform.shape.width / 2 +
            Math.random() * platform.shape.width;
          const spikeY = platform.position.y - platform.shape.height / 2; // Align with the top of the platform
          spikes.push({
            position: new Vector2D(spikeX, spikeY),
            width: 20,
            height: 20,
          });
        }
      }
    });
  }

  // Handle input
  const keys = {};
  document.addEventListener("keydown", (event) => {
    if (gameState === "playing") {
      keys[event.key] = true;
    }
  });
  document.addEventListener("keyup", (event) => {
    if (gameState === "playing") {
      keys[event.key] = false;
    }
  });

  // Game loop
  function gameLoop() {
    if (gameState !== "playing") return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Handle player input
    if (keys["ArrowLeft"]) {
      player.velocity = player.velocity.add(new Vector2D(-7.5, 0));
    }
    if (keys["ArrowRight"]) {
      player.velocity = player.velocity.add(new Vector2D(7.5, 0));
    }
    if ((keys["ArrowUp"] || keys[" "]) && player.velocity.y === 0) {
      // Allow jump only if player is not falling
      player.velocity = player.velocity.add(new Vector2D(0, -85)); // Increased jump height
    }

    // Apply friction to slow down horizontal movement
    const friction = 0.91;
    player.velocity.x *= friction;

    // Step physics world
    physicsWorld.step(1 / 60);

    // Move platforms and spikes to the left to create a scrolling effect
    const scrollSpeed = 1;
    platforms.forEach((platform) => {
      platform.position = platform.position.add(new Vector2D(-scrollSpeed, 0));
    });
    spikes.forEach((spike) => {
      spike.position = spike.position.add(new Vector2D(-scrollSpeed, 0));
    });

    // Remove platforms that are out of view and add new ones
    if (platforms[0].position.x + platforms[0].shape.width / 3 < 0) {
      platforms.shift();
      spikes = spikes.filter((spike) => spike.position.x > 0);
    }

    // Add new platforms at the right edge as needed
    if (platforms.length < 200) {
      const newPlatformWidth = 200 + Math.random() * 150; // Random width between 200 and 350
      const newPlatformHeight = 20;
      const minGap = 200; // Minimum gap between platforms
      const maxGap = 350; // Maximum gap between platforms (reduced to avoid large gaps)
      const newPlatformY = 200 + Math.random() * 200;

      const newPlatform = new RigidBody({
        position: new Vector2D(nextPlatformX, newPlatformY),
        shape: new Rectangle(newPlatformWidth, newPlatformHeight),
        isStatic: true,
      });

      platforms.push(newPlatform);
      physicsWorld.addBody(newPlatform);

      nextPlatformX +=
        newPlatformWidth + minGap + Math.random() * (maxGap - minGap);

      // Add spikes to the new platform
      if (Math.random() > 0.3) {
        // 20% chance to add spikes
        const spikeCount = Math.floor(1 + Math.random() * 2); // 1 or 2 spikes
        for (let i = 0; i < spikeCount; i++) {
          const spikeX =
            newPlatform.position.x -
            newPlatform.shape.width / 2 +
            Math.random() * newPlatform.shape.width;
          const spikeY = newPlatform.position.y - newPlatform.shape.height / 2; // Align with the top of the platform
          spikes.push({
            position: new Vector2D(spikeX, spikeY),
            width: 20,
            height: 20,
          });
        }
      }
    }

    // Game over condition: if the player falls off the screen
    if (player.position.y > canvas.height) {
      gameState = "gameOver";
      gameOverText.style.display = "block";
      playButton.textContent = "Restart";
      playButton.style.display = "block";
      return;
    }

    // Collision Detection for platforms
    platforms.forEach((body) => {
      const playerBottom = player.position.y + player.shape.height / 2;
      const platformTop = body.position.y - body.shape.height / 2;

      // Make sure player lands precisely on the platform
      if (
        playerBottom >= platformTop &&
        player.position.y - player.shape.height / 2 <
          body.position.y + body.shape.height / 2 &&
        player.position.x + player.shape.width / 2 >
          body.position.x - body.shape.width / 2 &&
        player.position.x - player.shape.width / 2 <
          body.position.x + body.shape.width / 2
      ) {
        // Align player's bottom to the platform top
        player.position.y = platformTop - player.shape.height / 2 + 1; // Adding a small value like +1 can reduce floating

        // Stop downward velocity
        if (player.velocity.y > 0) {
          player.velocity.y = 0;
        }
      }
    });

    // Collision Detection for spikes
    spikes.forEach((spike) => {
      const playerBottom = player.position.y + player.shape.height / 2.3;
      const playerTop = player.position.y - player.shape.height / 3;
      const playerRight = player.position.x + player.shape.width / 6.9;
      const playerLeft = player.position.x - player.shape.width / 6.9;

      const spikeBottom = spike.position.y + spike.height / 3;
      const spikeTop = spike.position.y - spike.height / 3;
      const spikeRight = spike.position.x + spike.width / 3;
      const spikeLeft = spike.position.x - spike.width / 3;

      // Check if player is colliding with spike
      if (
        playerRight > spikeLeft &&
        playerLeft < spikeRight &&
        playerBottom > spikeTop &&
        playerTop < spikeBottom
      ) {
        // Player hit a spike, game over
        gameState = "gameOver";
        gameOverText.style.display = "block";
        playButton.textContent = "Restart";
        playButton.style.display = "block";
        return;
      }
    });

    // Load player images
    const playerImage = new Image();
    playerImage.src = "images/character_idle_0.png";

    // Draw player using image
    if (playerImage.complete) {
      ctx.drawImage(
        playerImage,
        player.position.x - player.shape.width / 2,
        player.position.y - player.shape.height / 2,
        player.shape.width,
        player.shape.height
      );
    } else {
      playerImage.onload = () => {
        ctx.drawImage(
          playerImage,
          player.position.x - player.shape.width / 2,
          player.position.y - player.shape.height / 2,
          player.shape.width,
          player.shape.height
        );
      };
    }

    // Draw platforms precisely
    ctx.fillStyle = "#3e8e41"; // Green color for platforms
    platforms.forEach((body) => {
      ctx.fillRect(
        Math.round(body.position.x - body.shape.width / 2),
        Math.round(body.position.y - body.shape.height / 2),
        Math.round(body.shape.width),
        Math.round(body.shape.height)
      );
    });

    // Draw spikes
    ctx.fillStyle = "red"; // Red color for spikes
    spikes.forEach((spike) => {
      ctx.beginPath();
      ctx.moveTo(
        spike.position.x - spike.width / 2,
        spike.position.y + spike.height / 2
      );
      ctx.lineTo(spike.position.x, spike.position.y - spike.height / 2);
      ctx.lineTo(
        spike.position.x + spike.width / 2,
        spike.position.y + spike.height / 2
      );
      ctx.fill();
    });

    // Request next frame
    requestAnimationFrame(gameLoop);
  }

  // Play button click event
  playButton.addEventListener("click", () => {
    if (gameState === "waiting" || gameState === "gameOver") {
      playButton.style.display = "none";
      gameOverText.style.display = "none";
      gameState = "playing";
      initializeGame();
      gameLoop();
    }
  });
});
