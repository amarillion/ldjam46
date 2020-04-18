import Phaser from 'phaser';
import { START_SPECIES } from '../sim/StartSpecies.js';
import { TILESIZE } from '../sim/Constants.js';

// docs: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Grid.html

export class SpeciesView extends Phaser.GameObjects.Graphics {

	constructor(scene, grid, options) {
		super(scene, options);
		this.grid = grid;
		this.prop = () => 1;

		this.update();
	}

	update() {
		this.clear();
		
		for (const cell of this.grid.eachNode()) {
			const cx = cell.x * TILESIZE + (TILESIZE / 2);
			const cy = cell.y * TILESIZE + (TILESIZE / 2);
			
			let dx = -TILESIZE / 4;
			let dy = TILESIZE / 4;

			// get top 4 species from cell...
			for (const { speciesId, biomass } of cell.species.slice(0, 4)) {
				if (biomass < 50) continue;
				const color = START_SPECIES[speciesId].color;
				this.fillStyle(color, 1.0);
				this.fillCircle(cx + dx, cy + dy, TILESIZE / 4);
				// rotate 90 degrees
				[dx, dy] = [-dy, dx];
			}
		}
	}

}