import { Grid } from "./Grid.js";
import { Planet } from "./Planet.js";
import { Species } from "./Species.js";

export class Sim {

	constructor() {
		// TODO: return to larger grid
		this.grid = new Grid(20, 10); // grid for cellular automata
		
		this.species = {}; // map of species by id.
		this.planet = new Planet(); // planetary properties
		this.init();
		this.tickCounter = 0;
	}

	init() {
		// introduce the first species with random DNA
		// NB: the first 12 species will be hardcoded
		for (let i = 0; i < 4; ++i) {
			const lca = this.createSpecies();
		
			// randomly drop some species in a few spots.
			for (let j = 0; j < 5; ++j) {
				const randomCell = this.grid.randomCell();
				randomCell.addSpecies(lca.id, 100);
			}
		}

	}

	createSpecies() {
		const s = new Species();
		this.species[s.id] = s;
		return s;
	}

	tick() {
		// phase I
		this.growAndDie();
		// phase II
		this.interact();
		// phase III
		this.evolve();
		// phase IV
		this.migrate();
		// phase V
		this.updatePlanet();

		this.tickCounter += 1;
	}

	growAndDie() {
		for (const c of this.grid.eachNode()) {
			c.growAndDie();
		}
	}

	interact() {

	}

	evolve() {

	}

	migrate() {
		// for each pair of cells, 1 % migrates...
		for (const cell of this.grid.eachNode()) {
			for (const [, other] of this.grid.getAdjacent(cell)) {
				cell.migrateTo(other);
			}
		}

	}

	updatePlanet() {

	}

}