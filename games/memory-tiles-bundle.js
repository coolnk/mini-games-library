/**
 * Memory Tiles Game
 * Watch the pattern and tap the tiles in the correct order
 */

(function() {
  'use strict';

  class MemoryTilesScene extends Phaser.Scene {
    constructor() {
      super({ key: 'memory-tiles' });
      this.score = 0;
      this.sequence = [];
      this.userSequence = [];
      this.gameActive = false;
      this.tiles = [];
    }

    create() {
      this.cameras.main.setBackgroundColor('#1a1a2e');

      // Title
      this.add.text(
        this.scale.width / 2,
        40,
        'Memory Tiles',
        { fontSize: '32px', fill: '#ffffff', fontFamily: 'Arial' }
      ).setOrigin(0.5);

      // Score
      this.scoreText = this.add.text(
        this.scale.width / 2,
        100,
        'Level: 1',
        { fontSize: '24px', fill: '#00ff00', fontFamily: 'Arial' }
      ).setOrigin(0.5);

      // Create 4 tiles in a grid
      const tileSize = 100;
      const spacing = 20;
      const startX = (this.scale.width - (tileSize * 2 + spacing)) / 2;
      const startY = 180;

      const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3];
      const colorNames = ['red', 'cyan', 'yellow', 'green'];

      for (let i = 0; i < 4; i++) {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const x = startX + col * (tileSize + spacing);
        const y = startY + row * (tileSize + spacing);

        const tile = this.add.rectangle(x, y, tileSize, tileSize, colors[i]);
        tile.setInteractive({ useHandCursor: true });
        tile.setStrokeStyle(2, 0xffffff);

        tile.on('pointerdown', () => this.onTileClick(i));
        tile.on('pointerover', () => {
          tile.setFillStyle(colors[i]);
          tile.setAlpha(0.8);
        });
        tile.on('pointerout', () => {
          tile.setAlpha(1);
        });

        this.tiles.push({
          object: tile,
          color: colors[i],
          index: i,
          name: colorNames[i]
        });
      }

      // Instructions
      this.instructionText = this.add.text(
        this.scale.width / 2,
        this.scale.height - 80,
        'Watch and remember the tile sequence!',
        { fontSize: '16px', fill: '#aaaaaa', fontFamily: 'Arial' }
      ).setOrigin(0.5);

      // Start game
      this.time.delayedCall(1000, () => this.nextLevel());
    }

    nextLevel() {
      this.userSequence = [];
      this.gameActive = false;

      // Add new tile to sequence
      const randomIndex = Phaser.Math.Between(0, 3);
      this.sequence.push(randomIndex);

      // Update score
      this.scoreText.setText(`Level: ${this.sequence.length}`);

      // Play sequence
      this.time.delayedCall(1000, () => this.playSequence());
    }

    playSequence() {
      let delay = 500;

      this.sequence.forEach((tileIndex, i) => {
        this.time.delayedCall(delay + i * 800, () => {
          this.flashTile(tileIndex);
        });
      });

      // Let player input after sequence plays
      const totalDelay = delay + this.sequence.length * 800 + 500;
      this.time.delayedCall(totalDelay, () => {
        this.gameActive = true;
        this.instructionText.setText('Your turn! Tap the tiles in order');
      });
    }

    flashTile(index) {
      const tile = this.tiles[index];
      const originalAlpha = tile.object.alpha;

      tile.object.setAlpha(1);
      this.time.delayedCall(200, () => {
        tile.object.setAlpha(0.6);
      });
    }

    onTileClick(index) {
      if (!this.gameActive) return;

      this.userSequence.push(index);
      this.flashTile(index);

      // Check if correct
      if (this.userSequence[this.userSequence.length - 1] !== 
          this.sequence[this.userSequence.length - 1]) {
        this.gameOver();
        return;
      }

      // Check if sequence completed
      if (this.userSequence.length === this.sequence.length) {
        this.gameActive = false;
        this.instructionText.setText('Correct! Next level coming...');
        this.time.delayedCall(2000, () => this.nextLevel());
      }
    }

    gameOver() {
      this.gameActive = false;
      this.instructionText.setText(
        `Game Over! You reached Level ${this.sequence.length}`
      );
      this.scoreText.setFill('#ff0000');

      this.time.delayedCall(3000, () => {
        this.scene.restart();
      });
    }
  }

  // Register the game
  if (!window.PhaserGames) {
    window.PhaserGames = {};
  }
  window.PhaserGames['memory-tiles'] = MemoryTilesScene;
  console.log('✅ Memory Tiles loaded');
})();
