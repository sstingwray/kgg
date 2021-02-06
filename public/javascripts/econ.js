(function() {
    'use sctrict';

    let app = {
        currentTurn: 0,
        cityData: [],
        market: {
            goods: [
                {
                    name: 'Fuel',
                    basePrice: 10,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 10
                        }
                    ],
                    prosperityUpkeepMod: 0.005,
                    popUpkeepMod: 0.001,
                },
                {
                    name: 'Food',
                    basePrice: 10,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 10
                        }
                    ],
                    prosperityUpkeepMod: 0,
                    popUpkeepMod: 0.005,
                },
                {
                    name: 'Ores',
                    basePrice: 10,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 10
                        }
                    ],
                    prosperityUpkeepMod: 0,
                    popUpkeepMod: 0,
                },
                {
                    name: 'Alloys',
                    basePrice: 10,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 10
                        }
                    ],
                    prosperityUpkeepMod: 0.005,
                    popUpkeepMod: 0,
                },
                {
                    name: 'Goods',
                    basePrice: 10,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 10
                        }
                    ],
                    prosperityUpkeepMod: 0.005,
                    popUpkeepMod: 0.0005,
                },
                {
                    name: 'Amenities',
                    basePrice: 10,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 10
                        }
                    ],
                    prosperityUpkeepMod: 0.001,
                    popUpkeepMod: 0.0005,
                },
            ],
            currentAsks: [],
            currentLots: [],
            dealHistoryPerTurn: [
                {
                    turn: 0,
                    deals: []
                },
            ],
            topAgentType: '',
        },
        turnData: [],
        staticData: {
            defaultCity: {
                id: 0,
                stats: {
                    name: {
                        base: 'City',
                        result: ''
                    },
                    government: {
                        base: 'Direct Democracy',
                        result: ''
                    },
                    property: {
                        base: 'Socialism',
                        result: ''
                    },
                    population: {
                        base: 0,
                        result: 0
                    },
                    //stability
                    prosperity: {
                        base: 0,
                        result: 0
                    },
                    devastation: {
                        base: 0,
                        result: 0
                    },
                    defences: {
                        base: 0,
                        result: 0
                    },
                    garrisonLimit: {
                        base: 0,
                        result: 0
                    },
                    manpowerLimit: {
                        base: 0,
                        result: 0
                    },
                    mobilization: {
                        base: 0,
                        result: 0
                    },
                    currentManpower: {
                        base: 0,
                        result: 0
                    },
                    socialTrust: {
                        base: 1,
                        result: 0
                    },
                    crime: {
                        base: 0,
                        result: 0
                    },
                    //economics
                    keyRate: {
                        base: 0.,
                        result: 0
                    },
                    corruption: {
                        base: 0,
                        result: 0
                    },
                    incomePerTurn: {
                        base: 0,
                        result: 0
                    },
                    currentBudget: {
                        base: 0,
                        result: 0
                    },
                },
                production: [],
                prices: [],
                politics: [],
                features: [],
                agents: [],
                cityManagerAgent: {
                    type: 'Upkeep',
                    adj: 'Managers',
                    syndicate: '',
                    wallet: 3000,
                    inventories: [],
                    productionRules: [],
                    dealHistory: [],
                },
                upkeep: [],
            },
            defaultAgent: {
                type: '',
                adj: '',
                syndicate: '',
                wallet: 3000,
                inventories: [],
                productionRules: [],
                dealHistory: [],
            },
            governmentTypes: [
                {
                    name: 'Autocracy',
                    effect: ''
                },
                {
                    name: 'Oligarchy',
                    effect: ''
                },
                {
                    name: 'Representative Democracy',
                    effect: ''
                },
                {
                    name: 'Direct Democracy',
                    effect: ''
                }
            ],
            propertyTypes: [
                {
                    name: 'Socialism',
                    effect: ''
                },
                {
                    name: 'Capitalism',
                    effect: ''
                },
                {
                    name: 'Feodalism',
                    effect: ''
                },
                {
                    name: 'Totalitarianism',
                    effect: ''
                }
            ],
            features: [ 
                //=== AgriFeatures +1 ===
                {
                    name: 'Boggy Fens',
                    produce: [],
                    prodMod: [
                    ],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 1
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Bountiful Plains',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 1
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Fair Tundra',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 1
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Green Hills',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 1
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Lichen Fields',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 1
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Natural Farmland',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 1
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Natural Farmland',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 1
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Nutritious Mudlands',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 1
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Rugged Woods',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 1
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                //=== AgriFeatures +2 ===
                {
                    name: 'Fertile Lands',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 2
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Fungal Caves',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 2
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Great River',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 2
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Lush Jungle',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 2
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                //=== AgriFeatures +3 ===
                {
                    name: 'Black Soil',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 3
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Fungal Forest',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 3
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Marvelous Oasis',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 3
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Teeming Reef',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 3
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Tropical Island',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Food',
                            factor: 3
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                //=== FuelFeatures +1 ===
                {
                    name: 'Arid Highlands',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Fuel',
                            factor: 1
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Buzzing Plains',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Fuel',
                            factor: 1
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Hot Springs',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Fuel',
                            factor: 1
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                //=== FuelFeatures +2 ===
                {
                    name: 'Frozen Gas Lake',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Fuel',
                            factor: 2
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Rushing Waterfall',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Fuel',
                            factor: 2
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Searing Desert',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Fuel',
                            factor: 2
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                //=== FuelFeatures +3 ===
                {
                    name: 'Geothermal Vents',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Fuel',
                            factor: 3
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Tempestous Mountain',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Fuel',
                            factor: 3
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Underwater Vents',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Fuel',
                            factor: 3
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                //=== ExcavFeatures +1 ===
                {
                    name: 'Mineral Fields',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Ores',
                            factor: 1
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Mineral Striations',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Ores',
                            factor: 1
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Ore-Veined Cliffs',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Ores',
                            factor: 1
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                //=== ExcavFeatures +2 ===
                {
                    name: 'Prosperous Mesa',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Ores',
                            factor: 2
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Ore-Rich Caverns',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Ores',
                            factor: 2
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                //=== ExcavFeatures +3 ===
                {
                    name: 'Rich Mountain',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Ores',
                            factor: 3
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Submerged Ore Veins',
                    produce: [],
                    prodMod: [],
                    prodLimit: [
                        {
                            name: 'Ores',
                            factor: 3
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                //=== Buildings Food ===
                {
                    name: 'Agricultural Farm',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Food',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Food'
                },
                {
                    name: 'Hydroponics Facility',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Food',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Food'
                },
                {
                    name: 'MRE Factory',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Food',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Food'
                },
                //=== Buildings Fuel ===
                {
                    name: 'Fuel Station',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Fuel',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Fuel'
                },
                {
                    name: 'Prima Condenser',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Fuel',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Fuel'
                },
                {
                    name: 'Prima Refiner',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Fuel',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Fuel'
                },
                //=== Buildings Ores ===
                {
                    name: 'Mine',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Ores',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Ores'
                },
                {
                    name: 'Quarry',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Ores',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Ores'
                },
                {
                    name: 'Excavation Site',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Ores',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Ores'
                },
                //=== Buildings Alloys ===
                {
                    name: 'Foundry',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Alloys',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Alloys'
                },
                {
                    name: 'Metallurgical Plant',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Alloys',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Alloys'
                },
                {
                    name: 'Smithing Site',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Alloys',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Alloys'
                },
                //=== Buildings Goods ===
                {
                    name: 'Goods Factory',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Goods',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Goods'
                },
                {
                    name: 'Manufacturing Site',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Goods',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Goods'
                },
                {
                    name: 'Fabricator',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Goods',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Goods'
                },
                //=== Buildings Fun ===
                {
                    name: 'Theather Hall',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Amenities',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Amenities'
                },
                {
                    name: 'Clinic',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Amenities',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Amenities'
                },
                {
                    name: 'Public Forum',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Amenities',
                            factor: 1
                        }
                    ],
                    prodLimit:[],
                    statMod: [],
                    type: 'BUILD',
                    category: 'Amenities'
                },
                //=== Buildings Misc ===
                {
                    name: 'Gang Hideout',
                    produce: [],
                    prodMod: [],
                    prodLimit:[],
                    statMod: [
                        {
                            name: 'crime',
                            factor: 0.2
                        }
                    ],
                    type: 'BUILD'
                },
                {
                    name: 'Black Market',
                    produce: [],
                    prodMod: [],
                    prodLimit:[],
                    statMod: [
                        {
                            name: 'crime',
                            factor: 0.1
                        }
                    ],
                    type: 'BUILD'
                },
            ],
            syndicates: [
                {
                    name: 'Provisions & Produce Syndicate',
                    description: 'Industrial-sized',
                    type: 'production',
                    subType: 'Agricultural',
                    adj: 'Farmers',
                    productionRules: [
                        {
                            components: [
                                {
                                    name: 'Fuel',
                                    quantity: 3
                                },
                            ],
                            results: [
                                {
                                    name: 'Food',
                                    quantity: 5
                                },
                            ],
                        },
                        {
                            components: [
                                {
                                    name: 'Fuel',
                                    quantity: 8
                                },
                            ],
                            results: [
                                {
                                    name: 'Food',
                                    quantity: 16
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'Family Farm Cooperatives',
                    description: 'Individual-sized',
                    type: 'production',
                    subType: 'Agricultural',
                    adj: 'Farmers',
                    productionRules: [
                        {
                            components: [
                                {
                                    name: 'Fuel',
                                    quantity: 1
                                },
                            ],
                            results: [
                                {
                                    name: 'Food',
                                    quantity: 2
                                },
                            ],
                        },
                        {
                            components: [
                                {
                                    name: 'Fuel',
                                    quantity: 3
                                },
                            ],
                            results: [
                                {
                                    name: 'Food',
                                    quantity: 5
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'Hermeticus Institute',
                    description: 'Industrial-sized',
                    type: 'production',
                    subType: 'Energy',
                    adj: 'Technicians',
                    productionRules: [
                        {
                            components: [
                                {
                                    name: 'Food',
                                    quantity: 3
                                },
                            ],
                            results: [
                                {
                                    name: 'Fuel',
                                    quantity: 5
                                },
                            ],
                        },
                        {
                            components: [
                                {
                                    name: 'Food',
                                    quantity: 8
                                },
                            ],
                            results: [
                                {
                                    name: 'Fuel',
                                    quantity: 16
                                },
                            ],
                        },
                    ],
                    
                },
                {
                    name: "People's Mortar & Pestle",
                    description: 'Individual-sized',
                    type: 'production',
                    subType: 'Energy',
                    adj: 'Technicians',
                    productionRules: [
                        {
                            components: [
                                {
                                    name: 'Food',
                                    quantity: 1
                                },
                            ],
                            results: [
                                {
                                    name: 'Fuel',
                                    quantity: 2
                                },
                            ],
                        },
                        {
                            components: [
                                {
                                    name: 'Food',
                                    quantity: 3
                                },
                            ],
                            results: [
                                {
                                    name: 'Fuel',
                                    quantity: 5
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "Deep Rock Mining Coop",
                    description: 'Industrial-sized',
                    type: 'production',
                    subType: 'Excavation',
                    adj: 'Miners',
                    productionRules: [
                        {
                            components: [
                                {
                                    name: 'Fuel',
                                    quantity: 3
                                },
                            ],
                            results: [
                                {
                                    name: 'Ores',
                                    quantity: 5
                                },
                            ],
                        },
                        {
                            components: [
                                {
                                    name: 'Fuel',
                                    quantity: 8
                                },
                            ],
                            results: [
                                {
                                    name: 'Ores',
                                    quantity: 16
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'Free Prospectors Guild',
                    description: 'Individual-sized',
                    type: 'production',
                    subType: 'Excavation',
                    adj: 'Miners',
                    productionRules: [
                        {
                            components: [
                                {
                                    name: 'Fuel',
                                    quantity: 1
                                },
                            ],
                            results: [
                                {
                                    name: 'Ores',
                                    quantity: 2
                                },
                            ],
                        },
                        {
                            components: [
                                {
                                    name: 'Fuel',
                                    quantity: 3
                                },
                            ],
                            results: [
                                {
                                    name: 'Ores',
                                    quantity: 5
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'Alice Blue Manufacturers',
                    description: 'Industrial-sized',
                    type: 'production',
                    subType: 'Consumer',
                    adj: 'Artisans',
                    productionRules: [
                        {
                            components: [
                                {
                                    name: 'Ores',
                                    quantity: 3
                                },
                            ],
                            results: [
                                {
                                    name: 'Goods',
                                    quantity: 5
                                },
                            ],
                        },
                        {
                            components: [
                                {
                                    name: 'Ores',
                                    quantity: 8
                                },
                            ],
                            results: [
                                {
                                    name: 'Goods',
                                    quantity: 16
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'Independent Artisans Syndicate',
                    description: 'Individual-sized',
                    type: 'production',
                    subType: 'Consumer',
                    adj: 'Artisans',
                    productionRules: [
                        {
                            components: [
                                {
                                    name: 'Ores',
                                    quantity: 1
                                },
                            ],
                            results: [
                                {
                                    name: 'Goods',
                                    quantity: 2
                                },
                            ],
                        },
                        {
                            components: [
                                {
                                    name: 'Ores',
                                    quantity: 3
                                },
                            ],
                            results: [
                                {
                                    name: 'Goods',
                                    quantity: 5
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'Tumbleweed Production Coop',
                    description: 'Industrial-sized',
                    type: 'production',
                    subType: 'Amenities',
                    adj: 'Artists',
                    productionRules: [
                        {
                            components: [
                                {
                                    name: 'Food',
                                    quantity: 3
                                },
                            ],
                            results: [
                                {
                                    name: 'Amenities',
                                    quantity: 5
                                },
                            ],
                        },
                        {
                            components: [
                                {
                                    name: 'Food',
                                    quantity: 8
                                },
                            ],
                            results: [
                                {
                                    name: 'Amenities',
                                    quantity: 16
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'Musicians Guild',
                    description: 'Individual-sized',
                    type: 'production',
                    subType: 'Amenities',
                    adj: 'Artists',
                    productionRules: [
                        {
                            components: [
                                {
                                    name: 'Food',
                                    quantity: 1
                                },
                            ],
                            results: [
                                {
                                    name: 'Amenities',
                                    quantity: 2
                                },
                            ],
                        },
                        {
                            components: [
                                {
                                    name: 'Food',
                                    quantity: 3
                                },
                            ],
                            results: [
                                {
                                    name: 'Amenities',
                                    quantity: 5
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'United Heavy Industries',
                    description: 'Industrial-sized',
                    type: 'production',
                    subType: 'Heavy',
                    adj: 'Manufacturers',
                    productionRules: [
                        {
                            components: [
                                {
                                    name: 'Ores',
                                    quantity: 3
                                },
                            ],
                            results: [
                                {
                                    name: 'Alloys',
                                    quantity: 5
                                },
                            ],
                        },
                        {
                            components: [
                                {
                                    name: 'Ores',
                                    quantity: 8
                                },
                            ],
                            results: [
                                {
                                    name: 'Alloys',
                                    quantity: 16
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'Syndicated Smiths of Nu-Avalon',
                    description: 'Individual-sized',
                    type: 'production',
                    subType: 'Heavy',
                    adj: 'Manufacturers',
                    productionRules: [
                        {
                            components: [
                                {
                                    name: 'Ores',
                                    quantity: 1
                                },
                            ],
                            results: [
                                {
                                    name: 'Alloys',
                                    quantity: 2
                                },
                            ],
                        },
                        {
                            components: [
                                {
                                    name: 'Ores',
                                    quantity: 3
                                },
                            ],
                            results: [
                                {
                                    name: 'Alloys',
                                    quantity: 5
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'Iron Syndicate',
                    description: 'Manages the railroads',
                    type: 'politcal',
                },
                {
                    name: 'United Trading Network',
                    description: 'Loves trading and elections',
                    type: 'politcal',
                },
                {
                    name: 'Geological Society of Nu-Avalon',
                    description: 'They want to explore the continent and catalogue everything in a unified manner',
                    type: 'politcal',
                },
                {
                    name: "Rainbow Riders",
                    description: 'Ranger Corp, dedicated to bringing justice to the continent through education (and guns)',
                    type: 'politcal',
                },
            ],
            agentTypes: [
                {
                    name: 'Agricultural',
                    adj: 'Farmers',
                    goods: [
                        'Food'
                    ]
                },
                {
                    name: 'Energy',
                    adj: 'Technicians',
                    goods: [
                        'Fuel'
                    ]
                },
                {
                    name: 'Excavation',
                    adj: 'Miners',
                    goods: [
                        'Ores'
                    ]
                },
                {
                    name: 'Heavy',
                    adj: 'Manufacturers',
                    goods: [
                        'Alloys'
                    ]
                },
                {
                    name: 'Consumer',
                    adj: 'Artisans',
                    goods: [
                        'Goods'
                    ]
                },
                {
                    name: 'Amenities',
                    adj: 'Artists',
                    goods: [
                        'Amenities'
                    ]
                },
            ],
            actions: [
                'Remove City',
                'Add Political Agent',
                'Add Geo Feature',
                'Add Building',
                'Add Econ Agent',
                'Log City Data'
            ]
        },
        containers: {
            cityContainer: {},
            anchorsContainer: {}
        },
        templates: {
            cityWrapper: {},
            btn: {}
        },
        components: {
            spinner: {}
        }
    }

    app.generateNewCity = function() {
        let promise = new Promise (resolve => {
            let newCityData = JSON.parse(JSON.stringify(app.staticData.defaultCity));

            newCityData.stats.name.base += '-' + (app.cityData.length + 1);
            newCityData.id = app.cityData.length + 1;

            //Generating stats
            newCityData.stats.government.base = app.staticData.governmentTypes[Math.max(0, round(Math.random()*app.staticData.governmentTypes.length - 1, 0))].name;
            newCityData.stats.property.base = app.staticData.propertyTypes[Math.max(0, round(Math.random()*app.staticData.propertyTypes.length - 1, 0))].name;
            newCityData.stats.population.base = round(300 + 200*(Math.random()*19 + 1) + 10*(Math.random()*19 + 1), 0);
            newCityData.stats.prosperity.base = round(Math.random()*4 + 1, 0);
            newCityData.stats.defences.base = 0.09 - Math.random()*0.06;
            newCityData.stats.socialTrust.base = 1 - Math.random()*0.06;
            newCityData.stats.keyRate.base = 0.09 - Math.random()*0.06;
            newCityData.stats.crime.base = 0.09 - Math.random()*0.06;
            newCityData.stats.corruption.base = 0.09 - Math.random()*0.06;
            newCityData.stats.currentBudget.result = 7000;

            //Generating upkeep
            app.market.goods.forEach(good => {
                let upkeepItem = {
                    name: good.name,
                    mod: 0,
                    base: 0.5 + round(Math.random(), 2),
                    need: 0
                };

                Object.keys(good).forEach(key => {
                    upkeepItem[key] = good[key];
                });

                newCityData.upkeep.push(upkeepItem);
            });

            //Generating production
            app.market.goods.forEach(good => {
                let productionItem = {
                    name: good.name,
                    mod: 0,
                    base: 1 - round(Math.random(), 0),
                    limit: newCityData.stats.prosperity.base,
                };

                Object.keys(good).forEach(key => {
                    productionItem[key] = good[key];
                });

                newCityData.production.push(productionItem);
            });

            //Generating political agents
            for (let index = 0; index < Math.random()*4 + 4; index++) {
                app.addNewPoliticalAgent(newCityData);
            };

            //Generating geo features
            for (let index = 0; index < 6; index++) {
                app.addNewFeature(newCityData, 'GEO');
            };

            //Generating buildings
            for (let index = 0; index < 8; index++) {
                app.addNewFeature(newCityData, 'BUILD');
            };

            //Adding city manager agent
            newCityData.upkeep.forEach(item => {
                newCityData.cityManagerAgent.inventories.push({
                    name: item.name,
                    inventory: item.need,
                    lowerPrice: round(item.basePrice*(0.5 - 0.2*Math.random()), 2),
                    upperPrice: round(item.basePrice*(1.5 + 0.2*Math.random()), 2),
                });
            });
            
            //Adding econ agents
            app.addNewEconAgent(newCityData, 'Agricultural');
            app.addNewEconAgent(newCityData, 'Agricultural');
            app.addNewEconAgent(newCityData, 'Energy');
            app.addNewEconAgent(newCityData, 'Energy');
            app.addNewEconAgent(newCityData, 'Excavation');
            for (let index = 0; index < 1 + 1*(round(newCityData.stats.population.result/2000, 0)); index++) {
                app.addNewEconAgent(newCityData);
            };

            app.cityData.push(newCityData);
            newCityData = {};
            resolve();
        });
        return promise;
    };

    app.generateCityCards = function(cityData) {
        let newCityWrapper = app.templates.cityWrapper.cloneNode(true);

        let genericField = newCityWrapper.querySelector('.generic.template');
        let productionField = newCityWrapper.querySelector('.production.template');
        let factionField = newCityWrapper.querySelector('.faction.template');
        let upkeepField = newCityWrapper.querySelector('.upkeep.template');
        let econAgentCard = newCityWrapper.querySelector('.econ-agent-stats.card.template');
        let featureCard = newCityWrapper.querySelector('.feature.template');

        let cityAnchor = document.querySelector('.city-anchor-link.template').cloneNode(true);

        newCityWrapper.classList.add('generated');
        newCityWrapper.classList.remove ('template');
        newCityWrapper.dataset.cityId = cityData.id;
        newCityWrapper.querySelector('.city-anchor').id = cityData.id;
        cityAnchor.href = '#' + cityData.id;
        cityAnchor.innerHTML = cityData.stats.name.base;
        cityAnchor.classList.remove('template');
        cityAnchor.classList.add('generated');

        //======================================= CARD FIELDS =======================================
        newCityWrapper.querySelector('.city-name').innerHTML = cityData.stats.name.base;
        newCityWrapper.querySelector('.manager-wallet').innerHTML = 'Current Funds: ' + round(cityData.cityManagerAgent.wallet, 2);
        //newCityWrapper.querySelector('.city-pop').innerHTML = 'Population: ' + cityData.stats.population.result;
        //newCityWrapper.querySelector('.city-gov-type').innerHTML = 'Government Type: ' + cityData.stats.government.base;
        //newCityWrapper.querySelector('.city-prop-type').innerHTML = 'Property Relations: ' + cityData.stats.property.base;

        //======================================= STATS =======================================
        Object.keys(cityData.stats).forEach(key => {
            let newField = genericField.cloneNode(true);
            let baseInput = newField.querySelector('.base').querySelector('input');

            newField.classList.add('generated');
            newField.classList.remove('template');

            if (
                key == 'name' ||
                key == 'government' ||
                key == 'property' ||
                key == 'population'
            ) {
                baseInput.classList.add('w-10em');
                //$(newField).hide();
            };

            newField.querySelector('.name').innerHTML = key;
            newField.querySelector('.base').querySelector('input').value = (parseFloat(cityData.stats[key].base) ? round(cityData.stats[key].base, 2) : cityData.stats[key].base);
            newField.querySelector('.value').innerHTML = (parseFloat(cityData.stats[key].result) ? round(cityData.stats[key].result, 2) : cityData.stats[key].result);
            $(baseInput).on('change', () => {
                cityData.stats[key].base = (parseFloat($(baseInput).val()) ? parseFloat($(baseInput).val()) : $(baseInput).val());
                $(baseInput).addClass('changed');
                $('.calculate-btn')[0].click();
            });

            newCityWrapper.querySelector('.city-stats').querySelector('tbody').appendChild(newField);
        });
        //======================================= UPKEEP =======================================
        cityData.upkeep.forEach(upkeepItem => {
            let newField = upkeepField.cloneNode(true);
            let baseInput = newField.querySelector('.base').querySelector('input');
            let agentInventory = cityData.cityManagerAgent.inventories.filter(x => x.name == upkeepItem.name)[0];

            newField.classList.add('generated');
            newField.classList.remove('template');

            newField.querySelector('.name').innerHTML = upkeepItem.name;
            newField.querySelector('.mod').innerHTML = round(upkeepItem.mod, 2);
            baseInput.value = round(upkeepItem.base, 2);
            newField.querySelector('.need').innerHTML = upkeepItem.need;
            newField.querySelector('.lower-price').innerHTML = round(agentInventory.lowerPrice, 2);
            newField.querySelector('.upper-price').innerHTML = round(agentInventory.upperPrice, 2);
            newField.querySelector('.inventory').innerHTML = agentInventory.inventory;

            $(baseInput).on('change', () => {
                upkeepItem.base = parseFloat($(baseInput).val());
                $(baseInput).addClass('changed');
                $('.calculate-btn')[0].click();
            });

            newCityWrapper.querySelector('.city-upkeep').querySelector('tbody').appendChild(newField);
        });
        //======================================= PRODUCTION =======================================
        cityData.production.forEach(productionItem => {
            let newField = productionField.cloneNode(true);
            let baseInput = newField.querySelector('.base').querySelector('input');

            newField.classList.add('generated');
            newField.classList.remove('template');

            newField.querySelector('.name').innerHTML = productionItem.name;
            baseInput.value = round(productionItem.base, 2);
            newField.querySelector('.mod').innerHTML = round(productionItem.mod, 2);
            newField.querySelector('.limit').innerHTML = cityData.features.filter(x => x.type == 'BUILD' && x.category == productionItem.name).reduce((a,b) => a + b.factor, 0) + ' / ' + productionItem.limit;

            $(baseInput).on('change', () => {
                productionItem.base = parseFloat($(baseInput).val());
                $(baseInput).addClass('changed');
                $('.calculate-btn')[0].click();
            });

            newCityWrapper.querySelector('.city-production').querySelector('tbody').appendChild(newField);
        });
        //======================================= POLITICS =======================================
        cityData.politics.forEach((item, index) => {
            let newField = factionField.cloneNode(true);
            let nameInput = newField.querySelector('.name').querySelector('input');
            let supportInput = newField.querySelector('.support').querySelector('input');
            let trendInput = newField.querySelector('.trend').querySelector('input');
            let oppositionInput = newField.querySelector('.opposition').querySelector('input');
            let removeBtn = newField.querySelector('.remove-btn');

            newField.classList.add('generated');
            newField.classList.remove('template');

            nameInput.value = item.name;
            supportInput.value = round(item.support, 2);
            trendInput.value = round(item.trend, 3);
            oppositionInput.value = round(item.opposition, 2);

            $(nameInput).on('change', () => {
                item.name = $(nameInput).val();
                $(nameInput).addClass('changed');
                $('.calculate-btn')[0].click();
            });

            $(supportInput).on('change', () => {
                item.support = parseFloat($(supportInput).val());
                $(supportInput).addClass('changed');
                $('.calculate-btn')[0].click();
            });

            $(trendInput).on('change', () => {
                item.trend = parseFloat($(trendInput).val());
                $(trendInput).addClass('changed');
                $('.calculate-btn')[0].click();
            });

            $(oppositionInput).on('change', () => {
                item.opposition = parseFloat($(oppositionInput).val());
                $(oppositionInput).addClass('changed');
                $('.calculate-btn')[0].click();
            });

            $(removeBtn.querySelector('.btn')).on('click', () => {
                cityData.politics.splice(index, 1);
                $('.calculate-btn')[0].click();
            });

            newCityWrapper.querySelector('.city-politics').querySelector('tbody').appendChild(newField);
        });
        //======================================= FEATURES =======================================
        cityData.features.forEach((item, index) => {
            let newFeatureCard = featureCard.cloneNode(true);
            let nameInput = newFeatureCard.querySelector('.feature-name-input');
            let baseInput = newFeatureCard.querySelector('.feature-factor-input');
            let removeBtn = newFeatureCard.querySelector('.remove-btn');

            newFeatureCard.classList.add('generated');
            newFeatureCard.classList.remove('template');

            nameInput.value = item.name;
            baseInput.value = round(item.factor, 2);

            $(nameInput).on('change', () => {
                item.name = $(nameInput).val();
                if (app.staticData.features.filter(x => x.name == $(nameInput).val()).length > 0) {
                    Object.assign(item, app.staticData.features.filter(x => x.name == $(nameInput).val())[0]);
                };
                $(nameInput).addClass('changed');
                $('.calculate-btn')[0].click();
                
            });

            $(baseInput).on('change', () => {
                item.factor = parseFloat($(baseInput).val());
                $(baseInput).addClass('changed');
                $('.calculate-btn')[0].click();
                
            });

            $(removeBtn).on('click', () => {
                cityData.features.splice(index, 1);
                $('.calculate-btn')[0].click();
            });

            (item.type == 'GEO' ? newCityWrapper.querySelector('.city-features').appendChild(newFeatureCard) : newCityWrapper.querySelector('.city-buildings').appendChild(newFeatureCard))
        });
        //======================================= CONTROLS =======================================
        app.staticData.actions.forEach(action => {
            let newBtn = app.templates.btn.cloneNode(true);

            newBtn.innerHTML = action;

            newBtn.classList.remove('template');
            newBtn.classList.add('generated');

            switch (action) {
                case 'Remove City':
                    $(newBtn).on('click', () => {
                        let index = app.cityData.findIndex(city => city.id === cityData.id);
                        app.cityData.splice(index, 1);
                        $('.calculate-btn')[0].click();
                    });
                    break;
                case 'Add Political Agent':
                    $(newBtn).on('click', () => {
                        app.addNewPoliticalAgent(cityData);
                        $('.calculate-btn')[0].click();
                    });
                    break;
                case 'Add Geo Feature':
                    $(newBtn).on('click', () => {
                        app.addNewFeature(cityData, 'GEO');
                        $('.calculate-btn')[0].click();
                    });
                    break;
                case 'Add Building':
                    $(newBtn).on('click', () => {
                        app.addNewFeature(cityData, 'BUILD');
                        $('.calculate-btn')[0].click();
                    });
                    break;
                case 'Add Econ Agent':
                    $(newBtn).on('click', () => {
                        app.addNewEconAgent(cityData);
                        $('.calculate-btn')[0].click();
                    });
                    break;
                case 'Log City Data':
                    $(newBtn).on('click', () => {
                        console.log(cityData);
                    });
                    break;
                default:
                    break;
            };
            newCityWrapper.querySelector('.city-controls').appendChild(newBtn);
        });
        //======================================= AGENTS =======================================
        cityData.agents.forEach((agent, index) => {
            let newAgentCard = econAgentCard.cloneNode(true);
            let inventoryField = newCityWrapper.querySelector('.table-field.agent-inventory.template');
            let listOfGoods = [];
            let bankruptBtn = newAgentCard.querySelector('.bankrupt-btn');

            newAgentCard.classList.remove('template');
            newAgentCard.classList.add('generated');

            newAgentCard.querySelector('.title').innerHTML = '#' + (index + 1) + ' ' + agent.adj;
            newAgentCard.querySelector('.agent-type').innerHTML += agent.type;
            newAgentCard.querySelector('.agent-syndicate').innerHTML += agent.syndicate;
            newAgentCard.querySelector('.agent-wallet').innerHTML += round(agent.wallet, 2);

            agent.inventories.forEach(good => {
                let newInventoryField = inventoryField.cloneNode(true);
                
                newInventoryField.classList.remove('template');
                newInventoryField.classList.add('generated');
                newInventoryField.querySelector('.good').innerHTML = good.name;
                newInventoryField.querySelector('.buy').innerHTML = round(good.lowerPrice, 2);
                newInventoryField.querySelector('.sell').innerHTML = round(good.upperPrice, 2);
                newInventoryField.querySelector('.inventory').innerHTML = good.inventory;

                newAgentCard.querySelector('.agent-inventory-table').appendChild(newInventoryField);
            });

            $(bankruptBtn).on('click', () => {
                cityData.agents.splice(index, 1);
                $('.calculate-btn')[0].click();
            })
            
            $(newAgentCard).insertBefore(newCityWrapper.querySelector('.production-stopper'));
        });

        app.containers.anchorsContainer.appendChild(cityAnchor);
        app.containers.cityContainer.appendChild(newCityWrapper);

    };

    app.calculateCity = function(cityData) {
        let promise = new Promise (resolve => {
        
            let factionTotal = 1;
            
            cityData.politics.forEach(faction => {
                factionTotal += faction.support*faction.opposition;
            });

            factionTotal = factionTotal/cityData.politics.length;

            //main stats
            //cityData.stats.name.result = cityData.stats.name.base;
            //cityData.stats.government.result = cityData.stats.government.base;
            //cityData.stats.property.result = cityData.stats.property.base;
            cityData.stats.population.result = cityData.stats.population.base;
            cityData.stats.prosperity.result = cityData.stats.prosperity.base;
            cityData.stats.devastation.result = cityData.stats.devastation.base;
            cityData.stats.garrisonLimit.result = round(Math.min(0.165*cityData.stats.population.result + 10*cityData.stats.prosperity.result, cityData.stats.population.result*0.33), 0);
            cityData.stats.manpowerLimit.result = round(Math.min(cityData.stats.garrisonLimit.result + 0.165*cityData.stats.population.result, cityData.stats.population.result*0.66), 0);
            cityData.stats.currentManpower.result = Math.min(cityData.stats.currentManpower.base, cityData.stats.manpowerLimit.result);
            cityData.stats.mobilization.result = cityData.stats.currentManpower.result / cityData.stats.manpowerLimit.result;
            cityData.stats.defences.result = cityData.stats.defences.base + cityData.stats.mobilization.result;
            cityData.stats.socialTrust.result = Math.min(2, cityData.stats.socialTrust.base - 1*factionTotal + 0.02*cityData.stats.prosperity.result - cityData.stats.devastation.result*(cityData.stats.devastation.result <= 0.2 ? 0.5 : (cityData.stats.devastation.result <= 0.33 ? 0.4 : 0.3)));
            cityData.stats.crime.result = Math.max(cityData.stats.crime.base + (0.6 - cityData.stats.socialTrust.result**2), cityData.stats.crime.base);
            //econ stats
            cityData.stats.keyRate.result = cityData.stats.keyRate.base;
            cityData.stats.corruption.result = cityData.stats.corruption.base + 0.05*(1 + cityData.stats.crime.result);
            cityData.stats.incomePerTurn.result = cityData.stats.population.result*0.65*cityData.stats.keyRate.result*(1 + cityData.stats.prosperity.result*0.1)*(1 - cityData.stats.corruption.result)*(1 - 2*cityData.stats.mobilization.result)*(1 - cityData.stats.devastation.result);

            cityData.upkeep.forEach(upkeep => {
                upkeep.mod = round(upkeep.base*(1 + cityData.stats.crime.result)*(1 + cityData.stats.prosperity.result*0.2), 2);
                upkeep.need = round(((upkeep.prosperityUpkeepMod*cityData.stats.prosperity.result + upkeep.popUpkeepMod)*cityData.stats.population.result)*upkeep.mod, 0);
            });

            cityData.production.forEach(production => {
                production.mod = round(production.base*(1 - cityData.stats.crime.result)*(1 + cityData.stats.prosperity.result*0.2), 0);
                production.limit = cityData.stats.prosperity.base;
            });

            resolve();
        });
        return promise;
    };

    app.calculateCityFeatures = function(cityData) {
        let promise = new Promise (resolve => {
            cityData.features.forEach(feature => {
                feature.prodMod.forEach(prodMod => {
                    cityData.production.filter(x => x.name == prodMod.name)[0].mod += prodMod.factor;
                });
                feature.prodLimit.forEach(prodLimit => {
                    cityData.production.filter(x => x.name == prodLimit.name)[0].limit += prodLimit.factor;
                });
                feature.statMod.forEach(statMod => {
                    cityData.stats[statMod.name].result += statMod.factor;
                });
            });
            resolve();
        });

        return promise;
    };

    app.addNewPoliticalAgent = function(city) {
        let randomIndex = round(Math.random()*(app.staticData.syndicates.length - 1), 0);
        let randomSyndicate = JSON.parse(JSON.stringify(app.staticData.syndicates[randomIndex]));
        randomSyndicate.support = (Math.random())*0.2, 2;
        randomSyndicate.trend = (Math.random()*0.04 + 0.01);
        randomSyndicate.opposition = (Math.random()*0.5);
        randomSyndicate.id = city.politics.length;

        if (city.politics.filter(x => x.name == randomSyndicate.name).length > 0) {
            city.politics.filter(x => x.name == randomSyndicate.name)[0].support += (city.politics.filter(x => x.name == randomSyndicate.name)[0].support < 1 ? randomSyndicate.support : 0);
        } else {
            city.politics.push(randomSyndicate);
        };
    };

    app.addNewFeature = function(city, category, specificFeatureName = '', iteration = 0) {
        return new Promise (resolve => {
            let randomIndex = 0;
            let randomFeature = {};
            let canAdd = true;
            if (specificFeatureName == '') {
                if (category !== '') {
                    randomIndex = round(Math.random()*(app.staticData.features.filter(x => x.type == category).length - 1), 0);
                    randomFeature = JSON.parse(JSON.stringify(app.staticData.features.filter(x => x.type == category)[randomIndex]));
                    randomFeature.factor = 1;
                    randomFeature.id = city.features.length;
                } else {
                    randomIndex = Math.max(0, round(Math.random()*app.staticData.features.length - 1, 0));
                    randomFeature = JSON.parse(JSON.stringify(app.staticData.features[randomIndex]));
                    randomFeature.factor = 1;
                    randomFeature.id = city.features.length;
                };
            } else {
                randomFeature = app.staticData.features.filter(x => x.name == specificFeatureName)[0];
                randomFeature.factor = 1;
                randomFeature.id = city.features.length;
            };

            if (randomFeature.hasOwnProperty('category')) {
                if (city.production.filter(x => x.name == randomFeature.category)[0].limit < city.features.filter(x => x.type == 'BUILD' && x.category == randomFeature.category).reduce((a,b) => a + b.factor, 0)) {
                    (iteration < 3 ? app.addNewFeature(city, category, specificFeatureName, iteration + 1) : '');
                    canAdd = false;
                };
            };

            if (canAdd) {
                if (city.features.filter(x => x.name == randomFeature.name).length > 0) {
                    city.features.filter(x => x.name == randomFeature.name)[0].factor += randomFeature.factor;
                    resolve();
                } else {
                    city.features.push(randomFeature);
                    resolve();
                };
            };
        });
    };

    app.addNewEconAgent = function(city, type = '') {
        let newAgent = JSON.parse(JSON.stringify(app.staticData.defaultAgent));
        let possibleSyndicates = [];
        let randomSyndicate = {};
        let listOfComponents = [];
        let listOfProducts = [];
        
        if (type == '') {
            possibleSyndicates = app.staticData.syndicates.filter(x => x.type == 'production');
            randomSyndicate = possibleSyndicates[round(Math.random()*(possibleSyndicates.length - 1), 0)];
        } else {
            possibleSyndicates = app.staticData.syndicates.filter(x => x.subType == type);
            randomSyndicate = possibleSyndicates[round(Math.random()*(possibleSyndicates.length - 1), 0)];
        };

        newAgent.type = randomSyndicate.subType;
        newAgent.adj = randomSyndicate.adj;
        newAgent.syndicate = randomSyndicate.name;
        newAgent.productionRules = randomSyndicate.productionRules;

        if (newAgent.hasOwnProperty('productionRules')) {
            newAgent.productionRules.forEach(rule => {
                rule.components.forEach(component => listOfComponents.push(component.name));
                rule.results.forEach(result => listOfProducts.push(result.name));
            });
            listOfComponents = [...new Set(listOfComponents)];
            listOfProducts = [...new Set(listOfProducts)];
        };
        listOfComponents.map(goodName => {
            let marketData = app.market.goods.filter(x => x.name == goodName)[0];
            newAgent.inventories.push({
                name: goodName,
                type:'component',
                inventory: round(500 + Math.random()*99 + 1, 0),
                lowerPrice: round(marketData.basePrice*(0.5 - 0.2*Math.random()), 2),
                upperPrice: round(marketData.basePrice*(1.5 + 0.2*Math.random()), 2),
            });
        });
        listOfProducts.map(goodName => {
            let marketData = app.market.goods.filter(x => x.name == goodName)[0];
            newAgent.inventories.push({
                name: goodName,
                type:'product',
                inventory: round(30 + Math.random()*99 + 1, 0),
                lowerPrice: round(marketData.basePrice*(0.5 - 0.2*Math.random()), 2),
                upperPrice: round(marketData.basePrice*(1.5 + 0.2*Math.random()), 2),
            });
        });

        city.agents.push(newAgent);

    }

    app.calculateHistoricalMean = function() {
        app.market.goods.forEach(good => {
            let total = 0;
            let count = 0;
            app.market.dealHistoryPerTurn[app.currentTurn].deals.filter(x => x.name == good.name).forEach(deal => {
                if (deal.name == good.name) {
                    count++;
                    total += deal.pricePerUnit;
                };
            });
            good.historicalMean[app.currentTurn].value = (total == 0 ? good.basePrice : total/count);
        });
    };

    app.getAverageHistoricalMean = function(good) {
        let total = 0;
        let count = 0;
        good.historicalMean.forEach(turnData => {
            count++;
            total += turnData.value;
        });
        return total/count;
    };

    app.cityTaxCollection = function(city) {
        return new Promise(resolve => {
            city.stats.currentBudget.result += Math.ceil(city.stats.incomePerTurn.result);
            city.agents.forEach(agent => {
                let tax = Math.max(round(city.stats.keyRate.result*agent.wallet, 2), 100);
                agent.wallet -= tax;
                city.stats.currentBudget.result += tax;
            });
            resolve();
        });
    };

    app.manageCityAgentsWallet = function(city) {
        if (city.cityManagerAgent.wallet < 0) {
            //console.log(city.stats.name.base + ' invests ' + Math.abs(city.cityManagerAgent.wallet) + ' in its trade agent to compensate debt');
            city.stats.currentBudget.result -= Math.abs(city.cityManagerAgent.wallet);
            city.cityManagerAgent.wallet = 0;
        } else if (city.cityManagerAgent.wallet == 0) {
            let subsidy = city.stats.population.result//round(city.stats.currentBudget.result/3, 2);
            //console.log(city.stats.name.base + ' invests ' + subsidy + ' in its trade agent to stimulate trade');
            city.stats.currentBudget.result -= subsidy;
            city.cityManagerAgent.wallet += subsidy;
        };
    };

    app.agentProduction = function(agent, city) {
        return new Promise(resolve => {
            let shuffledRules = shuffle(agent.productionRules);
            let iterateOnProductionRule = (ruleIndex = 0, i = 1) => {
                let haveEnough = true;
                shuffledRules[ruleIndex].components.forEach(component => {
                    (agent.inventories.filter(x => x.name == component.name)[0].inventory >= i*component.quantity ? '' : haveEnough = false);
                });

                if (haveEnough) {
                    iterateOnProductionRule(ruleIndex, i + 1);
                } else {
                    shuffledRules[ruleIndex].components.forEach(component => {
                        agent.inventories.filter(x => x.name == component.name)[0].inventory -= (i - 1)*component.quantity;
                    });
                    shuffledRules[ruleIndex].results.forEach(result => {
                        agent.inventories.filter(x => x.name == result.name)[0].inventory += (i - 1)*result.quantity + city.production.filter(x => x.name == result.name)[0].mod;
                    });
                    (ruleIndex + 1 < shuffledRules.length ? iterateOnProductionRule(ruleIndex + 1, 0) : resolve('Production for agent is done!'));
                };
            };

            iterateOnProductionRule();
        });
    };

    app.citySubstractUpkeep = function() {
        app.cityData.forEach(city => {
            city.upkeep.forEach(upkeep => {
                city.cityManagerAgent.inventories.filter(x => x.name == upkeep.name)[0].inventory -= upkeep.need;
                //console.log(city.stats.name.base + ' consumes ' + upkeep.need + ' units of ' + upkeep.name + ', resulting inventory is ' + city.cityManagerAgent.inventories.filter(x => x.name == upkeep.name)[0].inventory);
            })
        });
    };

    app.generateCityListings = function(city, i = 0) {
        let item = city.cityManagerAgent.inventories[i];
        let upkeep = city.upkeep[i];
        let good = app.market.goods[i];
        let currentHistoricalMean = (good.historicalMean.length > 0 ? good.historicalMean.reduce((a, b) => a + b.value, 0)/good.historicalMean.length : good.basePrice);

        if (item.inventory < upkeep.need)
            app.market.currentAsks.push({
                cityID: city.id,
                agentIndex: -1,
                goodName: item.name,
                quantity: upkeep.need - item.inventory,
                price: currentHistoricalMean,
            });

        i++;
        if (i < city.cityManagerAgent.inventories.length) {
            app.generateCityListings(city, i);
        };
    };

    app.generateAgentListings = function(agent, cityID, agentCityIndex, i = 0) {
        if (agent.inventories.length > 0) {
            let item = agent.inventories[i];
            let good = app.market.goods.filter(x => x.name == item.name)[0];
            let mean = (good.historicalMean.length > 0 ? good.historicalMean.reduce((a, b) => a + b.value, 0)/good.historicalMean.length : good.basePrice);

            if (item.type == 'product' && item.inventory > 0) {
                //for sellers favorability is based on a mean, plus the check to not go into >1
                //let favorability = Math.min(1, 1/((item.lowerPrice + (item.upperPrice + item.lowerPrice)/2)/(mean)));
                let favorability = (mean > item.upperPrice ? 1 : (mean < item.lowerPrice ? 0 : findNumberPosition(mean, item.lowerPrice, item.upperPrice)));

                /*console.log('Seller favorability ' + favorability, 'lowerPrice ' + item.lowerPrice, 'mean ' + mean, 'upperPrice ' + item.upperPrice,);
                console.log('inventory: ' + item.inventory);
                console.log({
                    cityID: cityID,
                    agentIndex: agentCityIndex,
                    goodName: item.name,
                    quantity: round(favorability*item.inventory, 0),
                    price: item.upperPrice,
                });
                console.log();*/

                if (round(favorability*item.inventory, 0) > 0) 
                    app.market.currentLots.push({
                        cityID: cityID,
                        agentIndex: agentCityIndex,
                        goodName: item.name,
                        quantity: round(favorability*item.inventory, 0),
                        price: item.upperPrice,
                    });
            } else if (item.type == 'component') {
                let mean = (good.historicalMean.length > 0 ? good.historicalMean.reduce((a, b) => a + b.value, 0)/good.historicalMean.length : good.basePrice);
                //for buyers favorability is the reversed (1 - x) favorability of a seller, plus the check to not go into negative
                //let favorability = Math.max(0, 1 - 1/((item.lowerPrice + (item.upperPrice + item.lowerPrice)/2)/(mean)));
                let favorability = (mean > item.upperPrice ? 0 : (mean < item.lowerPrice ? 1 : 1 - findNumberPosition(mean, item.lowerPrice, item.upperPrice)));
                
                /*console.log('Buyer favorability ' + favorability, 'lowerPrice ' + item.lowerPrice, 'mean ' + mean, 'upperPrice ' + item.upperPrice,);
                console.log('0.9*agent.wallet: ' + 0.9*agent.wallet, 'item.lowerPrice: ' + item.lowerPrice, '1000 - item.inventory: ' + (1000 - item.inventory));
                console.log({
                    cityID: cityID,
                    agentIndex: agentCityIndex,
                    goodName: item.name,
                    quantity: Math.min(round(favorability*((0.9*agent.wallet)/item.lowerPrice), 0), 1000 - item.inventory),
                    price: item.lowerPrice,
                });
                console.log();*/

                if (Math.min(round(favorability*((0.9*agent.wallet)/item.lowerPrice), 0), 1000 - item.inventory) > 0)
                    app.market.currentAsks.push({
                        cityID: cityID,
                        agentIndex: agentCityIndex,
                        goodName: item.name,
                        quantity: Math.min(round(favorability*((0.9*agent.wallet)/item.lowerPrice), 0), 1000 - item.inventory),
                        price: item.lowerPrice,
                    });
            };

            i++;
            if (i < agent.inventories.length) {
                app.generateAgentListings(agent, cityID, agentCityIndex, i);
            };  
        };
    };

    app.matchMarketListings = function() {
        return new Promise(resolve => {
            let iterateOnGoods = j => {
                let good = app.market.goods[j];
                let shuffledLots = shuffle(app.market.currentLots.filter(x => x.goodName == good.name));
                let shuffledAsks = shuffle(app.market.currentAsks.filter(x => x.goodName == good.name));
                let sortedLots = shuffledLots.sort((a, b) => (a.price > b.price) ? 1 : -1);
                let sortedAsks = shuffledAsks.sort((a, b) => (a.price < b.price) ? 1 : -1);
                let currentTurnMeanPriceForGood = [];

                let iterateOnDeals = i => {
                    let buyer = sortedAsks[0];
                    let seller = sortedLots[0];

                    /*console.log(good.name);
                    console.log(i);
                    console.log(sortedAsks[0]);
                    console.log(sortedLots[0]);*/

                    let quantity = Math.min(buyer.quantity, seller.quantity);
                    let clearingPrice = (buyer.price + seller.price)/2;
                    let currentHistoricalMean = (good.historicalMean.length > 0 ? good.historicalMean.reduce((a, b) => a + b.value, 0)/good.historicalMean.length : good.basePrice);
                    let currentMarketSize = app.market.dealHistoryPerTurn.filter(x => x.good == good.name).reduce((a, b) => a + b.quantity, 1);
                    let supply = 5*currentHistoricalMean**0.5;
                    let demand = 3*currentHistoricalMean**(-2);

                    /*console.log('currentHistoricalMean', currentHistoricalMean);
                    console.log('currentMarketSize', currentMarketSize);
                    console.log('supply', supply);
                    console.log('demand', demand);*/

                    let buyerAgent = (buyer.agentIndex == -1 ? app.cityData.filter(x => x.id == buyer.cityID)[0].cityManagerAgent : app.cityData.filter(x => x.id == buyer.cityID)[0].agents[buyer.agentIndex]);
                    let buyerAgentPriceBeliefs = buyerAgent.inventories.filter(x => x.name == buyer.goodName)[0];
                    let buyerMarketShare = buyerAgent.dealHistory.filter(x => x.type == 'lot' && x.good == good.name).reduce((a, b) => a + b.quantity, 0)/currentMarketSize;
                    let buyerDisplacement = (Math.abs((buyerAgentPriceBeliefs.upperPrice + buyerAgentPriceBeliefs.lowerPrice)/2 - clearingPrice))/((buyerAgentPriceBeliefs.upperPrice + buyerAgentPriceBeliefs.lowerPrice)/2);
                    
                    let sellerAgent = (seller.agentIndex == -1 ? app.cityData.filter(x => x.id == seller.cityID)[0].cityManagerAgent : app.cityData.filter(x => x.id == seller.cityID)[0].agents[seller.agentIndex]);
                    let sellerAgentPriceBeliefs = sellerAgent.inventories.filter(x => x.name == seller.goodName)[0];
                    let sellerMarketShare = sellerAgent.dealHistory.filter(x => x.type == 'lot' && x.good == good.name).reduce((a, b) => a + b.quantity, 0)/currentMarketSize;
                    //console.log('Sellers market share: ' + sellerAgent.dealHistory.filter(x => x.type == 'lot' && x.good == good.name).reduce((a, b) => a + b.quantity, 0) + ' out of ' + currentMarketSize + ', ' + sellerMarketShare);
                    let sellerWeight = seller.quantity/(seller.quantity + quantity);
                    let sellerDisplacment = sellerWeight*(sellerAgentPriceBeliefs.upperPrice + sellerAgentPriceBeliefs.lowerPrice)/2;

                    /*console.log('Buyer is ' + app.cityData.filter(x => x.id == buyer.cityID)[0].stats.name.base + ' agent #' + (buyer.agentIndex + 1));
                    console.log('Seller is ' + app.cityData.filter(x => x.id == seller.cityID)[0].stats.name.base + ' agent #' + (seller.agentIndex + 1));*/
                    
                    if (quantity > 0) {
                        
                        buyer.quantity -= quantity;
                        seller.quantity -= quantity;
                        buyerAgent.inventories.filter(x => x.name == buyer.goodName)[0].inventory += quantity;
                        sellerAgent.inventories.filter(x => x.name == seller.goodName)[0].inventory -= quantity;
                        buyerAgent.wallet -= round(quantity*clearingPrice, 2);
                        sellerAgent.wallet += round(quantity*clearingPrice, 2);

                        currentTurnMeanPriceForGood.push(clearingPrice);

                        /*console.log('Deal between ' + buyerAgent.adj + ' from ' + app.cityData.filter(x => x.id == buyer.cityID)[0].stats.name.base + ' (buyer) and ' + sellerAgent.adj + ' from ' + app.cityData.filter(x => x.id == seller.cityID)[0].stats.name.base + ' (seller)');
                        console.log(quantity + ' of ' + good.name + ' for ' + round(clearingPrice*quantity, 2) + '$ total, ' + clearingPrice + '$ per unit.');
                        console.log();*/

                        app.market.dealHistoryPerTurn.push({
                            turn: app.currentTurn,
                            good: good.name,
                            quantity: quantity
                        });

                        buyerAgent.dealHistory.push({
                            turn: app.currentTurn,
                            type: 'ask',
                            good: good.name,
                            quantity: quantity
                        });
                        sellerAgent.dealHistory.push({
                            turn: app.currentTurn,
                            type: 'lot',
                            good: good.name,
                            quantity: quantity
                        });
                    };

                    //buyer price adjustment
                    //if at least 50% of offer filled
                    if (buyer.quantity <= quantity) {
                        buyerAgentPriceBeliefs.lowerPrice += round(buyerAgentPriceBeliefs.upperPrice/10, 2);
                        buyerAgentPriceBeliefs.upperPrice -= round(buyerAgentPriceBeliefs.upperPrice/10, 2);
                    } else {
                        buyerAgentPriceBeliefs.upperPrice += round(buyerAgentPriceBeliefs.upperPrice/10, 2);
                    };

                    if (buyerMarketShare < 1 && buyerAgent.inventories.filter(x => x.name == buyer.goodName)[0].inventory < 3000/4) {
                        //console.log('Buyer had no full Market Share and less than ' + 3000/4 + ' in inventory, upping buyers beliefs by ' + buyerDisplacement);
                        buyerAgentPriceBeliefs.lowerPrice += round(buyerDisplacement, 2);
                        buyerAgentPriceBeliefs.upperPrice += round(buyerDisplacement, 2);
                        
                    } else if (buyer.price > clearingPrice) {
                        //console.log('Seller price was higher than clearing pice, lowering buyers beliefs by ' + (seller.price - clearingPrice)*1.1);
                        buyerAgentPriceBeliefs.lowerPrice -= round((seller.price - clearingPrice)*1.1, 2);
                        buyerAgentPriceBeliefs.upperPrice -= round((seller.price - clearingPrice)*1.1, 2);
                    } else if (supply > demand && seller.price > currentHistoricalMean) {
                        //console.log('Supply was higher than demand and seller price was higher than current historical mean, lowering buyers beliefs by ' + (seller.price - currentHistoricalMean)*1.1);
                        buyerAgentPriceBeliefs.lowerPrice -= round((seller.price - currentHistoricalMean)*1.1, 2);
                        buyerAgentPriceBeliefs.upperPrice -= round((seller.price - currentHistoricalMean)*1.1, 2);
                    } else if (demand > supply) {
                        //console.log('Demand was higher than supply, upping buyers beliefs by ' + currentHistoricalMean/5);
                        buyerAgentPriceBeliefs.lowerPrice += round(currentHistoricalMean/5, 2);
                        buyerAgentPriceBeliefs.upperPrice += round(currentHistoricalMean/5, 2);
                    } else {
                        //console.log('No conditions were met, lowering buyers beliefs by ' + currentHistoricalMean/5);
                        buyerAgentPriceBeliefs.lowerPrice -= round(currentHistoricalMean/5, 2);
                        buyerAgentPriceBeliefs.upperPrice -= round(currentHistoricalMean/5, 2);
                    };

                    //seller price adjustment
                    //if at least 50% of offer filled
                    if (quantity == 0) {
                        //console.log('Seller couldnt sell anything, lowering sellers beliefs by ' + sellerDisplacment/6);
                        sellerAgentPriceBeliefs.lowerPrice -= round(sellerDisplacment/6, 2);
                        sellerAgentPriceBeliefs.upperPrice -= round(sellerDisplacment/6, 2);
                    } else if (sellerMarketShare < 0.75) {
                        //console.log('Sellers market share is less than 0.75, lowering sellers beliefs by ' + sellerDisplacment/7);
                        sellerAgentPriceBeliefs.lowerPrice -= round(sellerDisplacment/7, 2);
                        sellerAgentPriceBeliefs.upperPrice -= round(sellerDisplacment/7, 2);
                    } else if (seller.price < clearingPrice) {
                        //console.log('Sellers price was lower than a clearing price, upping sellers beliefs by ' + sellerWeight*(clearingPrice - seller.price)*1.2);
                        sellerAgentPriceBeliefs.lowerPrice += round(sellerWeight*(clearingPrice - seller.price)*1.2, 2);
                        sellerAgentPriceBeliefs.upperPrice += round(sellerWeight*(clearingPrice - seller.price)*1.2, 2);
                    } else if (demand > supply) {
                        //console.log('Demand was higher than supply, upping sellers beliefs by ' + currentHistoricalMean/5);
                        buyerAgentPriceBeliefs.lowerPrice += round(currentHistoricalMean/5, 2);
                        buyerAgentPriceBeliefs.upperPrice += round(currentHistoricalMean/5, 2);
                    } else {
                        //console.log('No conditions were met, lowering sellers beliefs by ' + currentHistoricalMean/5);
                        buyerAgentPriceBeliefs.lowerPrice -= round(currentHistoricalMean/5, 2);
                        buyerAgentPriceBeliefs.upperPrice -= round(currentHistoricalMean/5, 2);
                    };

                    //(buyerAgentPriceBeliefs.lowerPrice > buyerAgentPriceBeliefs.upperPrice ? buyerAgentPriceBeliefs.lowerPrice = buyerAgentPriceBeliefs.upperPrice : '');
                    //(sellerAgentPriceBeliefs.lowerPrice > sellerAgentPriceBeliefs.upperPrice ? sellerAgentPriceBeliefs.lowerPrice = sellerAgentPriceBeliefs.upperPrice : '');
                    

                    (buyer.quantity < 1 ? sortedAsks.splice(0, 1) : '');
                    (seller.quantity < 1 ? sortedLots.splice(0, 1) : '');

                    i++;
                    
                    //console.log('For ' + good.name, 'Lots: ' + sortedLots.length, 'Asks: ' + sortedAsks.length);

                    if (sortedLots.length > 0 && sortedAsks.length > 0) iterateOnDeals(i);
                };

                if (sortedLots.length > 0 && sortedAsks.length > 0) iterateOnDeals(0);
                j++;
                if (currentTurnMeanPriceForGood.length > 0) {
                    app.market.goods.filter(x => x.name == good.name)[0].historicalMean.push({
                        turn: app.currentTurn,
                        value: currentTurnMeanPriceForGood.reduce((a, b) => a + b)/currentTurnMeanPriceForGood.length
                    });
                };

                if (j < app.market.goods.length)
                    iterateOnGoods(j)
                else
                    resolve();
            };

            iterateOnGoods(0);
        });
    };

    app.bankruptAndReplaceBrokeAgents = function() {
        app.cityData.forEach(city => {
            city.agents.forEach((agent, index) => {
                if (agent.wallet < 0) {
                    city.agents.splice(index, 1);
                    app.addNewEconAgent(city, app.market.topAgentType);
                };
            });
        });
    }

    app.determineTopAgentType = function() {
        let leaderBoard = [];
        app.staticData.agentTypes.forEach(type => {
            leaderBoard.push({
                type: type.name,
                totalProfit: 0,
            });
        })
        app.cityData.forEach(city => {
            city.agents.forEach(agent => {
                leaderBoard.filter(x => x.type == agent.type)[0].totalProfit += agent.wallet;
            })
        });

        leaderBoard.sort((a, b) => (a.totalProfit < b.totalProfit) ? 1 : -1);
        //console.log(leaderBoard);
        app.market.topAgentType = leaderBoard[0].type;
    };

    app.refreshCards = function() {
        return new Promise(resolve => {
            $('.generated').remove();
            $('.turn-counter').text(app.currentTurn);
            Promise.all(app.cityData.map(city => {
                app.generateCityCards(city);
            })).then(() => {
                $(app.components.spinner).hide();
                resolve();
            });
        });
    };

    $(function() {
        app.templates.cityWrapper = document.querySelector('.city-wrapper.template');
        app.templates.btn = document.querySelector('.btn.template');
        app.containers.cityContainer = document.querySelector('.city-list.container');
        app.containers.anchorsContainer = document.querySelector('.city-anchors.container');
        app.components.spinner = document.querySelector('.spinner-container');
        
        //initial routines
        let promise = new Promise (resolve => {
            
            resolve();
        });

        promise.then(() => {
            setTimeout(() => {
                for (let i = 0; i < 10; i++) {
                    $('.add-new-btn')[0].click();
                };
            }, 100);
        });
        
        $('.calculate-btn').on('click', () => {
            $(app.components.spinner).show();
            Promise.all(app.cityData.map(city => {
                return new Promise (resolve => {
                    app.calculateCity(city).then(() => {
                        app.calculateCityFeatures(city).then(() => {
                            resolve();
                        });
                    });
                });
            })).then(() => {
                app.refreshCards();
            });
        });

        $('.add-new-btn').on('click', () => {
            $(app.components.spinner).show();
            app.generateNewCity();
            let newCity = app.cityData[(app.cityData.length > 0 ? app.cityData.length - 1 : app.cityData.length)];
            app.calculateCity(newCity).then(() => {
                app.calculateCityFeatures(newCity).then(() => {
                    app.refreshCards();
                });
            });
        });

        $('.debug-1-fn-btn').on('click', () => {
            $(app.components.spinner).show();
            app.market.currentLots = [];
            app.market.currentAsks = [];
            app.currentTurn++;
            app.citySubstractUpkeep();
            console.log();
            console.log('Turn #' + app.currentTurn);
            console.log();
            Promise.all(app.cityData.map(city => {
                return new Promise (resolve => {
                    let iterateAgents = i => {
                        //console.log('Producing for ' + city.stats.name.base + "'s agent #" + i);
                        app.agentProduction(city.agents[i], city).then(() => {
                            //console.log('Making listings for ' + city.stats.name.base + "'s agent #" + i);
                            app.generateAgentListings(city.agents[i], city.id, i);
                            i++;
                                if (i < city.agents.length)
                                    iterateAgents(i)
                                else
                                    resolve();
                        });
                    };
                    app.generateCityListings(city);
                    iterateAgents(0);
                });
            })).then(() => {
                //console.log('Time to call the clearing house!');
                app.matchMarketListings().then(() => {
                    app.determineTopAgentType();
                    for (let i = 0; i < app.cityData.length; i++) {
                        app.cityTaxCollection(app.cityData[i]).then(() => {
                            app.manageCityAgentsWallet(app.cityData[i]);
                            app.bankruptAndReplaceBrokeAgents();
                        });
                    };
                    app.refreshCards();
                });
            });
        });

        $('.debug-2-fn-btn').on('click', () => {
            let promise = new Promise(resolve => {
                let loopClick = i => {
                    setTimeout(() => {
                        $('.debug-1-fn-btn')[0].click();
                        i++;
                        (i > 29 ? resolve() : loopClick(i));
                    }, 700);
                };
                loopClick(0);
            });
            promise.then(() => console.log('Done clicking!'));
        });

        $('.save-btn').on('click', () => {
            window.localStorage['cityData'] = JSON.stringify(app.cityData);
        });

        $('.load-btn').on('click', () => {
            app.cityData = JSON.parse(window.localStorage['cityData']);
            app.refreshCards();
        });

        $('.log-data-btn').on('click', () => {
            console.log(app);
            console.log();
            app.market.goods.forEach(good => {
                let shuffledLots = shuffle(app.market.currentLots.filter(x => x.goodName == good.name));
                let shuffledAsks = shuffle(app.market.currentAsks.filter(x => x.goodName == good.name));
                let sortedLots = shuffledLots.sort((a, b) => (a.price > b.price) ? 1 : -1);
                let sortedAsks = shuffledAsks.sort((a, b) => (a.price < b.price) ? 1 : -1);
                console.log(good.name);
                console.log('Asks');
                console.log(sortedAsks);
                console.log();
                console.log('Lots');
                console.log(sortedLots);
                console.log();
            });
        });
        
        
    })
    
    function round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    };

    function shuffle(array) {
        let shuffledArray = array;
        let currentIndex = shuffledArray.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = shuffledArray[currentIndex];
          shuffledArray[currentIndex] = shuffledArray[randomIndex];
          shuffledArray[randomIndex] = temporaryValue;
        }
      
        return shuffledArray;
      };

    function findNumberPosition(number, lower, upper) {
        let array = [];
        for (let i = lower; i < upper; i += 0.05) {
            array.push(i);
        };

        let L = 0;
        let R = array.length - 1;
        let m = 0;

        while (L <= R) {
            m = Math.floor((L + R)/2);
            if (array[m] + 0.1 < number)
                L = m + 1
            else if (array[m] - 0.1 > number)
                R = m - 1
            else
                return m/(array.length - 1)
        };

        return 0.5;
    };

})();