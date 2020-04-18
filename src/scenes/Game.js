import Phaser from 'phaser';

import { Sim } from '../sim/Sim.js';
import { GridView } from '../view/GridView.js';

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

		this.currentCell = this.sim.grid.get(0, 0);
	}

	preload () {}
	
	create () {
		this.add.text(0, 0, 'Exo Keeper', {
			font: '32px Bangers',
			fill: '#7744ff'
		});

		this.logElement = document.getElementById("log");

		this.gridView = new GridView(this, this.sim.grid, { x : 100, y : 100 });

		// property of interest -> co2
		// CO2: (cell) => cell.co2
		
		this.gridView.setProp((cell) => cell.sumLivingBiomass());

		this.add.existing(this.gridView);
	}

	tickAndLog() {
		this.sim.tick();
		this.gridView.update();
		this.logElement.innerText = `Tick: ${this.sim.tickCounter}\n${this.currentCell}`;
	}

	update() {
	}

}
