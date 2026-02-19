/**
 * Click Counter Game
 * Click the button as many times as you can in 10 seconds!
 */

(function() {
  'use strict';

  class ClickCounterScene extends Phaser.Scene {
    constructor() {
      super({ key: 'click-counter' });
      this.score = 0;
      this.timeLeft = 10;
      this.gameActive = false;
    }

    create() {
      this.cameras.main.setBackgroundColor('#667eea');

      // Title
      this.add.text(
        this.scale.width / 2,
        60,
        'Click Counter',
        { fontSize: '32px', fill: '#ffffff', fontFamily: 'Arial Black' }
      ).setOrigin(0.5);

      // Score display
      this.scoreText = this.add.text(
        this.scale.width / 2,
        140,
        'Clicks: 0',
        { fontSize: '48px', fill: '#ffffff', fontFamily: 'Arial' }
      ).setOrigin(0.5);

      // Timer display
      this.timerText = this.add.text(
        this.scale.width / 2,
        220,
        'Time: 10s',
        { fontSize: '32px', fill: '#ffffff', fontFamily: 'Arial' }
      ).setOrigin(0.5);

      // Create clickable button
      const button = this.add.rectangle(
        this.scale.width / 2,
        this.scale.height / 2 + 40,
        200,
        120,
        0xffffff
      );
      button.setInteractive();

      // Button text
      this.buttonText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2 + 40,
        'CLICK ME!',
        { fontSize: '28px', fill: '#667eea', fontFamily: 'Arial Black' }
      ).setOrigin(0.5);

      // Game over text (hidden initially)
      this.gameOverText = this.add.text(
        this.scale.width / 2,
        this.scale.height - 80,
        '',
        { fontSize: '24px', fill: '#ffffff', fontFamily: 'Arial' }
      ).setOrigin(0.5);

      // Button interactions
      button.on('pointerdown', () => {
        if (this.gameActive) {
          this.score++;
          this.scoreText.setText(`Clicks: ${this.score}`);

          // Visual feedback
          this.tweens.add({
            targets: [button, this.buttonText],
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 50,
            yoyo: true
          });
        }
      });

      button.on('pointerover', () => {
        button.setFillStyle(0xeeeeee);
      });

      button.on('pointerout', () => {
        button.setFillStyle(0xffffff);
      });

      // Start game after delay
      this.time.delayedCall(500, () => {
        this.gameActive = true;
        this.startTimer();
      });
    }

    startTimer() {
      const interval = this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.timeLeft--;
          this.timerText.setText(`Time: ${this.timeLeft}s`);

          if (this.timeLeft <= 0) {
            this.endGame();
          }
        },
        loop: true
      });
    }

    endGame() {
      this.gameActive = false;
      this.gameOverText.setText(
        `Game Over!\nFinal Score: ${this.score}`
      );
      this.buttonText.setText('Game Over');
    }
  }

  // Register the game
  if (!window.PhaserGames) {
    window.PhaserGames = {};
  }
  window.PhaserGames['click-counter'] = ClickCounterScene;
  console.log('✅ Click Counter loaded');
})();
