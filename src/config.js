import Phaser from 'phaser';

export default {
	type: Phaser.AUTO,
	parent: 'content',
	// width: 800,
	// height: 600,
	localStorageName: 'exokeeper',
	disableContextMenu: true,
	fps: {
		target: 20
	},
	scale : {
		mode: Phaser.Scale.RESIZE
	}
};
