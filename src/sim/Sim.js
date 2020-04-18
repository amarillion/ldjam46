import { Grid } from "./Grid.js";
import { Planet } from "./Planet.js";
import { Species } from "./Species.js";

export class Sim {

	constructor() {
		this.grid = new Grid(20, 10); // grid for cellular automata
		this.species = {}; // map of species by id.
		this.planet = new Planet(); // planetary properties
		this.init();
		this.tickCounter = 0;
	}

	init() {
		// introduce the first species with random DNA
		const lca = new Species();
		const randomCell = this.grid.randomCell();
		randomCell.introduceSpecies(lca, { amount: 100 });
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

	}

	interact() {

	}

	evolve() {

	}

	migrate() {

	}

	updatePlanet() {

	}

}