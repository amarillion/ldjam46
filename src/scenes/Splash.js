import Phaser from 'phaser';
import { ALL_TRACKS } from '../view/MusicPlayer.js'

export default class extends Phaser.Scene {
	constructor () {
		super({ key: 'SplashScene' });
	}

	preload () {
		this.load.image('biotopeTiles', './assets/images/biotope.png');
		this.load.tilemapTiledJSON('planetScape', './assets/planetscape.json');

		this.load.image('speciesTiles', './assets/images/species.png');
		this.load.tilemapTiledJSON('speciesMap', './assets/speciesmap.json');

		const AUTO_DECODE = true;
		for (const name of ALL_TRACKS) {
			this.load.audio(name, [
				`assets/music/${name}.mp3`
			] , AUTO_DECODE); 
		}
	}

	create () {
		this.game.musicPlayer.init();
		this.scene.start('MenuScene');

	}

	update () {}
}
