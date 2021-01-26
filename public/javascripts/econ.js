(function() {
    'use sctrict';

    let app = {
        currentTurn: 0,
        cityData: [],
        market: {
            goods: [
                {
                    name: 'Water',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        },
                    ],
                    tier: 0,
                    production: [],
                    isUpkeep: true,
                    prosperityUpkeepMod: 0.01,
                    popUpkeepMod: 2*7,
                    isFuel: false
                },
                {
                    name: 'Biomass',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 1,
                    production: [
                        {
                            good: 'Water',
                            quantity: 2
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: -0.08,
                    popUpkeepMod: 0.5*7,
                    isFuel: false
                },
                {
                    name: 'Fertilizers',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 1,
                    production: [
                        {
                            good: 'Water',
                            quantity: 2
                        },
                    ],
                    isUpkeep: false,
                    isFuel: false
                },
                {
                    name: 'Ethanol',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 2,
                    production: [
                        {
                            good: 'Biomass',
                            quantity: 1
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: -0.04,
                    popUpkeepMod: 0.25*7,
                    isFuel: true
                },
                {
                    name: 'Farming Produce',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 2,
                    production: [
                        {
                            good: 'Water',
                            quantity: 2
                        },
                        {
                            good: 'Fertilizers',
                            quantity: 1
                        },
                        {
                            good: 'Ethanol',
                            quantity: 1
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: 0.04,
                    popUpkeepMod: 0.75*7,
                    isFuel: false
                },
                {
                    name: 'Wood',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 2,
                    production: [
                        {
                            good: 'Water',
                            quantity: 2
                        },
                        {
                            good: 'Fertilizers',
                            quantity: 1
                        },
                        {
                            good: 'Ethanol',
                            quantity: 2
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: 0.02,
                    popUpkeepMod: 0.1,
                    isFuel: false
                },
                {
                    name: 'Medical Supplies',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 2,
                    production: [
                        {
                            good: 'Water',
                            quantity: 1
                        },
                        {
                            good: 'Farming Produce',
                            quantity: 2
                        },
                        {
                            good: 'Ethanol',
                            quantity: 4
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: 0.01,
                    popUpkeepMod: 0.05*7,
                    isFuel: false
                },
                {
                    name: 'Prima Diesel',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 3,
                    production: [
                        {
                            good: 'Ethanol',
                            quantity: 2
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: 0.02,
                    popUpkeepMod: 0.05*7,
                    isFuel: true
                },
                {
                    name: 'Ready Meals',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 3,
                    production: [
                        {
                            good: 'Water',
                            quantity: 1
                        },
                        {
                            good: 'Prima Diesel',
                            quantity: 1
                        },
                        {
                            good: 'Farming Produce',
                            quantity: 2
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: -0.04,
                    popUpkeepMod: 0.5*7,
                    isFuel: false
                },
                {
                    name: 'Industrial Ores',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 3,
                    production: [
                        {
                            good: 'Prima Diesel',
                            quantity: 2
                        },
                    ],
                    isUpkeep: false,
                    isFuel: false
                },
                {
                    name: 'Textiles',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 3,
                    production: [
                        {
                            good: 'Water',
                            quantity: 1
                        },
                        {
                            good: 'Prima Diesel',
                            quantity: 1
                        },
                        {
                            good: 'Farming Produce',
                            quantity: 4
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: 0.04,
                    popUpkeepMod: 0.1,
                    isFuel: false
                },
                {
                    name: 'Granite',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 3,
                    production: [
                        {
                            good: 'Prima Diesel',
                            quantity: 1
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: 0.04,
                    popUpkeepMod: 0.1,
                    isFuel: false
                },
                {
                    name: 'Industrial Alloys',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 3,
                    production: [
                        {
                            good: 'Prima Diesel',
                            quantity: 4
                        },
                        {
                            good: 'Industrial Ores',
                            quantity: 4
                        },
                    ],
                    isUpkeep: false,
                    isFuel: false
                },
                {
                    name: 'Small Parts',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 3,
                    production: [
                        {
                            good: 'Prima Diesel',
                            quantity: 4
                        },
                        {
                            good: 'Industrial Alloys',
                            quantity: 2
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: 0.04,
                    popUpkeepMod: 0.05,
                    isFuel: false
                },
                {
                    name: 'Industrial Goods',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 3,
                    production: [
                        {
                            good: 'Prima Diesel',
                            quantity: 4
                        },
                        {
                            good: 'Industrial Alloys',
                            quantity: 1
                        },
                        {
                            good: 'Textiles',
                            quantity: 1
                        },
                        {
                            good: 'Wood',
                            quantity: 1
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: 0.04,
                    popUpkeepMod: 0.025*7,
                    isFuel: false
                },
                {
                    name: 'Weapon Parts',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 3,
                    production: [
                        {
                            good: 'Prima Diesel',
                            quantity: 4
                        },
                        {
                            good: 'Industrial Alloys',
                            quantity: 2
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: 0.02,
                    popUpkeepMod: 0,
                    isFuel: false
                },
                {
                    name: 'Prima Block',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 4,
                    production: [
                        {
                            good: 'Prima Diesel',
                            quantity: 2
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: 0.01,
                    popUpkeepMod: 0,
                    isFuel: true
                },
                {
                    name: 'Prima Ores',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 4,
                    production: [
                        {
                            good: 'Prima Block',
                            quantity: 2
                        },
                    ],
                    isUpkeep: false,
                    isFuel: false
                },
                {
                    name: 'Specialized Alloys',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 4,
                    production: [
                        {
                            good: 'Prima Block',
                            quantity: 2
                        },
                        {
                            good: 'Prima Ores',
                            quantity: 4
                        },
                        {
                            good: 'Industrial Alloys',
                            quantity: 2
                        },
                    ],
                    isUpkeep: false,
                    isFuel: false
                },
                {
                    name: 'Alchemical Tools',
                    basePrice: 1,
                    packageSize: 1,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    tier: 4,
                    production: [
                        {
                            good: 'Prima Block',
                            quantity: 2
                        },
                        {
                            good: 'Specialized Alloys',
                            quantity: 2
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: 0.02,
                    popUpkeepMod: 0,
                    isFuel: false
                },
                {
                    name: 'Large Parts',
                    basePrice: 1,
                    packageSize: 1,
                    tier: 4,
                    historicalMean: [
                        {
                            turn: 0,
                            value: 0
                        }
                    ],
                    production: [
                        {
                            good: 'Prima Block',
                            quantity: 2
                        },
                        {
                            good: 'Industrial Alloys',
                            quantity: 4
                        },
                        {
                            good: 'Specialized Alloys',
                            quantity: 2
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: 0.04,
                    popUpkeepMod: 0,
                    isFuel: false
                },
            ],
            currentAsks: [],
            currentLots: [],
            dealHistoryPerTurn: [
                {
                    turn: 0,
                    deals: []
                },
            ]
        },
        turnData: [],
        staticData: {
            defaultCity: {
                id: 0,
                stats: {
                    name: {
                        base: 'Agandor',
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
                        base: 150,
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
                        base: 0.05,
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
                        base: 0.05,
                        result: 0
                    },
                    //economics
                    keyRate: {
                        base: 0.05,
                        result: 0
                    },
                    tarrifs: {
                        base: 0,
                        result: 0
                    },
                    rent: {
                        base: 50,
                        result: 0
                    },
                    services: {
                        base: 50,
                        result: 0
                    },
                    corruption: {
                        base: 0.1,
                        result: 0
                    },
                    basicIncomePerTurn: {
                        base: 0,
                        result: 0
                    },
                    currentBudget: {
                        base: 0,
                        result: 0
                    },
                    productivity: {
                        base: 0,
                        result: 0
                    },
                    integration: {
                        base: 0,
                        result: 0
                    },
                },
                production: [],
                prices: [],
                politics: [],
                features: [],
                agent: {
                    capital: 1000,
                    priceBeliefs: [],
                    inventories: []
                },
                upkeep: [],
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
                {
                    name: 'Swamp',
                    produce: [
                        {
                            name: 'Water',
                            value: 2
                        }
                    ],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Waterfall',
                    produce: [
                        {
                            name: 'Water',
                            value: 16
                        }
                    ],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Vulcano',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Industrial Alloys',
                            value: 0.05
                        },
                        {
                            name: 'Specialized Alloys',
                            value: 0.05
                        },
                        {
                            name: 'Small Parts',
                            value: 0.05
                        },
                        {
                            name: 'Alchemical Tools',
                            value: 0.05
                        },
                        {
                            name: 'Large Parts',
                            value: 0.05
                        }
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Mountain',
                    produce: [
                        {
                            name: 'Water',
                            value: 8
                        },
                    ],
                    prodMod: [
                        {
                            name: 'Granite',
                            value: 0.03
                        },
                        {
                            name: 'Industrial Ores',
                            value: 0.03
                        },
                        {
                            name: 'Prima Ores',
                            value: 0.03
                        },
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Hot Spring',
                    produce: [
                        {
                            name: 'Water',
                            value: 8
                        }
                    ],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Arid Highland',
                    produce: [
                        {
                            name: 'Water',
                            value: 2
                        }
                    ],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Green Hill',
                    produce: [
                        {
                            name: 'Water',
                            value: 4
                        },
                    ],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Glacier',
                    produce: [
                        {
                            name: 'Water',
                            value: 16
                        }
                    ],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Oasis',
                    produce: [
                        {
                            name: 'Water',
                            value: 4
                        }
                    ],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Searing Desert',
                    produce: [],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Cave System',
                    produce: [
                        {
                            name: 'Water',
                            value: 2
                        }
                    ],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Bountiful Plain',
                    produce: [
                        {
                            name: 'Water',
                            value: 4
                        }
                    ],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Dense Jungle',
                    produce: [
                        {
                            name: 'Water',
                            value: 4
                        }
                    ],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Rugged Woods',
                    produce: [
                        {
                            name: 'Water',
                            value: 4
                        }
                    ],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Sea Shore',
                    produce: [
                        {
                            name: 'Water',
                            value: 2
                        }
                    ],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Great River',
                    produce: [
                        {
                            name: 'Water',
                            value: 16
                        }
                    ],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Prosperous Mesa',
                    produce: [
                        {
                            name: 'Water',
                            value: 2
                        }
                    ],
                    prodMod: [
                        {
                            name: 'Granite',
                            value: 0.05
                        },
                        {
                            name: 'Industrial Ores',
                            value: 0.05
                        },
                        {
                            name: 'Prima Ores',
                            value: 0.05
                        },
                    ],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Fuming Bog',
                    produce: [
                        {
                            name: 'Water',
                            value: 2
                        }
                    ],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Fair Tundra',
                    produce: [
                        {
                            name: 'Water',
                            value: 4
                        }
                    ],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Deep Sinkhole',
                    produce: [],
                    prodMod: [],
                    statMod: [],
                    type: 'GEO',
                },
                {
                    name: 'Fuel Station',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Ethanol',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD',
                },
                {
                    name: 'Prima Refiner',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Prima Diesel',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD',
                },
                {
                    name: 'Prima Condenser',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Prima Block',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD',
                },
                {
                    name: 'School',
                    produce: [],
                    prodMod: [],
                    statMod: [
                        {
                            name: 'socialTrust',
                            value: 0.05
                        },
                        {
                            name: 'prosperity',
                            value: 1
                        },
                    ],
                    type: 'BUILD',
                },
                {
                    name: 'University',
                    produce: [],
                    prodMod: [],
                    statMod: [
                        {
                            name: 'socialTrust',
                            value: 0.05
                        },
                        {
                            name: 'prosperity',
                            value: 2
                        },
                    ],
                    type: 'BUILD',
                },
                {
                    name: 'Court',
                    produce: [],
                    prodMod: [],
                    statMod: [
                        {
                            name: 'socialTrust',
                            value: 0.05
                        },
                        {
                            name: 'crime',
                            value: -0.05
                        },
                    ],
                    type: 'BUILD',
                },
                {
                    name: 'Port',
                    produce: [],
                    prodMod: [],
                    statMod: [
                        {
                            name: 'productivity',
                            value: 0.05
                        },
                    ],
                    type: 'BUILD',
                },
                {
                    name: 'Wharf',
                    produce: [],
                    prodMod: [],
                    statMod: [
                        {
                            name: 'integration',
                            value: 0.05
                        },
                    ],
                    type: 'BUILD',
                },
                {
                    name: 'Trading Depo',
                    produce: [],
                    prodMod: [],
                    statMod: [
                        {
                            name: 'integration',
                            value: 0.5
                        },
                    ],
                    type: 'BUILD',
                },
                {
                    name: 'Fortification',
                    produce: [],
                    prodMod: [],
                    statMod: [
                        {
                            name: 'defences',
                            value: 0.1
                        },
                    ],
                    type: 'BUILD',
                },
                {
                    name: 'Agricultural Farm',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Farming Produce',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD'
                },
                {
                    name: 'Biomass Farm',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Biomass',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD'
                },
                {
                    name: 'Textiles Farm',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Textiles',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD'
                },
                {
                    name: 'Medical Gardens',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Medical Supplies',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD'
                },
                {
                    name: 'Tree Plantation',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Wood',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD'
                },
                {
                    name: 'Fertilizers Factory',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Fertilizers',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD'
                },
                {
                    name: 'Medical Lab',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Medical Supplies',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD'
                },
                {
                    name: 'MRE Factory',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Ready Meals',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD'
                },
                {
                    name: 'Textiles Factory',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Textiles',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD'
                },
                {
                    name: 'Goods Factory',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Industrial Goods',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD'
                },
                {
                    name: 'Granite Quarry',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Granite',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD',
                },
                {
                    name: 'Industrial Ore Mine',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Industrial Ores',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD'
                },
                {
                    name: 'Prima Ore Mine',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Prima Ores',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD'
                },
                {
                    name: 'Industrial Alloy Foundry',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Industrial Alloys',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD'
                },
                {
                    name: 'Specialized Alloy Foundry',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Specialized Alloys',
                            value: 0.5
                        },
                    ],
                    statMod: [],
                    type: 'BUILD'
                },
                {
                    name: 'Illegal Chem Lab',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Fertilizers',
                            value: 0.25
                        },
                        {
                            name: 'Medical Supplies',
                            value: 0.25
                        },
                    ],
                    statMod: [
                        {
                            name: 'crime',
                            value: 0.05
                        },
                    ],
                    type: 'BUILD'
                },
                {
                    name: 'Gang Hideout',
                    produce: [],
                    prodMod: [],
                    statMod: [
                        {
                            name: 'crime',
                            value: 0.1
                        },
                    ],
                    type: 'BUILD',
                },
                {
                    name: 'Artesian Pump',
                    produce: [
                        {
                            name: 'Water',
                            value: 16
                        },
                    ],
                    prodMod: [],
                    statMod: [],
                    type: 'BUILD',
                },
            ],
            syndicates: [
                {
                    name: 'Iron Syndicate',
                    favGovernment: '',
                    favProperty: '',
                    description: 'Manages the railroads'
                },
                {
                    name: 'Provisions & Produce Syndicate',
                    favGovernment: '',
                    favProperty: '',
                    description: 'Produces food rations'
                },
                {
                    name: 'United Trading Network',
                    favGovernment: '',
                    favProperty: '',
                    description: 'Loves trading and elections'
                },
                {
                    name: 'Assembly for Traditions',
                    favGovernment: '',
                    favProperty: '',
                    description: 'Neocons full or lies about the glorious past'
                },
                {
                    name: 'Trading Cooperative',
                    favGovernment: '',
                    favProperty: '',
                    description: 'Want to trade in order to liberate workers'
                },
                {
                    name: 'Geological Society of Nu Avalon',
                    favGovernment: '',
                    favProperty: '',
                    description: 'They want to explore the continent and catalogue everything in a unified manner'
                },
                {
                    name: 'Hermeticus Institute',
                    favGovernment: '',
                    favProperty: '',
                    description: 'Train alchemists to supervise alchemical industries'
                },
                {
                    name: "People's Mortar & Pestle",
                    favGovernment: '',
                    favProperty: '',
                    description: 'Train local alchemists to support communities is small scale operations'
                },
                {
                    name: "Deep Rock Mining Cooperative",
                    favGovernment: '',
                    favProperty: '',
                    description: 'Train local alchemists to support communities is small scale operations'
                },
                {
                    name: "Rainbow Riders",
                    favGovernment: '',
                    favProperty: '',
                    description: 'Ranger Corp, dedicated to bringing justice to the continent through education (and guns)'
                },
            ],
            actions: [
                'Remove City',
                'Add Political Agent',
                'Add Geo Feature',
                'Add Building',
                'Test Water',
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
    }


    app.generateCityCards = function(cityData) {
        let newCityWrapper = app.templates.cityWrapper.cloneNode(true);

        let genericField = newCityWrapper.querySelector('.generic.template');
        let productionField = newCityWrapper.querySelector('.production.template');
        let factionField = newCityWrapper.querySelector('.faction.template');
        let priceField = newCityWrapper.querySelector('.price.template');
        let upkeepField = newCityWrapper.querySelector('.upkeep.template');
        let featureField = newCityWrapper.querySelector('.feature.template');

        let cityAnchor = document.querySelector('.city-anchor-link.template').cloneNode(true);

        newCityWrapper.classList.add('generated');
        newCityWrapper.classList.remove ('template');
        newCityWrapper.dataset.cityId = cityData.id;
        newCityWrapper.querySelector('.city-anchor').id = cityData.id;
        cityAnchor.href = '#' + cityData.id;
        cityAnchor.innerHTML = cityData.stats.name.base;
        cityAnchor.classList.remove('template');
        cityAnchor.classList.add('generated');

        //======================================= STATS =======================================
        Object.keys(cityData.stats).forEach(key => {
            let newField = genericField.cloneNode(true);
            let baseInput = newField.querySelector('.base').querySelector('input');

            newField.classList.add('generated');
            newField.classList.remove('template');

            if (
                key == 'name' ||
                key == 'government' ||
                key == 'property'
            ) {
                baseInput.classList.add('w-10em');
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

            newField.classList.add('generated');
            newField.classList.remove('template');

            newField.querySelector('.name').innerHTML = upkeepItem.name;
            newField.querySelector('.mod').innerHTML = round(upkeepItem.mod, 2);
            baseInput.value = round(upkeepItem.base, 2);
            newField.querySelector('.value').innerHTML = round(upkeepItem.value, 0);

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
            newField.querySelector('.inventory').innerHTML = round((cityData.agent.inventories.length > 0 ? cityData.agent.inventories.filter(x => x.name == productionItem.name)[0].value : 0), 0);

            $(baseInput).on('change', () => {
                productionItem.base = parseFloat($(baseInput).val());
                $(baseInput).addClass('changed');
                $('.calculate-btn')[0].click();
            });

            newCityWrapper.querySelector('.city-production').querySelector('tbody').appendChild(newField);
        });
        //======================================= PRICES =======================================
        cityData.prices.forEach(price => {
            let newField = priceField.cloneNode(true);

            newField.classList.add('generated');
            newField.classList.remove('template');

            newField.querySelector('.name').innerHTML = price.name;
            newField.querySelector('.buy').innerHTML = round(price.buy, 2);
            newField.querySelector('.sell').innerHTML = round(price.sell, 2);

            newCityWrapper.querySelector('.city-prices').querySelector('tbody').appendChild(newField);
        });
        //======================================= POLITICS =======================================
        cityData.politics.forEach(item => {
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
                let cityIndex = app.cityData.findIndex(city => city.id === cityData.id);
                let agentIndex = app.cityData[cityIndex].politics.findIndex(feature => feature.id === item.id);
                app.cityData[cityIndex].politics.splice(agentIndex, 1);
                $('.calculate-btn')[0].click();
            });

            newCityWrapper.querySelector('.city-politics').querySelector('tbody').appendChild(newField);
        });
        //======================================= FEATURES =======================================
        cityData.features.forEach((item, index) => {
            let newField = featureField.cloneNode(true);
            let nameInput = newField.querySelector('.name').querySelector('input');
            let baseInput = newField.querySelector('.base').querySelector('input');
            let removeBtn = newField.querySelector('.remove-btn');

            newField.classList.add('generated');
            newField.classList.remove('template');
            removeBtn.hidden = false;

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

            $(removeBtn.querySelector('.btn')).on('click', () => {
                let cityIndex = app.cityData.findIndex(city => city.id === cityData.id);
                app.cityData[cityIndex].features.splice(index, 1);
                $('.calculate-btn')[0].click();
            });

            newCityWrapper.querySelector('.city-features').querySelector('tbody').appendChild(newField);
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
                case 'Test Water':
                    $(newBtn).on('click', () => {
                        console.log(app.getWaterGainForCity(cityData));
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
            cityData.stats.garrisonLimit.result = round(0.18*cityData.stats.population.result + 10*cityData.stats.prosperity.result, 0);
            cityData.stats.manpowerLimit.result = round(parseInt(cityData.stats.garrisonLimit.result) + 0.18*cityData.stats.population.result, 0);
            cityData.stats.currentManpower.result = Math.min(cityData.stats.currentManpower.base, cityData.stats.manpowerLimit.result);
            cityData.stats.mobilization.result = cityData.stats.currentManpower.result / cityData.stats.manpowerLimit.result;
            cityData.stats.defences.result = parseFloat(cityData.stats.defences.base) + parseFloat(cityData.stats.mobilization.result);
            cityData.stats.socialTrust.result = Math.min(2, cityData.stats.socialTrust.base - 1*factionTotal + 0.02*cityData.stats.prosperity.result - cityData.stats.devastation.result*(cityData.stats.devastation.result <= 0.2 ? 0.5 : (cityData.stats.devastation.result <= 0.33 ? 0.4 : 0.3)));
            cityData.stats.crime.result = Math.max(cityData.stats.crime.base + (0.5 - cityData.stats.socialTrust.result**2)*0.8, cityData.stats.crime.base);
            //econ stats
            cityData.stats.keyRate.result = cityData.stats.keyRate.base;
            cityData.stats.tarrifs.result = cityData.stats.tarrifs.base;
            cityData.stats.rent.result = cityData.stats.rent.base;
            cityData.stats.services.result = cityData.stats.services.base;
            cityData.stats.corruption.result = cityData.stats.corruption.base + 0.05*(1 + cityData.stats.crime.result);
            cityData.stats.basicIncomePerTurn.result = cityData.stats.population.result*0.65*cityData.stats.keyRate.result*(1 + cityData.stats.prosperity.result*0.1)*(1 - cityData.stats.corruption.result)*(1 - 2*cityData.stats.mobilization.result)*(1 - cityData.stats.devastation.result) + parseInt(cityData.stats.rent.result) + parseInt(cityData.stats.services.result);
            cityData.stats.currentBudget.result = cityData.stats.currentBudget.base;
            cityData.stats.productivity.result = cityData.stats.productivity.base;
            cityData.stats.integration.result = cityData.stats.integration.base;

            cityData.upkeep.forEach(upkeep => {
                upkeep.mod = upkeep.base*(1 + cityData.stats.crime.result/4)*(cityData.stats.currentManpower.result < cityData.stats.garrisonLimit.result ? 1 + cityData.stats.mobilization.result/4 : 1);
                upkeep.value = ((upkeep.prosperityUpkeepMod*cityData.stats.prosperity.result + upkeep.popUpkeepMod)*cityData.stats.population.result)*upkeep.packageSize*upkeep.mod;
                switch (upkeep.name) {
                    case 'Granite':
                        upkeep.value = upkeep.value + 4*cityData.features.filter(x => x.type == 'BUILD').length*upkeep.packageSize*upkeep.mod;
                        break;
                    case 'Wood':
                        upkeep.value = upkeep.value + 8*cityData.features.filter(x => x.type == 'BUILD').length*upkeep.packageSize*upkeep.mod, 0;
                        break;
                    case 'Weapon Parts':
                        upkeep.value = upkeep.value*(1 + parseFloat(cityData.stats.mobilization.result));
                        break;
                    default:
                        break;
                };
            });

            cityData.production.forEach(production => {
                production.mod = production.base*(1 - cityData.stats.crime.result)*(1 + cityData.stats.prosperity.result*0.02)*(1 + parseInt(cityData.stats.productivity.result))*(cityData.stats.currentManpower.result < cityData.stats.garrisonLimit.result ? 1 - cityData.stats.mobilization.result : 1);
            });

            resolve();
        });
        return promise;
    };

    app.calculateCityFeatures = function(cityData) {
        let promise = new Promise (resolve => {
            cityData.features.forEach(feature => {
                feature.prodMod.forEach(prodMod => {
                    cityData.production.filter(x => x.name == prodMod.name)[0].mod += prodMod.value*feature.factor;
                });
                feature.statMod.forEach(statMod => {
                    cityData.stats[statMod.name].result += statMod.value*feature.factor;
                    if (
                        statMod.name == 'popularity' ||
                        statMod.name == 'prosperity'
                    ) {
                        cityData.stats[statMod.name].result = round(cityData.stats[statMod.name].result, 0);
                    };
                });
            });
            resolve();
        });

        return promise;
    };

    app.generateNewCity = function() {
        let promise = new Promise (resolve => {
            let newCityData = JSON.parse(JSON.stringify(app.staticData.defaultCity));

            newCityData.stats.name.base += '-' + (app.cityData.length + 1);
            newCityData.id = app.cityData.length + 1;

            //Generating stats
            newCityData.stats.government.base = app.staticData.governmentTypes[Math.max(0, round(Math.random()*app.staticData.governmentTypes.length - 1, 0))].name;
            newCityData.stats.property.base = app.staticData.propertyTypes[Math.max(0, round(Math.random()*app.staticData.propertyTypes.length - 1, 0))].name;
            newCityData.stats.population.base = round(300 + 200*(Math.random()*19 + 1) + 10*(Math.random()*19 + 1), 0);
            newCityData.stats.prosperity.base = round(Math.random()*9 + 1, 0);
            newCityData.stats.defences.base = newCityData.stats.defences.base + 0.09 - Math.random()*0.04;
            newCityData.stats.keyRate.base = newCityData.stats.keyRate.base + 0.09 - Math.random()*0.04;
            newCityData.stats.tarrifs.base = newCityData.stats.tarrifs.base + 0.09 - Math.random()*0.04;
            newCityData.stats.rent.base = newCityData.stats.rent.base + Math.random()*9 + 1;
            newCityData.stats.services.base = newCityData.stats.services.base + Math.random()*9 + 1;
            newCityData.stats.productivity.base = newCityData.stats.productivity.base + 0.09 - Math.random()*0.04;
            newCityData.stats.integration.base = newCityData.stats.integration.base + 0.09 - Math.random()*0.04;

            //Generating upkeep
            app.market.goods.forEach(good => {
                if (good.isUpkeep) {
                    let upkeepItem = {
                        name: good.name,
                        mod: 0,
                        base: 1 + 0.8 - Math.random()*1.6,
                        value: 0
                    };

                    Object.keys(good).forEach(key => {
                        upkeepItem[key] = good[key];
                    });

                    newCityData.upkeep.push(upkeepItem);
                };
            });

            //Generating production
            app.market.goods.forEach(good => {
                let productionItem = {
                    name: good.name,
                    mod: 0,
                    base: 1 + 0.8 - Math.random()*1.6,
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
            for (let index = 0; index < 4; index++) {
                app.addNewFeature(newCityData, 'GEO');
            };

            //Generating buildings
            for (let index = 0; index < 4; index++) {
                app.addNewFeature(newCityData, 'BUILD');
            };

            //Generating econ agent price beliefs
            app.market.goods.forEach(good => {
                let priceBelief = {
                    name: good.name,
                    upper: good.basePrice + Math.random()*good.basePrice*0.1 + good.basePrice*0.05,
                    lower: good.basePrice - Math.random()*good.basePrice*0.1 - good.basePrice*0.05,
                };
                newCityData.agent.priceBeliefs.push(priceBelief);
            });

            //Setting aprox city prices
            app.market.goods.forEach(good => {
                let price = {
                    name: good.name,
                    buy: newCityData.agent.priceBeliefs.filter(x => x.name == good.name)[0].lower,
                    sell: newCityData.agent.priceBeliefs.filter(x => x.name == good.name)[0].upper
                };
                newCityData.prices.push(price);
            });

            app.cityData.push(newCityData);
            newCityData = {};
            resolve();
        });
        return promise;
    };

    app.generateInitialCityInventoriesBasedOnUpkeep = function(city) {
        return new Promise (resolve => {
            Promise.all(city.production.map(production => {
                let baseValue = (production.isUpkeep ? city.upkeep.filter(x => x.name == production.name)[0].value : 500 - 100*production.tier);
                let inventory = {
                    name: production.name,
                    value: Math.random()*baseValue*0.4*production.mod + baseValue - baseValue*0.2
                }
                city.agent.inventories.push(inventory);
            })).then(() => {
                city.agent.inventories.filter(x => x.name == 'Water')[0].value += app.getWaterGainForCity(city);
                resolve();
            });
        });
    };

    app.addNewPoliticalAgent = function(city) {
        let randomIndex = Math.max(0, round(Math.random()*app.staticData.syndicates.length - 1, 0));
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

    app.addNewFeature = function(city, category) {
        let randomIndex = 0;
        let randomFeature = {};

        if (category !== '') {
            randomIndex = Math.max(0, round(Math.random()*app.staticData.features.filter(x => x.type == category).length - 1, 0));
            randomFeature = JSON.parse(JSON.stringify(app.staticData.features.filter(x => x.type == category)[randomIndex]));
            randomFeature.factor = (category == 'BUILD' ? 1 : (Math.random() + 1 ));
            randomFeature.id = city.features.length;
        } else {
            randomIndex = Math.max(0, round(Math.random()*app.staticData.features.length - 1, 0));
            randomFeature = JSON.parse(JSON.stringify(app.staticData.features[randomIndex]));
            randomFeature.factor = (category == 'BUILD' ? 1 : (Math.random() + 1 ));
            randomFeature.id = city.features.length;
        };

        if (city.features.filter(x => x.name == randomFeature.name).length > 0) {
            city.features.filter(x => x.name == randomFeature.name)[0].factor += randomFeature.factor;
        } else {
            city.features.push(randomFeature);
        };
        
    };

    app.calculateBaseProductionCost = function() {
        app.market.goods.forEach(good => {
            good.production.forEach(item => {
                good.basePrice += app.market.goods.filter(x => x.name == item.good)[0].basePrice*item.quantity;
            });
        });
    };

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

    app.getWaterGainForCity = function(city) {
        let total = 0;
        city.features.forEach(feature => {
            let waterProducingFeatures = feature.produce.filter(x => x.name == 'Water');
            total += (waterProducingFeatures.length > 0 ? 2000*city.production.filter(x => x.name == 'Water')[0].mod*(waterProducingFeatures[0].value**1.5)*feature.factor : 0);
        });
        return round(total, 0);
    };

    app.canGoodBeProduced = function(city, goodName, quantity) {
        //check how many 100-packs of a good can be produced, returns mod that has to multiplied by 10 to get the actual production volume
        return new Promise (resolve => {
            if (goodName !== 'Water') {
                let good = app.market.goods.filter(x => x.name == goodName)[0];
                let possibleProductionNumbers = new Array(good.production.length);
                //console.log('Checking production of ' + good.name);
                good.production.forEach((component, index) => {
                    let ifUpkeepMinimum = (app.market.goods.filter(x => x.name == component.good)[0].isUpkeep ? city.upkeep.filter(x => x.name == component.good)[0].value : 0);
                    let result = true;
                    possibleProductionNumbers[index] = 0;
                    //console.log('Iterating needed ' + component.good + ', have ' + city.agent.inventories.filter(x => x.name == component.good)[0].value + ', need at least ' + ifUpkeepMinimum);
                    while (result == true && city.agent.inventories.filter(x => x.name == goodName)[0].value + possibleProductionNumbers[index]*100 < quantity) {                
                        (city.agent.inventories.filter(x => x.name == component.good)[0].value > ifUpkeepMinimum + (possibleProductionNumbers[index] + 1)*component.quantity*100 ? possibleProductionNumbers[index]++ : result = false );   
                    };
                });
    
                //console.log('Possible production of ' + good.name + ' is ' + Math.min(...possibleProductionNumbers) + ' out of ' + quantity);
                resolve(Math.min(...possibleProductionNumbers));
            } else {
                resolve(0);
            };
        });
    };

    app.possibleProductionFromGood = function(city, good, minQuantity) {
        return new Promise (resolve => {
            let possibleProductionGoods = app.market.goods.filter(prodGood => prodGood.production.filter(component => component.good == good.name).length > 0);
            possibleProductionGoods.forEach(prodGood => {
                prodGood.possibleProductionNumber = (city.agent.inventories.filter(x => x.name == good.name)[0].value - minQuantity)/prodGood.production.filter(component => component.good == good.name)[0].quantity;
            });
            resolve(possibleProductionGoods);
        });
    };

    app.produceGood = function(city, goodName, quantity) {
        //quantity is gonna be multiplied by 10
        let good = app.market.goods.filter(x => x.name == goodName)[0];
        let productionMod = city.production.filter(x => x.name == goodName)[0].mod;
        let consumptionList = '';
        good.production.forEach(component => {
            let previousInventoryValue = city.agent.inventories.filter(x => x.name == component.good)[0].value;
            city.agent.inventories.filter(x => x.name == component.good)[0].value -= quantity*component.quantity*productionMod*100;
            consumptionList = consumptionList + ' | ' + quantity*component.quantity*100 + ' of ' + component.good + ' out of ' + previousInventoryValue;
        });
        city.agent.inventories.filter(x => x.name == good.name)[0].value += quantity*100;
        //console.log('Produced ' + quantity + ' of ' + goodName + ', used the following: ' + consumptionList);
    };


    //rewrite to instead go over goods looking what can be produced out of em,
    //sort the resulting list by need, produce up to upkeep,
    //then randomly shuffle and produce until current good is not at the minimum upkeep value
    
    app.econCityAgentProductionDEV = function(city) {
        return new Promise (resolve => {
            let calculateNextProduction = i => {
                let marketGoodData = app.market.goods.filter(x => x.name == city.agent.inventories[i].name)[0];
                let desiredInventory = (marketGoodData.isUpkeep ? city.upkeep.filter(x => x.name == marketGoodData.name)[0].value : 0);
                app.possibleProductionFromGood(city, marketGoodData, desiredInventory).then(result => {
                    (result.length > 0 ? console.log(city.stats.name.base + ' possible production from available ' + (city.agent.inventories[i].value - desiredInventory) + ' of ' + city.agent.inventories[i].name) : '');
                    (result.length > 0 ? console.log(result) : '');
                    i++;

                    if (i < city.agent.inventories.length)
                        calculateNextProduction(i)
                    else
                        resolve();
                });
            }
            calculateNextProduction(0);
        });
    };

    app.econCityAgentProduction = function(city) {
        return new Promise (resolve => {
            let doNextProduction = i => {
                let marketGoodData = app.market.goods.filter(x => x.name == city.agent.inventories[i].name)[0];
                let desiredInventory = (marketGoodData.isUpkeep ? city.upkeep.filter(x => x.name == marketGoodData.name)[0].value + 12000 - 400*(marketGoodData.tier**4) : 12000 - 400*(marketGoodData.tier**4));
                //(marketGoodData.isFuel ? console.log(marketGoodData.name + ' is fuel, desired inventory is ' + desiredInventory) : '');
                app.canGoodBeProduced(city, city.agent.inventories[i].name, desiredInventory).then(result => {
                    //console.log('Producing ' + marketGoodData.name + ' up to a desired amount of ' + desiredInventory);
                    app.produceGood(city, city.agent.inventories[i].name, result);
                    i++;

                    if (i < city.agent.inventories.length)
                        doNextProduction(i)
                    else
                        resolve();
                });
            }
            doNextProduction(0);
        });
    };

    app.substractUpkeepFromAgent = function(agent, cityUpkeep) {
        return new Promise (resolve => {
            Promise.all(cityUpkeep.map(upkeepItem => {
                return new Promise (resolve => {
                    agent.inventories.filter(x => x.name == upkeepItem.name)[0].value -= upkeepItem.value;
                    //console.log(upkeepItem.name + ' number after upkeep: ' + agent.inventories.filter(x => x.name == upkeepItem.name)[0].value);
                    resolve();
                });
            })).then(() => {
                resolve();
            });
        });
    };

    app.cityTaxCollection = function(city) {
        return new Promise(resolve => {
            city.stats.currentBudget.result += city.stats.basicIncomePerTurn.result;
            resolve();
        });
    };

    app.manageCityAgentsWallet = function(city) {
        if (city.agent.capital < 0) {
            console.log(city.stats.name.base + ' invests ' + Math.abs(city.agent.capital) + ' in its trade agent to compensate debt');
            city.stats.currentBudget.result -= Math.abs(city.agent.capital);
            city.agent.capital = 0;
        } else if (city.agent.capital == 0) {
            let subsidy = city.stats.currentBudget.result/3;
            console.log(city.stats.name.base + ' invests ' + subsidy + ' in its trade agent to stimulate trade');
            city.stats.currentBudget.result -= subsidy;
            city.agent.capital += subsidy;
        };
        console.log(city.stats.name.base + ' resulting wallet is ' + city.agent.capital);
    };

    app.generateAgentListings = function(city) {
        return new Promise(resolve => {
            let tradeInventory = [];
            let projectedCapital = city.agent.capital;
            city.agent.inventories.forEach(item => {
                let marketGoodData = app.market.goods.filter(x => x.name == item.name)[0];
                tradeInventory.push({
                    name: item.name,
                    value: item.value - (marketGoodData.isUpkeep ? city.upkeep.filter(x => x.name == item.name)[0].value + 8000 - 400*(marketGoodData.tier*2) : 8000 - 400*(marketGoodData.tier*2))
                });
            });
            tradeInventory.forEach(item => {
                //console.log(city.stats.name.base + ' projected capital is ' + projectedCapital + '$');
                let lowerPrice = city.agent.priceBeliefs.filter(x => x.name == item.name)[0].lower;
                let upperPrice = city.agent.priceBeliefs.filter(x => x.name == item.name)[0].upper;
                if (item.value > 0) {
                    app.market.currentLots.push({
                        cityID: city.id,
                        goodName: item.name,
                        quantity: item.value,
                        price: upperPrice,
                    });
                    //console.log(city.stats.name.base + ' wants to sell ' + item.value + ' units of ' + item.name + ' for a total of ' + upperPrice*item.value + '$');
                } else {
                    if (projectedCapital > Math.abs(item.value)*lowerPrice) {
                        app.market.currentAsks.push({
                            cityID: city.id,
                            goodName: item.name,
                            quantity: Math.abs(item.value),
                            price: lowerPrice,
                        });
                        //console.log(city.stats.name.base + ' wants to buy ' + Math.abs(item.value) + ' units of ' + item.name + ' for a total of ' + lowerPrice*Math.abs(item.value) + '$');
                        projectedCapital -= Math.abs(item.value)*lowerPrice;
                        //console.log(city.stats.name.base + ' projected capital is now ' + projectedCapital + '$');
                    } else if (projectedCapital > 0) {
                        app.market.currentAsks.push({
                            cityID: city.id,
                            goodName: item.name,
                            quantity: Math.min(Math.abs(item.value), projectedCapital/lowerPrice),
                            price: lowerPrice,
                        });
                        //console.log(city.stats.name.base + ' wants to buy ' + Math.min(Math.abs(item.value), projectedCapital/lowerPrice) + ' units of ' + item.name + ' for a total of ' + Math.min(Math.abs(item.value), projectedCapital/lowerPrice)*lowerPrice + '$');
                        projectedCapital -= Math.min(Math.abs(item.value), projectedCapital/lowerPrice)*lowerPrice;
                        //console.log(city.stats.name.base + ' projected capital is now ' + projectedCapital + '$');
                    };
                    
                };
            });
            
            resolve();
        });
    };

    app.marketMatchListings = function() {
        return Promise.all(app.market.goods.map(good => {
            let shuffledLots = shuffle(app.market.currentLots.filter(x => x.goodName == good.name));
            let shuffledAsks = shuffle(app.market.currentAsks.filter(x => x.goodName == good.name));
            let sortedLots = shuffledLots.sort((a, b) => (a.price > b.price) ? 1 : -1);
            let sortedAsks = shuffledAsks.sort((a, b) => (a.price < b.price) ? 1 : -1);
            let currentTurnMeanPrice = [];

            while (sortedLots.length > 0 && sortedAsks.length > 0) {
                let buyer = sortedAsks[0];
                let buyerAgent = app.cityData.filter(x => x.id == buyer.cityID)[0].agent;
                let seller = sortedLots[0];
                let sellerAgent = app.cityData.filter(x => x.id == seller.cityID)[0].agent;
                let quantity = Math.min(buyer.quantity, seller.quantity);
                let clearingPrice = (buyer.price + seller.price)/2;
                if (quantity > 0) {
                    buyer.quantity -= quantity;
                    seller.quantity -= quantity;
                    buyerAgent.inventories.filter(x => x.name == buyer.goodName)[0].value += quantity;
                    sellerAgent.inventories.filter(x => x.name == seller.goodName)[0].value -= quantity;
                    buyerAgent.capital -= quantity*clearingPrice;
                    sellerAgent.capital += quantity*clearingPrice;
                    currentTurnMeanPrice.push(clearingPrice);
                    console.log(app.cityData.filter(x => x.id == buyer.cityID)[0].stats.name.base + ' made a deal!');
                    console.log('This happened when buying ' + quantity + ' units of ' + good.name + ' for ' + quantity*clearingPrice + ' from ' + app.cityData.filter(x => x.id == seller.cityID)[0].stats.name.base);
                };
                (buyer.quantity == 0 ? sortedLots.shift() : '');
                (seller.quantity == 0 ? sortedAsks.shift() : '');
            };
            if (currentTurnMeanPrice.length > 0) {
                app.market.goods.filter(x => x.name == good.name)[0].historicalMean.push({
                    turn: app.currentTurn,
                    value: currentTurnMeanPrice.reduce((a, b) => a + b)/currentTurnMeanPrice.length
                });
            };
            app.market.currentLots = [];
            app.market.currentAsks = [];
        }));
        
    };

    app.refreshCards = function() {
        $('.generated').remove();
        $('.turn-counter').text(app.currentTurn);
        app.cityData.forEach(city => {
            app.generateCityCards(city);
        });
    };

    $(function() {
        app.templates.cityWrapper = document.querySelector('.city-wrapper.template');
        app.templates.btn = document.querySelector('.btn.template');
        app.containers.cityContainer = document.querySelector('.city-list.container');
        app.containers.anchorsContainer = document.querySelector('.city-anchors.container');

        
        setTimeout(() => {
            for (let i = 0; i < 3; i++) {
                    $('.add-new-btn')[0].click();
            };
        }, 100);
        
        $('.calculate-btn').on('click', () => {
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
            app.generateNewCity();
            let newCity = app.cityData[(app.cityData.length > 0 ? app.cityData.length - 1 : app.cityData.length)];
            app.calculateCity(newCity).then(() => {
                app.calculateCityFeatures(newCity).then(() => {
                    app.generateInitialCityInventoriesBasedOnUpkeep(newCity).then(() => {
                        app.refreshCards();
                    });
                });
            });
        });

        $('.debug-fn-btn').on('click', () => {
            app.currentTurn++;
            Promise.all(app.cityData.map(city => {
                return new Promise (resolve => {
                    city.agent.inventories.filter(x => x.name == 'Water')[0].value += app.getWaterGainForCity(city);
                    //console.log(city.stats.name.base + ' got ' + app.getWaterGainForCity(city) + ' water from its features');
                    app.substractUpkeepFromAgent(city.agent, city.upkeep).then(() => {
                        let promise = new Promise(resolve => {
                            let iterateProduction = i => {
                                app.econCityAgentProductionDEV(city).then(() => {
                                    //console.log(city.stats.name.base + ' is doing ' + i + ' production iteration, results:');
                                    //console.log(city.agent.inventories.sort((a, b) => (a.value > b.value) ? 1 : -1));
                                    i++;
                                    if (i < 10)
                                        iterateProduction(i)
                                    else
                                        resolve();
                                });
                            };

                            iterateProduction(0);
                        });
                        
                        promise.then(() => {
                            app.generateAgentListings(city).then(() => {
                                app.marketMatchListings().then(() => {
                                    app.cityTaxCollection(city).then(() => {
                                        app.manageCityAgentsWallet(city);
                                    });
                                    resolve();
                                });
                            });
                        });
                    });
                });
            })).then(() => {
                app.refreshCards();
                console.log(app.market);
            });
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
      }

})();