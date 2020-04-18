// grid, representing a cylindrical planet
// based on code from helixgraph examples (https://amarillion.github.io/helixgraph/)
import { randomInt } from './random.js';
import { Cell } from './Cell.js';

export const NORTH = 0x01;
export const EAST = 0x02;
export const SOUTH = 0x04;
export const WEST = 0x08;

const DEFAULT_CELL_FACTORY = (x, y) => { return new Cell(x, y); };

/*
A rectangular grid of width x height cells.
The actual cell type is determined by the cellFactory constructor argument.
*/
export class Grid {

	constructor(width, height, cellFactory = DEFAULT_CELL_FACTORY) {
		this.cellFactory = cellFactory;
		this.width = width;
		this.height = height;	
		this._prepareGrid();
	}

	/*
	Protected. 
	Should be called by the constructor only, to initialize each cell in the grid.
	*/
	_prepareGrid() {
		this._data = new Array(this.width * this.height);
		for(let x = 0; x < this.width; ++x) {
			for (let y = 0; y < this.height; ++y) {
				this._data[this._index(x, y)] = this.cellFactory(x, y);
			}
		}
	}

	/*
	Pick a random cell
	*/
	randomCell() {
		const len = this._data.length;
		let pos = randomInt(len);
		return this._data[pos];
	}
	
	// internal mapping from coordinate to index.
	_index(x, y) {
		return x + y * this.width;
	}

	get(x, y) {
		if (this.inRange(x, y)) {
			return this._data[this._index(x, y)];
		}
		else {
			return null;
		}
	}

	inRange(x, y) {
		return x >= 0 && y >= 0 && x < this.width && y < this.height;
	}

	// generator going through all valid cells in order
	*eachNode() {
		for (const node of this._data) {
			if (node) yield node;
		}
	}

	/*
	generator going through adjacent, valid cells. 
	The map is cylindrical. Cells outside the map (north, south) are excluded.
	returns an iterable of [ dir, cell ] tuples, where 
	dir is one of [ NORTH, EAST, SOUTH, WEST ] and cell is the adjacent cell.
	*/

	*getAdjacent(n) {
		let dx = 0;
		let dy = -1;
		const x = n.x;
		const y = n.y;
		
		for (const dir of [NORTH, EAST, SOUTH, WEST]) {
			const nx = (x + dx + this.width) % this.width;
			const ny = y + dy;

			if (ny >= 0 && ny < this.height) {
				const neighbor = this._data[this._index(nx, ny)];
				yield [dir, neighbor];
			}
			
			// rotate 90 degrees
			[dx, dy] = [-dy, dx];
		}
	}
}
