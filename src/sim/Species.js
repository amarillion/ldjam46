let globalSpeciesCounter = 0;

export class Species {

	constructor() {
		this.id = globalSpeciesCounter++;
		this.dna = ""; // TODO random data
		this.calculateProperties();
	}

	calculateProperties() {

	}
}
