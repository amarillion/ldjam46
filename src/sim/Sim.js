import { Grid } from "./Grid.js";
import { Planet } from "./Planet.js";
import { Species } from "./Species.js";

export class Sim {

	constructor(w, h) {
		// TODO: return to larger grid
		this.grid = new Grid(w, h); // grid for cellular automata
		
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
		this.updatePhysicalProperties();
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

	updatePhysicalProperties() {
		for (const c of this.grid.eachNode()) {
			c.updatePhysicalProperties();
		}

		// for each pair of cells, do diffusion
		for (const cell of this.grid.eachNodeCheckered()) {
			for (const [, other] of this.grid.getAdjacent(cell)) {
				cell.diffusionTo(other);
			}
		}
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
		// for each pair of cells, do migration
		for (const cell of this.grid.eachNodeCheckered()) {
			for (const [, other] of this.grid.getAdjacent(cell)) {
				cell.migrateTo(other);
			}
		}

	}

	updatePlanet() {
		this.planet.reset();
		let n = 0;
		let tempSum = 0;
		for (const c of this.grid.eachNode()) {
			tempSum += c.temperature;
			n++;
			c.updateStats(this.planet);
		}
		this.planet.temperature = tempSum / n;
	}

}