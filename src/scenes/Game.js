import Phaser from 'phaser';

import Mushroom from '../sprites/Mushroom.js';
import { Sim } from '../sim/Sim.js';

export default class extends Phaser.Scene {
	constructor () {
		super({ key: 'GameScene' });
	}

	init () {
		this.sim = new Sim();

		this.time.addEvent({
			delay: 500, // ms
			callback: () => this.tickAndLog(),
			//args: [],
			// callbackScope: thisArg,
			loop: true
		});
	}

	preload () {}
	
	create () {
		this.mushroom = new Mushroom({
			scene: this,
			x: 400,
			y: 300,
			asset: 'mushroom'
		});

		this.add.existing(this.mushroom);
		this.add.text(0, 0, 'Insert game title here', {
			font: '32px Bangers',
			fill: '#7744ff'
		});

		this.logElement = document.getElementById("log");
	}

	tickAndLog() {
		this.sim.tick();
		
		this.logElement.innerText = `Tick: ${this.sim.tickCounter}`;
	}

	update() {
	}

}
