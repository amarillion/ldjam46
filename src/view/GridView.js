import Phaser from 'phaser';
import { TILESIZE } from '../sim/Constants';

// docs: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Grid.html

export class GridView extends Phaser.GameObjects.Graphics {

	constructor(scene, grid, options) {
		super(scene, options);
		this.grid = grid;
		this.prop = () => 1;

		// default color map
		this.colorMap = (norm) => {
			const intensity = Math.floor(norm * 127);
			return intensity * 0x020101;
		};

		this.update();
	}

	// property of interest
	// provide a function that maps cell to a numeric value (any range)
	setProp(propFunction) {
		this.prop = propFunction;
	}

	// provide a function that maps a range 0..1 to a hex color code;
	setColorMap(colorMapFunction) {
		this.colorMap = colorMapFunction;
	}

	minMax(prop) {
		let min = Infinity;
		let max = -Infinity;

		for (const cell of this.grid.eachNode()) {
			const val = prop(cell);
			if (val < min) { min = val; }
			if (val > max) { max = val; }
		}

		return { min, max };
	}

	update() {
		function normalize(val, min, max) {
			const delta = max - min;
			return delta ? (val - min) / delta : 0;
		}
	
		this.clear();
		
		const prop = this.prop;
		const mapColor = this.colorMap;

		const {min, max} = this.minMax(prop);

		for (const cell of this.grid.eachNode()) {
			const x1 = cell.x * TILESIZE;
			const y1 = cell.y * TILESIZE;
			const val = prop(cell);
			const norm = normalize(val, min, max);
			const color = mapColor(norm);
			this.fillStyle(color, 1.0);
			this.fillRect(x1, y1, TILESIZE-1, TILESIZE-1);
		}
	}

}