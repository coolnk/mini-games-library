/**
 * Bouncy Ball Game
 * A simple physics-based game where a ball bounces around the screen
 */

(function() {
  'use strict';

  class BouncyBallScene extends Phaser.Scene {
    constructor() {
      super({ key: 'bouncy-ball' });
    }

    create() {
      this.cameras.main.setBackgroundColor('#222231');

      // Title
      this.add.text(
        this.scale.width / 2,
        40,
        'Bouncy Ball',
        { fontSize: '32px', fill: '#ffffff', fontFamily: 'Arial' }
      ).setOrigin(0.5);

      // Create ball
      const ball = this.physics.add.sprite(
        this.scale.width / 2,
        this.scale.height / 2,
        null
      );

      // Draw ball texture
      const graphics = this.make.graphics({ x: 0, y: 0, add: false });
      graphics.fillStyle(0xff6b6b, 1);
      graphics.fillCircle(15, 15, 15);
      graphics.generateTexture('ball', 30, 30);
      graphics.destroy();

      ball.setTexture('ball');
      ball.setBounce(0.9, 0.9);
      ball.setCollideWorldBounds(true);
      ball.setVelocity(
        Phaser.Math.Between(-300, 300),
        Phaser.Math.Between(-300, 300)
      );
      ball.setDrag(0.001);

      // Info text
      this.infoText = this.add.text(
        this.scale.width / 2,
        this.scale.height - 40,
        'Watch the ball bounce!',
        { fontSize: '16px', fill: '#aaaaaa', fontFamily: 'Arial' }
      ).setOrigin(0.5);

      // Store ball reference
      this.ball = ball;
    }

    update() {
      // Keep the info text updated
      if (this.ball) {
        const speed = Math.sqrt(
          this.ball.body.velocity.x ** 2 + this.ball.body.velocity.y ** 2
        );
        this.infoText.setText(
          `Speed: ${Math.round(speed)} px/s`
        );
      }
    }
  }

  // Register the game
  if (!window.PhaserGames) {
    window.PhaserGames = {};
  }
  window.PhaserGames['bouncy-ball'] = BouncyBallScene;
  console.log('✅ Bouncy Ball loaded');
})();
