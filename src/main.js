import Phaser from 'phaser';

import BootScene from './scenes/Boot.js';
import SplashScene from './scenes/Splash.js';
import GameScene from './scenes/Game.js';

import config from './config.js';

const gameConfig = Object.assign(config, {
	scene: [BootScene, SplashScene, GameScene]
});

class Game extends Phaser.Game {
	constructor () {
		super(gameConfig);
	}
}

window.game = new Game();
