
export const ROLE = {
	REDUCER: 0, // metabolises dead biomass using oxygen
	PRODUCER: 1, // grows from h2o and co2
	CONSUMER: 2, // metabolises living species that it can eat using oxygen
};

export const INTERACTION = {
	EAT: 0,
	NEUTRAL: 1, 
	PARASITE: 2, 
	SYMBIOSIS: 3
};

/*

role:  
	one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER

interactionMap:

	for each other species, define how they interact
	1: EAT will mean that this species will eat species 1.
	being carnivore / omnivore / herbivore is implicit
	the role takes precedence. So a ROLE.PRODUCER will never EAT another species, no matter what's defined in the interactionMap
	B: PARASITE -> current species reduces fitness of B without eating it. For plants, you could imagine that it's somehow poisonous
	B: SYMBIOSIS -> current speices increases fitness of B just by being in the same location 
					(to be true symbiosis, the same needs to be defined in reverse on the other species)
	B: NEUTRAL -> should be most common. Live side-by-side Neutral is the DEFAULT

biotopeTolerances: 
	
	fitness for each biotope 0..7, as a factor between 0.0 and 1.0. Default: 0.5

*/

export const START_SPECIES = [

	{ // 0
		name: 'Plant 0',
		iconUrl: './assets/images/species/plant0.png',
		coverArt: './assets/species_cover_art/platn_intro2.png',
		tileIdx: 12,
		color: 0x69F0AE,
		role: ROLE.PRODUCER, // one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER
		interactionMap: {},
		albedo: 0.9, // 1.0 = light & early game 0.0 == dark & late game
		temperatureRange: [ 220, 260 ], // min, max temperature in Kelvin
		backstory: 
`An ancient and strong unicellular plant, but perhaps not the most effective.
<br>
Will do well in the cooler early phase of the game.
`,
		biotopeTolerances: { 0: 0.1, 1: 0.5, 2: 0.5, 3: 0.5, 4: 0.5, 5: 1.0, 6: 0.5, 7: 0.5 }
	}, { // 1
		name: 'Plant 1',
		iconUrl: './assets/images/species/plant1.png',
		coverArt: './assets/species_cover_art/platn_intro1.png',
		tileIdx: 4,
		color: 0x388E3C,
		role: ROLE.PRODUCER, // one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER
		interactionMap: {},
		albedo: 0.8, // 1.0 = light & early game 0.0 == dark & late game
		temperatureRange: [ 230, 270 ], // min, max temperature in Kelvin
		backstory: 
`Legends say that this plant microbe came from a great scientist. Sounds too funny to be true.
<br>
Will do well in the cooler early phase of terraformation.
`,
		biotopeTolerances: { 0: 0.5, 1: 0.1, 2: 0.5, 3: 1.0, 4: 0.5, 5: 0.5, 6: 0.5, 7: 0.5 }
	}, { // 2
		name: 'Herbivore 0',
		iconUrl: './assets/images/species/herbivore0.png',
		coverArt: './assets/species_cover_art/herbivore_intro0.png',
		tileIdx: 11,
		color: 0xF8BBD0,
		role: ROLE.CONSUMER, // one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER
		interactionMap: { 0: INTERACTION.EAT, 1: INTERACTION.EAT, 7: INTERACTION.EAT, 8: INTERACTION.EAT },
		albedo: 0.9, // 1.0 = light & early game 0.0 == dark & late game
		temperatureRange: [ 235, 265 ], // min, max temperature in Kelvin
		backstory: 
`A sweet but dangerous creature. Arghhh yarr! Watch yourself, be careful!
<br>
One of the hardiest herbivores that will survive in low temperatures. 
`,
		biotopeTolerances: { 0: 1.0, 1: 0.5, 2: 0.5, 3: 0.5, 4: 0.5, 5: 0.1, 6: 0.1, 7: 0.5 }
	}, { // 3
		name: 'Fungus 1',
		iconUrl: './assets/images/species/fungi1.png',
		coverArt: './assets/species_cover_art/fungi_intro0.png',
		tileIdx: 13,
		color: 0x8D6E63,
		role: ROLE.REDUCER, // one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER
		interactionMap: {},
		albedo: 0.8, // 1.0 = light & early game 0.0 == dark & late game
		temperatureRange: [ 240, 270 ], // min, max temperature in Kelvin
		backstory: 
`Recycle useful substances and return them to the circle of life. Sometimes it feels like a radio wave.
<br>
You'll need to introduce a decomposer like this one, otherwise dead organic material will pile up, and stifle the ecosystem.
`,
		biotopeTolerances: { 0: 0.5, 1: 0.5, 2: 1.0, 3: 0.5, 4: 1.0, 5: 0.1, 6: 0.1, 7: 0.5 }
	}, { // 4
		name: 'Microbe 1',
		iconUrl: './assets/images/species/microb1.png',
		coverArt: './assets/species_cover_art/microb_intro1.png',
		tileIdx: 1,
		color: 0xFFFF00,
		role: ROLE.CONSUMER, // one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER
		interactionMap: { 0: INTERACTION.EAT, 1: INTERACTION.EAT, 7: INTERACTION.EAT, 8: INTERACTION.EAT },
		albedo: 0.7, // 1.0 = light & early game 0.0 == dark & late game
		temperatureRange: [ 245, 290 ], // min, max temperature in Kelvin
		backstory: `The cow says Muuuu. This yellow creature does not say anything, it is a microbe. But sometimes...
<br>
This creature is a herbivore that can survive in moderately cold climates.
`,
		biotopeTolerances: { 0: 0.1, 1: 1.0, 2: 0.5, 3: 0.5, 4: 0.5, 5: 0.5, 6: 0.5, 7: 0.5 }
	}, { // 5
		name: 'Microbe 2',
		iconUrl: './assets/images/species/microb2.png',
		coverArt: './assets/species_cover_art/microb_intro5.png',
		tileIdx: 3,
		color: 0x8C9EFF,
		role: ROLE.REDUCER, // one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER
		interactionMap: {},
		albedo: 0.6, // 1.0 = light & early game 0.0 == dark & late game
		temperatureRange: [ 250, 290 ], // min, max temperature in Kelvin
		backstory: `
Inspired by space and ready for complexity, the purple mushroom! 
<br>
A useful decomposer in a moderately cold climate.
`,
		biotopeTolerances: { 0: 0.5, 1: 0.1, 2: 0.1, 3: 0.9, 4: 0.9, 5: 0.5, 6: 0.5, 7: 0.5 }
	}, { // 6
		name: 'Catcrobe 2',
		iconUrl: './assets/images/species/catcrobe2.png',
		coverArt: './assets/species_cover_art/catcrobe_intro2.png',
		tileIdx: 9,
		color: 0xBA68C8,
		role: ROLE.CONSUMER, // one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER
		interactionMap: { 2: INTERACTION.EAT, 3: INTERACTION.EAT, 4: INTERACTION.EAT, 5: INTERACTION.EAT, 9: INTERACTION.EAT, 10: INTERACTION.EAT, 11: INTERACTION.EAT },
		albedo: 0.6, // 1.0 = light & early game 0.0 == dark & late game
		temperatureRange: [ 255, 300 ], // min, max temperature in Kelvin
		backstory: `
This is a cat? Is it a microbe? This is a catcrobe! Micro meow!
<br>
This microbe will attack and eat other microbes.
`,
		biotopeTolerances: { 0: 0.5, 1: 0.1, 2: 0.1, 3: 0.5, 4: 0.9, 5: 0.9, 6: 0.5, 7: 0.5 }
	}, { // 7
		name: 'Plant 2',
		iconUrl: './assets/images/species/microb4.png',
		coverArt: './assets/species_cover_art/microb_intro4.png',
		tileIdx: 6,
		color: 0x18FFFF,
		role: ROLE.PRODUCER, // one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER
		interactionMap: {},
		albedo: 0.6, // 1.0 = light & early game 0.0 == dark & late game
		temperatureRange: [ 260, 290 ], // min, max temperature in Kelvin
		backstory: 
`The spiral concentrates the energy of the star and turns it into food for itself. And others.
<br>
This is a photosynthesizing organism, a plant species that can survive in moderately cold climates.
`,
		biotopeTolerances: { 0: 0.5, 1: 0.1, 2: 0.5, 3: 0.9, 4: 0.5, 5: 0.5, 6: 0.5, 7: 0.5 }
	}, { // 8
		name: 'Plant 3',
		iconUrl: './assets/images/species/microb5.png',
		coverArt: './assets/species_cover_art/microb_intro2.png',
		tileIdx: 7,
		color: 0x76FF03,
		role: ROLE.PRODUCER, // one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER
		interactionMap: {},
		albedo: 0.5, // 1.0 = light & early game 0.0 == dark & late game
		temperatureRange: [ 270, 310 ], // min, max temperature in Kelvin
		backstory: 
`Rise and Shine, Micro Pumpkin!  Nutritious, but does not help to increase the temperature greatly.
<br>
Let this plant species cooperate with other microbes to boost its effect.`,
		biotopeTolerances: { 0: 0.5, 1: 0.5, 2: 0.5, 3: 0.5, 4: 0.1, 5: 0.9, 6: 0.5, 7: 0.5 }
	}, { // 9
		name: 'Microbe 3',
		iconUrl: './assets/images/species/microb3.png',
		coverArt: './assets/species_cover_art/microb_intro7.png',
		tileIdx: 8,
		color: 0xBBDEFB,
		role: ROLE.CONSUMER, // one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER
		interactionMap: { 0: INTERACTION.EAT, 1: INTERACTION.EAT, 7: INTERACTION.EAT, 8: INTERACTION.EAT },
		albedo: 0.3, // 1.0 = light & early game 0.0 == dark & late game
		temperatureRange: [ 270, 310 ], // min, max temperature in Kelvin
		backstory: 
`As we all know, bats are cool and dangerous. Therefore, even single-celled bats can eat whatever they want.
<br>
This creature is a herbivore for temperate climes.
`,
		biotopeTolerances: { 0: 0.1, 1: 0.1, 2: 1.0, 3: 0.5, 4: 0.5, 5: 0.9, 6: 0.9, 7: 0.5 }
	}, { // 10
		name: 'Donut 1',
		iconUrl: './assets/images/species/donut1.png',
		coverArt: './assets/species_cover_art/donut_intro1.png',
		tileIdx: 5,
		color: 0xFF8F00,
		role: ROLE.REDUCER, // one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER
		interactionMap: {},
		albedo: 0.2, // 1.0 = light & early game 0.0 == dark & late game
		temperatureRange: [ 270, 310 ], // min, max temperature in Kelvin
		backstory: 
`Circle of life! Or a death donut? This mushroom combines immiscible.
<br>
A decomposer in temperate climates.
`,
		biotopeTolerances: { 0: 0.2, 1: 0.5, 2: 0.5, 3: 0.5, 4: 0.8, 5: 0.5, 6: 0.5, 7: 0.5 }
	}, { // 11
		name: 'Angry 1',
		iconUrl: './assets/images/species/angry1.png',
		coverArt: './assets/species_cover_art/angry_intro1.png',
		tileIdx: 10,
		color: 0xFF3D00,
		role: ROLE.CONSUMER, // one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER
		interactionMap: { 2: INTERACTION.EAT, 3: INTERACTION.EAT, 4: INTERACTION.EAT, 5: INTERACTION.EAT, 6: INTERACTION.EAT, 9: INTERACTION.EAT, 10: INTERACTION.EAT },
		albedo: 0.1, // 1.0 = light & early game 0.0 == dark & late game
		temperatureRange: [ 280, 320 ], // min, max temperature in Kelvin
		backstory: 
`DO NOT JOKE WITH THIS MICRO RED TERMINATOR!!!`,
		biotopeTolerances: { 0: 0.1, 1: 0.1, 2: 0.2, 3: 1.0, 4: 0.8, 5: 0.9, 6: 0.9, 7: 0.1 }
	}

];