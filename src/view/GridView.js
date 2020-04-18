import Phaser from 'phaser';
import { TILESIZE } from '../sim/Constants';

// docs: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Grid.html

export class GridView extends Phaser.GameObjects.Graphics {

	constructor(scene, grid, options) {
		super(scene, options);
		this.grid = grid;
		this.prop = () => 1;

		// default color
		this.color = 0xFF0000;

		// this.colorMap = (norm) => {
		// 	const intensity = Math.floor(norm * 127);
		// 	return intensity * 0x020101;
		// };

		this.update();
	}

	// property of interest
	// provide a function that maps cell to a numeric value (any range)
	setProp(propFunction) {
		this.prop = propFunction;
	}

	// provide a function that maps a range 0..1 to a hex color code;
	// setColorMap(colorMapFunction) {
	// 	this.colorMap = colorMapFunction;
	// }

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

		const { max } = this.minMax(prop);

		for (const cell of this.grid.eachNode()) {
			const x1 = cell.x * TILESIZE;
			const y1 = cell.y * TILESIZE;
			const val = prop(cell);
			const norm = normalize(val, 0, max);
			this.fillStyle(this.color, norm); // use normalized value as alpha
			this.fillRect(x1, y1, TILESIZE-1, TILESIZE-1);
		}
	}

}