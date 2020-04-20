import { Grid } from "./Grid.js";
import { Planet } from "./Planet.js";
import { Species } from "./Species.js";
import { openDialog } from "../components/Dialog.js";

const TRIGGERS = {

	'start': {
		condition: (sim) => sim.tickCounter > 0,
		message: (sim) => `<h1>Welcome to Exo Keeper</h1>
		<p>After a voyage of hundreds of lightyears, you have now arrived. Before you lies the barren surface of Kepler-7311b
		Your goal is to make the surface suitable for human inhabitation. 
		But the planet is far too cold. At a breezy ${sim.planet.temperature.toFixed(0)} K (Or ${(sim.planet.temperature - 273).toFixed(0)} C) it's impossible to 
		step outside without a jacket. Plus, there is no oxygen atmosphere.
		<p>
		To terraform the planet, we must introduce some microbe species to the surface.
		<p>
		Study and choose one of the 12 species below. Click on any location in the map, pick a species, and click 'Introduce species'`
	},
	'dead_biomass_increased': {
		condition: (sim) => sim.planet.deadBiomass > 1.2e5,
		message: (sim) => `<h1>Dead biomass build-up</h1>
		<p>Life on the surface is harsh, and microbes are dying, leaving their dead bodies behind.
		They won't decompose, unless you introduce the microbes that do so. Make sure you introduce some decomposers!`
	},
	'albedo_lowered': {
		condition: (sim) => (sim.tickCounter > 10 && sim.planet.albedo < 0.65),
		message: (sim) => `<h1>Albedo is lowering</h1>
		<p>Great job! The albedo of the planet is currently ${sim.planet.albedo.toFixed(2)} and lowering.
		With a lower albedo, more of the energy from the star Kepler-7311 is being absorbed, warming the surface.
		By introducing more species, you can decrease the albedo of the planet even further`
	},
	'first_ice_melting': {
		condition: (sim) => sim.planet.maxTemperature > 273,
		message: (sim) => `<h1>First ice is melting</h1>
		<p>At the warm equator, the temperature has reached ${sim.planet.maxTemperature.toFixed(0)} K (Or ${(sim.planet.maxTemperature - 273).toFixed(0)} C)
		This means that ice starts melting and the planet is getting even more suitable for life.
		Can you reach an average temperature of 298 K?`
	},
	'room_temperature_reached': {
		condition: (sim) => sim.planet.temperature > 298,
		message: (sim) => `<h1>Temperate climate</h1>
		<p>The average temperature of your planet now stands at ${sim.planet.temperature.toFixed(0)} K (Or ${(sim.planet.temperature - 273).toFixed(0)} C)
		The ice has melted, there is oxygen in the atmosphere, the surface is teeming with life.
		Well done, you have taken this game as far as it goes!
		<p>
		Thank you for playing.
		Did you like it? Let us know at @Gekaremi, @Donall or @mpvaniersel on twitter!`
	}

};

export class Sim {

	constructor(w, h) {
		// TODO: return to larger grid
		this.grid = new Grid(w, h); // grid for cellular automata
		
		this.species = {}; // map of species by id.
		this.planet = new Planet(); // planetary properties
		this.init();
		this.tickCounter = 0;

		this.achievements = {};
	}

	init() {
		// introduce the first species with random DNA
		// NB: the first 12 species will be hardcoded
		for (let i = 0; i < 4; ++i) {
			this.createSpecies();
		
			// randomly drop some species in a few spots.
			// for (let j = 0; j < 5; ++j) {
			// 	const randomCell = this.grid.randomCell();
			// 	randomCell.addSpecies(lca.id, 100);
			// }
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
		for (const c of this.grid.eachNode()) {
			c.updateStats(this.planet);
		}
		const n = this.grid.width * this.grid.height;
		this.planet.temperature = this.planet.temperatureSum / n;
		this.planet.albedo = this.planet.albedoSum / n;

		this.checkAchievements();
	}

	checkAchievements() {
		for (const [k, v] of Object.entries(TRIGGERS)) {
			// don't trigger twice...
			if (k in this.achievements) continue;

			if (v.condition(this)) {
				this.achievements[k] = true;
				openDialog(v.message(this));
			}
		}
	}

}