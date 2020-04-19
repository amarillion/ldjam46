
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

export const START_SPECIES = [

	// 0
	{
		name: 'unnamed_algae_0',
		role: ROLE.PRODUCER, // one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER
		tileIdx: 0,

		// for each other species, define how they interact
		// 1: EAT will mean that this species will eat species 1.
		// being carnivore / omnivore / herbivore is implicit
		// the role takes precedence. So a ROLE.PRODUCER will never EAT another species, no matter what's defined in the interactionMap
		// B: PARASITE -> current species reduces fitness of B without eating it. For plants, you could imagine that it's somehow poisonous
		// B: SYMBIOSIS -> current speices increases fitness of B just by being in the same location 
		//                 (to be true symbiosis, the same needs to be defined in reverse on the other species)
		// B: NEUTRAL -> should be most common. Live side-by-side Neutral is the DEFAULT
		interactionMap: {
			5: INTERACTION.PARASITE,
			6: INTERACTION.SYMBIOSIS,
			// all others are INTERACTION.NEUTRAL
		},

		// fitness for each biotope 0..7, as a factor between 0.0 and 1.0. Default: 0.5
		biotopeTolerances: {
			0: 1.0,
			1: 0.5,
			2: 0.5,
			3: 0.5,
			4: 0.5,
			5: 0.5,
			6: 0.1, 
			7: 0.5
		},

		optimalTemperature: 200, // optimal temperature in Kelvin.

		// to be filled later
		backstory: null,
		profilePictureKey: null,
		tileIndex: null,

		color: 0xFFFF00,
	},	

	// 1
	{
		name: 'unnamed_herbivore_1',
		role: ROLE.CONSUMER, // one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER
		tileIdx: 4,

		// for each other species, define how they interact
		// 1: EAT will mean that this species will eat species 1.
		// being carnivore / omnivore / herbivore is implicit
		// the role takes precedence. So a ROLE.PRODUCER will never EAT another species, no matter what's defined in the interactionMap
		// B: PARASITE -> current species reduces fitness of B without eating it. For plants, you could imagine that it's somehow poisonous
		// B: SYMBIOSIS -> current speices increases fitness of B just by being in the same location 
		//                 (to be true symbiosis, the same needs to be defined in reverse on the other species)
		// B: NEUTRAL -> should be most common. Live side-by-side Neutral is the DEFAULT
		interactionMap: {
			0: INTERACTION.EAT,
			3: INTERACTION.EAT,
			// all others are INTERACTION.NEUTRAL
		},

		// fitness for each biotope 0..7, as a factor between 0.0 and 1.0. Default: 0.5
		biotopeTolerances: {
			0: 1.0,
			1: 1.0,
			2: 0.5,
			3: 0.5,
			4: 0.1,
			5: 0.5,
			6: 0.5,
			7: 0.5
		},

		optimalTemperature: 200, // optimal temperature in Kelvin.

		// to be filled later
		backstory: null,
		profilePictureKey: null,
		tileIndex: null,

		color: 0xFF00FF,
	},	

	// 2
	{
		name: 'unnamed_fungus_2',
		role: ROLE.REDUCER, // one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER
		tileIdx: 1,

		// for each other species, define how they interact
		// 1: EAT will mean that this species will eat species 1.
		// being carnivore / omnivore / herbivore is implicit
		// the role takes precedence. So a ROLE.PRODUCER will never EAT another species, no matter what's defined in the interactionMap
		// B: PARASITE -> current species reduces fitness of B without eating it. For plants, you could imagine that it's somehow poisonous
		// B: SYMBIOSIS -> current speices increases fitness of B just by being in the same location 
		//                 (to be true symbiosis, the same needs to be defined in reverse on the other species)
		// B: NEUTRAL -> should be most common. Live side-by-side Neutral is the DEFAULT
		interactionMap: {
			3: INTERACTION.SYMBIOSIS,
			// all others are INTERACTION.NEUTRAL
		},

		// fitness for each biotope 0..7, as a factor between 0.0 and 1.0. Default: 0.5
		biotopeTolerances: {
			0: 0.5,
			1: 1.0,
			2: 0.5,
			3: 0.1,
			4: 0.5,
			5: 0.5,
			6: 0.5,
			7: 0.5
		},

		optimalTemperature: 200, // optimal temperature in Kelvin.

		// to be filled later
		backstory: null,
		profilePictureKey: null,
		tileIndex: null,

		color: 0x00FFFF,
	},	

	// 3
	{
		name: 'unnamed_algae_3',
		role: ROLE.PRODUCER, // one of ROLE.PRODUCER, ROLE.CONSUMER, ROLE.REDUCER
		tileIdx: 2,
		
		// for each other species, define how they interact
		// 1: EAT will mean that this species will eat species 1.
		// being carnivore / omnivore / herbivore is implicit
		// the role takes precedence. So a ROLE.PRODUCER will never EAT another species, no matter what's defined in the interactionMap
		// B: PARASITE -> current species reduces fitness of B without eating it. For plants, you could imagine that it's somehow poisonous
		// B: SYMBIOSIS -> current speices increases fitness of B just by being in the same location 
		//                 (to be true symbiosis, the same needs to be defined in reverse on the other species)
		// B: NEUTRAL -> should be most common. Live side-by-side Neutral is the DEFAULT
		interactionMap: {
			5: INTERACTION.PARASITE,
			6: INTERACTION.SYMBIOSIS,
			// all others are INTERACTION.NEUTRAL
		},

		// fitness for each biotope 0..7, as a factor between 0.0 and 1.0. Default: 0.5
		biotopeTolerances: {
			0: 1.0,
			1: 0.5,
			2: 0.5,
			3: 0.5,
			4: 0.5,
			5: 0.5,
			6: 0.1, 
			7: 0.5
		},

		optimalTemperature: 200, // optimal temperature in Kelvin.

		// to be filled later
		backstory: null,
		profilePictureKey: null,
		tileIndex: null,

		color: 0xFF0000,
	},	
	
];