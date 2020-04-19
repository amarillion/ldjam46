import Phaser from 'phaser';
import { TILESIZE } from '../sim/Constants';

export class Cursor extends Phaser.GameObjects.Graphics {

	constructor(scene, options) {
		super(scene, options);
		this.mx = 0;
		this.my = 0;
		this.visible = false;
		this.update();
	}

	setCoord(mx, my) {
		this.mx = mx;
		this.my = my;
		this.visible = true;
		this.update();
	}

	update() {
		this.clear();
		
		const x1 = this.mx * TILESIZE;
		const y1 = this.my * TILESIZE;
		this.lineStyle(1.0, 0xFFFFFF, 1.0);
		this.strokeRect(x1-1, y1-1, TILESIZE+2, TILESIZE+2);
	}

}