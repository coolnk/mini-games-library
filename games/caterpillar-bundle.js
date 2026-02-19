/**
 * Caterpillar Game
 * Guide the caterpillar to eat food and grow longer
 * Avoid hitting walls and your own body!
 */

(function() {
  'use strict';

  class CaterpillarScene extends Phaser.Scene {
    constructor() {
      super({ key: 'caterpillar' });
      this.gridSize = 20;
      this.score = 0;
      this.gameActive = true;
      this.caterpillar = [];
      this.food = null;
      this.direction = { x: 1, y: 0 };
      this.nextDirection = { x: 1, y: 0 };
      this.moveCounter = 0;
      this.moveDelay = 5; // Lower = faster
    }

    create() {
      this.cameras.main.setBackgroundColor('#1a1a2e');

      // Calculate grid dimensions
      this.cols = Math.floor(this.scale.width / this.gridSize);
      this.rows = Math.floor(this.scale.height / this.gridSize);

      // Title
      this.add.text(
        20,
        10,
        'Caterpillar',
        { fontSize: '20px', fill: '#00ff00', fontFamily: 'Arial', fontStyle: 'bold' }
      );

      // Score
      this.scoreText = this.add.text(
        20,
        35,
        'Score: 0',
        { fontSize: '16px', fill: '#00ff00', fontFamily: 'Arial' }
      );

      // Instructions
      this.add.text(
        this.scale.width - 200,
        10,
        'Arrow Keys / WASD to Move',
        { fontSize: '12px', fill: '#888888', fontFamily: 'Arial' }
      );

      // Initialize caterpillar in the middle
      const startX = Math.floor(this.cols / 2);
      const startY = Math.floor(this.rows / 2);
      this.caterpillar = [
        { x: startX, y: startY },
        { x: startX - 1, y: startY },
        { x: startX - 2, y: startY }
      ];

      // Spawn first food
      this.spawnFood();

      // Input
      this.input.keyboard.on('keydown', (event) => {
        switch (event.code) {
          case 'ArrowUp':
          case 'KeyW':
            if (this.direction.y === 0) {
              this.nextDirection = { x: 0, y: -1 };
            }
            break;
          case 'ArrowDown':
          case 'KeyS':
            if (this.direction.y === 0) {
              this.nextDirection = { x: 0, y: 1 };
            }
            break;
          case 'ArrowLeft':
          case 'KeyA':
            if (this.direction.x === 0) {
              this.nextDirection = { x: -1, y: 0 };
            }
            break;
          case 'ArrowRight':
          case 'KeyD':
            if (this.direction.x === 0) {
              this.nextDirection = { x: 1, y: 0 };
            }
            break;
        }
      });
    }

    spawnFood() {
      let newFood;
      let validPosition = false;

      while (!validPosition) {
        newFood = {
          x: Math.floor(Math.random() * this.cols),
          y: Math.floor(Math.random() * this.rows)
        };

        // Make sure food doesn't spawn on caterpillar
        validPosition = !this.caterpillar.some(
          segment => segment.x === newFood.x && segment.y === newFood.y
        );
      }

      this.food = newFood;
    }

    update() {
      if (!this.gameActive) return;

      this.moveCounter++;
      if (this.moveCounter < this.moveDelay) return;
      this.moveCounter = 0;

      // Update direction
      this.direction = { ...this.nextDirection };

      // Calculate new head position
      const head = this.caterpillar[0];
      const newHead = {
        x: head.x + this.direction.x,
        y: head.y + this.direction.y
      };

      // Check wall collision
      if (
        newHead.x < 0 || newHead.x >= this.cols ||
        newHead.y < 0 || newHead.y >= this.rows
      ) {
        this.gameOver();
        return;
      }

      // Check self collision
      if (
        this.caterpillar.some(
          segment => segment.x === newHead.x && segment.y === newHead.y
        )
      ) {
        this.gameOver();
        return;
      }

      // Add new head
      this.caterpillar.unshift(newHead);

      // Check food collision
      if (newHead.x === this.food.x && newHead.y === this.food.y) {
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
        this.spawnFood();
        // Food eaten, so don't remove tail (caterpillar grows)
      } else {
        // No food eaten, remove tail
        this.caterpillar.pop();
      }

      // Draw caterpillar
      this.drawCaterpillar();
    }

    drawCaterpillar() {
      // Clear previous graphics
      this.children.list.forEach(child => {
        if (child.isGameObject && child !== this.scoreText && child.getData('type') === 'graphics') {
          child.destroy();
        }
      });

      const graphics = this.make.graphics({ x: 0, y: 0, add: false });
      graphics.setData('type', 'graphics');

      // Draw caterpillar segments
      this.caterpillar.forEach((segment, index) => {
        if (index === 0) {
          // Head - yellow-green
          graphics.fillStyle(0xffff00, 1);
        } else if (index === 1) {
          // Next segment
          graphics.fillStyle(0x90ee90, 1);
        } else {
          // Body segments
          graphics.fillStyle(0x00cc00, 1);
        }

        graphics.fillRect(
          segment.x * this.gridSize + 1,
          segment.y * this.gridSize + 1,
          this.gridSize - 2,
          this.gridSize - 2
        );
      });

      // Draw food (red square)
      graphics.fillStyle(0xff3333, 1);
      graphics.fillRect(
        this.food.x * this.gridSize + 2,
        this.food.y * this.gridSize + 2,
        this.gridSize - 4,
        this.gridSize - 4
      );

      graphics.draw();
      this.add.existing(graphics);
    }

    gameOver() {
      this.gameActive = false;

      const gameOverText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2,
        `GAME OVER!\nFinal Score: ${this.score}`,
        {
          fontSize: '32px',
          fill: '#ff0000',
          fontFamily: 'Arial',
          align: 'center'
        }
      ).setOrigin(0.5);

      this.time.delayedCall(3000, () => {
        this.scene.restart();
      });
    }
  }

  // Register the game
  if (!window.PhaserGames) {
    window.PhaserGames = {};
  }
  window.PhaserGames['caterpillar'] = CaterpillarScene;
  console.log('✅ Caterpillar loaded');
})();
