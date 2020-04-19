import Phaser from 'phaser';
import WebFont from 'webfontloader';

export default class extends Phaser.Scene {
	constructor () {
		super({ key: 'BootScene' });
	}

	preload () {
		this.fontsReady = false;
		this.fontsLoaded = this.fontsLoaded.bind(this);
		this.add.text(100, 100, 'loading fonts...');

		this.load.image('loaderBg', './assets/images/loader-bg.png');
		this.load.image('loaderBar', './assets/images/loader-bar.png');

		this.load.image('biotopeTiles', './assets/images/biotope.png');
		this.load.tilemapTiledJSON('planetScape', './assets/planetscape.json');

		this.load.image('speciesTiles', './assets/images/species.png');
		this.load.tilemapTiledJSON('speciesMap', './assets/speciesmap.json');

		WebFont.load({
			google: {
				families: ['Bangers']
			},
			active: this.fontsLoaded
		});
	}

	update () {
		if (this.fontsReady) {
			this.scene.start('SplashScene');
		}
	}

	fontsLoaded () {
		this.fontsReady = true;
	}
}
