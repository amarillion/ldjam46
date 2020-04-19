import Phaser from 'phaser';

import BootScene from './scenes/Boot.js';
import SplashScene from './scenes/Splash.js';
import GameScene from './scenes/Game.js';

// register components
import './components/SpeciesWindow.js';
import './components/PlanetWindow.js';
import './components/DetailWindow.js';

const calcGameWidth = () => window.innerWidth * 0.67;
const calcGameHeight = () => window.innerHeight * 0.67;

const config = {
	type: Phaser.AUTO,
	localStorageName: 'exokeeper',
	disableContextMenu: true,
	backgroundColor: '#041849',
	fps: {
		target: 20
	},
	scale : {
		mode: Phaser.Scale.NONE,
		width: calcGameWidth(),
		height: calcGameHeight(),
		parent: 'content',
	}
};


const gameConfig = Object.assign(config, {
	scene: [BootScene, SplashScene, GameScene]
});

class Game extends Phaser.Game {
	constructor () {
		super(gameConfig);	
	}
}

window.game = new Game();


//  In scaleMode NONE the Scale Manager is effectively disabled, so you need to
//  tell it when a resize happens yourself:
window.addEventListener('resize', function (/*event*/) {

	window.game.scale.resize(calcGameWidth(), calcGameHeight());

}, false);