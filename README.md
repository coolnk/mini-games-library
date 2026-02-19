# Mini Games Library

A collection of Phaser 3 games available for distribution via the MiniGames app.

## Games

### 1. Bouncy Ball
A physics-based game where a ball bounces around the screen with realistic physics.
- **File**: `games/bouncy-ball-bundle.js`
- **Size**: ~2KB

### 2. Click Counter
Click the button as many times as you can in 10 seconds!
- **File**: `games/click-counter-bundle.js`
- **Size**: ~2.5KB

### 3. Memory Tiles
Watch the pattern and tap the tiles in the correct order. Test your memory!
- **File**: `games/memory-tiles-bundle.js`
- **Size**: ~3KB

## Structure

```
mini-games-library/
├── manifest.json           # Game metadata (list of all games)
├── games/                  # Game bundle files
│   ├── bouncy-ball-bundle.js
│   ├── click-counter-bundle.js
│   └── memory-tiles-bundle.js
└── README.md
```

## Game Format

Each game is a **standalone JavaScript bundle** containing a Phaser Scene class:

```javascript
// Game bundles register themselves globally
window.PhaserGames = {
  'game-id': PhaserSceneClass
}
```

### Creating a New Game

1. **Create your game** in Vue or raw Phaser:
```javascript
class MyGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'my-game' });
  }

  create() {
    // Your game code
  }

  update() {
    // Game loop
  }
}
```

2. **Bundle it** as a single .js file

3. **Register it**:
```javascript
window.PhaserGames = window.PhaserGames || {};
window.PhaserGames['my-game'] = MyGameScene;
```

4. **Add to manifest.json**:
```json
{
  "id": "my-game",
  "title": "My Game",
  "description": "My awesome game",
  "bundleUrl": "https://cdn.jsdelivr.net/gh/coolnk/mini-games-library/games/my-game-bundle.js",
  "version": "1.0.0",
  "author": "Your Name",
  "bundleSize": "XKB"
}
```

## Distribution

Games are served via **jsDelivr CDN** for fast, reliable delivery:
```
https://cdn.jsdelivr.net/gh/coolnk/mini-games-library/games/GAME-ID-bundle.js
```

The MiniGames app fetches `manifest.json` to get the list of available games, then loads them on demand.

## Development

### Testing locally

1. Update the `bundleUrl` in `manifest.json` to point to your local server
2. Run a local server: `python -m http.server 8000`
3. Update the game listing URL in the MiniGames app to `http://localhost:8000/manifest.json`

### Building for production

1. Ensure all games are bundled and optimized
2. Commit and push to GitHub
3. jsDelivr will automatically cache the files
4. Update the manifest.json with correct bundle URLs

## Adding Games to Your App

In the MiniGames app, update the manifest URL:

```typescript
const GAMES_MANIFEST_URL = 'https://raw.githubusercontent.com/coolnk/mini-games-library/main/manifest.json'
```

The app will automatically fetch and display all games from this manifest.

## Requirements

- Phaser 3.55+
- Bundle size ideally < 50KB
- Single scene per game (or manage multiple scenes internally)
- Responsive to container dimensions

## License

MIT - Feel free to use these games as templates for your own games.
