import Phaser from 'phaser';

import { Sim } from '../sim/Sim.js';
import { GridView } from '../view/GridView.js';
import { SpeciesView } from '../view/SpeciesView.js';
import { TILESIZE } from '../sim/Constants.js';
import { Cursor } from '../view/Cursor.js';

export default class extends Phaser.Scene {
	constructor () {
		super({ key: 'GameScene' });
	}

	init () {
		console.log("Game.init called");
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
		console.log("Game.create called");

		this.logElement = document.getElementById("log");
		this.planetElement = document.getElementById("planet");

		this.gridView = new GridView(this, this.sim.grid);
		this.speciesView = new SpeciesView(this, this.sim.grid);
		this.cursor = new Cursor(this);

		this.add.existing(this.gridView);
		this.add.existing(this.speciesView);
		this.add.existing(this.cursor);

		this.input.on('pointermove', this.onMouseMove, this);
		this.input.on('pointerup', this.onMouseClick, this);
		this.input.keyboard.on('keydown', this.onKeyDown, this);

		this.setFilter(1);

		var cursors = this.input.keyboard.createCursorKeys();

		var controlConfig = {
			camera: this.cameras.main,
			left: cursors.left,
			right: cursors.right,
			up: cursors.up,
			down: cursors.down,
			zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
			zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
			acceleration: 0.06,
			drag: 0.0005,
			maxSpeed: 1.0
		};

		this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);


		this.add.text(0, 0, 'Exo Keeper', {
			font: '32px Bangers',
			fill: '#7744ff'
		});

	}

	/*
	this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
		// TODO
	});
	*/
	tickAndLog() {
		this.sim.tick();
		this.gridView.update();
		this.speciesView.update();
		this.logElement.innerText = this.currentCell.toString();
		this.planetElement.innerText = `Tick: ${this.sim.tickCounter}\n${this.sim.planet}`;
	}

	update (time, delta) {
		this.controls.update(delta);
	}

	toGridCoords({x, y}) {
		let cursor = this.cameras.main.getWorldPoint(x, y);
		return { 
			mx: Math.floor(cursor.x / TILESIZE),
			my: Math.floor(cursor.y / TILESIZE) 
		};
	}

	onMouseClick(pointer) {
		// find cell closest to cursor...

		const { mx, my } = this.toGridCoords(pointer);

		const newCell = this.sim.grid.get(mx, my);
		if (newCell) {
			this.currentCell = newCell;
		}
	}

	onMouseMove(pointer) {
		const { mx, my } = this.toGridCoords(pointer);
		
		if (this.sim.grid.inRange(mx, my)) {
			this.cursor.setCoord(mx, my);
		}
	}

	onKeyDown (event) {

		// console.log("Keydown", event);
		
		switch (event.keyCode) {
		case Phaser.Input.Keyboard.KeyCodes.ONE:
			this.setFilter(1);
			event.stopPropagation();
			break;

		case Phaser.Input.Keyboard.KeyCodes.TWO:
			this.setFilter(2);
			event.stopPropagation();
			break;

		case Phaser.Input.Keyboard.KeyCodes.THREE:
			this.setFilter(3);
			event.stopPropagation();
			break;

		case Phaser.Input.Keyboard.KeyCodes.FOUR:
			this.setFilter(4);
			event.stopPropagation();
			break;

		case Phaser.Input.Keyboard.KeyCodes.FIVE:
			this.setFilter(5);
			event.stopPropagation();
			break;
	
		case Phaser.Input.Keyboard.KeyCodes.SIX:
			this.setFilter(6);
			event.stopPropagation();
			break;
		}
	}

	setFilter(i) {
		switch(i) {
		case 1:
			// view total biomass
			this.gridView.setProp((cell) => cell.sumLivingBiomass());
			this.gridView.color = 0x88FF88;
			break;
		case 2:
			// view co2
			this.gridView.color = 0x00FF00;
			this.gridView.setProp((cell) => cell.co2);
			break;
		case 3:
			// view o2
			this.gridView.color = 0xFF8888;
			this.gridView.setProp((cell) => cell.o2);
			break;
		case 4:
			// view h2o
			this.gridView.color = 0x0000FF;
			this.gridView.setProp((cell) => cell.h2o);
			break;
		case 5:
			// view heat ( == temp)
			this.gridView.color = 0xFFFF00;
			this.gridView.setProp((cell) => cell.heat, true);
			break;
		case 6:
			// view stellar energy
			this.gridView.color = 0xFF8800;
			this.gridView.setProp((cell) => cell.stellarEnergy);
			break;
		}
	}

}
