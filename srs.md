# 1. Introduction

### Purpose of the Document
The purpose of this document is to outline the requirements specification (kravspecifikation) for a 2D platform game app. This game is developed to apply concepts learned from lectures and the "Clean Code" book.

### Project Overview
The platform game is a side-scrolling endless runner where the player controls a character navigating through platforms and avoiding obstacles like spikes. The game emphasizes clean code practices, modular design, and the application of physics simulations.

# 2. Scope
The project includes the development of the game logic, physics simulation, user interface, and basic graphics. It targets modern web browsers and is implemented using JavaScript, HTML5 Canvas, and custom physics modules.

# 3. Definitions and Acronyms
- **POJO**: Plain Old JavaScript Object
- **SRP**: Single Responsibility Principle
- **OOP**: Object-Oriented Programming
- **FPS**: Frames Per Second

# 4. Overall Description

### 4.1. Product Perspective
The game is a standalone web application, focusing on clean code, modular design, and system architecture.

### 4.2. Product Functions
- **Player Control**: Movement (left, right, jump)
- **Physics Simulation**: Gravity, collision detection, and response
- **Procedural Generation**: Platforms and obstacles are generated dynamically
- **Scoring System**: Points based on distance traveled or time survived
- **Game States**: Start screen, playing state, game over screen

### 4.3. User Characteristics
The target audience includes casual gamers and individuals interested in platform games. No prior experience is required.

### 4.4. Constraints
- Must use JavaScript and HTML5 Canvas
- Adhere to principles from the "Clean Code" book
- Complete the project within the assignment deadline

# 5. Functional Requirements

### 5.1. Gameplay Mechanics

#### 5.1.1. Player Movement
- The player can move left and right using the ArrowLeft and ArrowRight keys.
- The player can jump by pressing the ArrowUp key or the Spacebar.
- Movement speed is regulated to prevent excessively fast movement.

#### 5.1.2. Physics Simulation
- **Gravity**: The player is affected by gravity, causing them to fall if not on a platform.
- **Collision Detection**: The game detects collisions between the player, platforms, and spikes.
- **Collision Response**: Upon collision with platforms, the player lands; collisions with spikes result in game over.

#### 5.1.3. Platforms
- Platforms are generated procedurally with varying widths and gaps.
- Platforms scroll from right to left to simulate player movement.
- Some platforms may have spikes placed randomly.

#### 5.1.4. Obstacles
- **Spikes**: Hazardous objects placed on platforms that the player must avoid.
- Spikes are generated with a certain probability and can vary in number.

### 5.2. Game States

#### 5.2.1. Start Screen
- Displays the game title and a Play button.
- Instructions or controls may be shown.

#### 5.2.2. Playing State
- The main game loop runs, handling input, physics, collisions, and rendering.
- The game continues until the player falls off the screen or collides with a spike.

#### 5.2.3. Game Over Screen
- Displayed when the player loses.
- Shows "Game Over" text and a Restart button.

### 5.3. Scoring and Progression
- Score increases over time or based on distance traveled.
- Difficulty increases as the game progresses (e.g., platforms become narrower, gaps wider).

### 5.4. User Interface

#### 5.4.1. Controls
- Keyboard input is used for movement and jumping.
- Responsive to prevent input lag.

#### 5.4.2. Display Elements
- **Score Display**: Shows the current score during gameplay.
- **Game Over Text**: Visible upon losing the game.

#### 5.4.3. Menus and Buttons
- **Play Button**: Starts or restarts the game.
- **Game Over Screen**: Provides options to restart or exit.

### 5.5. Audio and Visuals

#### 5.5.1. Graphics
- **Player Sprite**: Visual representation of the player character.
- **Platform Design**: Simple colored rectangles or images.
- **Spike Design**: Triangular shapes representing hazards.

#### 5.5.2. Animations
- Player animations for running and jumping (if time permits).

# 6. Non-Functional Requirements

### 6.1. Performance
- The game should run smoothly at 60 FPS on standard hardware.
- Efficient rendering and physics calculations to prevent lag.

### 6.2. Usability
- Intuitive controls that respond immediately to user input.
- Clear visual feedback for player actions.

### 6.3. Reliability
- The game should handle unexpected input gracefully.
- No crashes or freezing during gameplay.

### 6.4. Maintainability
- Code is modular and follows the Single Responsibility Principle (SRP).
- Functions and classes are small, focused, and well-documented.
- Naming conventions adhere to "Meaningful Names" principles.

### 6.5. Portability
- Compatible with major web browsers: Chrome, Firefox, Edge, Safari.
- Responsive canvas size or scalable elements to fit different screen resolutions.

# 7. System Architecture

### 7.1. Module Breakdown

- **Physics Module**
  - **Vector2D**: Handles 2D vector operations.
  - **Shape Classes**: Defines geometric shapes (Rectangle, Circle, Polygon).
  - **RigidBody**: Represents physical objects with properties like mass and velocity.
  - **PhysicsWorld**: Manages physics simulations, including gravity and collisions.

- **Game Module (platformer.js)**
  - Initializes the game and canvas.
  - Manages game states and the main game loop.
  - Handles user input and updates game objects.
  - Renders game objects onto the canvas.

### 7.2. Interaction Between Modules
- The platformer.js script utilizes classes from the Physics Module to simulate physics.
- The PhysicsWorld updates positions and detects collisions each frame.
- Rendering functions draw the updated game state onto the canvas.

# 8. External Interfaces

### 8.1. User Interfaces
- **Canvas Element**: The main display area for the game.
- **Buttons**: HTML elements for Play and Restart actions.
- **Event Listeners**: Capture keyboard input for controlling the player.

### 8.2. Hardware Interfaces
- Requires a keyboard for input.
- Runs on devices capable of rendering HTML5 Canvas.

### 8.3. Software Interfaces
- Uses standard web technologies: HTML5, CSS3, and JavaScript ES6.
- No external libraries required, promoting a focus on custom code and learning.

# 9. Assumptions and Dependencies
- Users have access to modern web browsers that support ES6 features and HTML5 Canvas.
- The game does not rely on server-side components or databases.
- All assets (images, sounds) are stored locally within the project.

# 10. Acceptance Criteria
- **Functional Requirements Met**: All gameplay mechanics function as specified.
- **Performance Standards**: The game runs at a consistent 60 FPS without performance issues.
- **Clean Code Practices**: Code adheres to principles from the "Clean Code" book, including:
  - **Meaningful Names**
  - **Small Functions**
  - **Error Handling**
  - **Modular Design**
- **User Experience**: Controls are responsive, and the game provides feedback to the player.
- **Testing**: Unit tests are written for critical components, such as physics calculations and collision detection.

# 11. Glossary
- **RigidBody**: An object that has mass and can undergo physics simulations.
- **Collision Detection**: The computational process of detecting when two or more physical objects intersect.
- **Procedural Generation**: Creating game content algorithmically rather than manually.

# 12. Appendices

### Appendix A: Code Structure Overview
- **physics/**
  - **Vector2D.js**
  - **Shape.js**
  - **RigidBody.js**
  - **PhysicsWorld.js**
- **platformer.js**
- **index.html**
- **styles.css**
- **images/**
  - Player sprite and other graphical assets.

### Appendix B: Clean Code Principles Applied
- **Meaningful Names**: All variables and functions are named to reflect their purpose.
- **Functions (Chapter 3)**: Functions are kept small, and each performs a single action.
- **Error Handling (Chapter 7)**: Errors are handled gracefully, and unexpected inputs are validated.
- **Classes (Chapter 10)**: Classes are designed with a single responsibility and use inheritance appropriately.
- **Systems (Chapter 11)**: The system architecture is modular, promoting separation of concerns and ease of maintenance.

