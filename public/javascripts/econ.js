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
                            quantity: 4 
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: -0.08,
                    popUpkeepMod: 0.5*7,
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
                            quantity: 4
                        },
                    ],
                    isUpkeep: false
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
                            quantity: 4
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: -0.04,
                    popUpkeepMod: 0.25*7,
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
                            quantity: 4
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
                            quantity: 4
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
                            quantity: 2
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
                            quantity: 4
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: 0.02,
                    popUpkeepMod: 0.05*7,
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
                            quantity: 2
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
                    isUpkeep: false
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
                    isUpkeep: false
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
                            quantity: 4
                        },
                    ],
                    isUpkeep: true,
                    prosperityUpkeepMod: 0.01,
                    popUpkeepMod: 0,
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
                    isUpkeep: false
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
                    isUpkeep: false
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
                },
                {
                    name: 'Large Parts',
                    basePrice: 1,
                    packageSize: 1,
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
                },
            ],
            currentBids: [],
            currentAsks: [],
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
                            value: 0.1
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
                            value: 0.1
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
                            value: 0.1
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
                            value: 0.1
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
                            value: 0.05
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
                            value: 0.05
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
                            value: 0.05
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
                            value: 0.05
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
                            value: 0.05
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
                            value: 0.05
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
                            value: 0.05
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
                            value: 0.05
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
                            value: 0.05
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
                            value: 0.1
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
                            value: 0.1
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
                            value: 0.1
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
                            value: 0.05
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
                            value: 0.05
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
                            value: 0.05
                        },
                    ],
                    statMod: [],
                    type: 'BUILD'
                },
                {
                    name: 'Slums',
                    produce: [],
                    prodMod: [],
                    statMod: [
                        {
                            name: 'population',
                            value: 0.1
                        },
                    ],
                    type: 'BUILD',
                },
                {
                    name: 'Illegal Chem Lab',
                    produce: [],
                    prodMod: [
                        {
                            name: 'Fertilizers',
                            value: 0.02
                        },
                        {
                            name: 'Medical Supplies',
                            value: 0.02
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
                'Add Feature',
                'Test Water'
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


    app.generateCityCards = function (cityData) {
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
            let statIsInt = false;

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
            newField.querySelector('.inventory').innerHTML = round(cityData.agent.inventories.filter(x => x.name == productionItem.name)[0].value, 0);

            $(baseInput).on('change', () => {
                productionItem.base = parseFloat($(baseInput).val());
                $(baseInput).addClass('changed');
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
            trendInput.value = round(item.trend, 2);
            oppositionInput.value = round(item.opposition, 2);

            $(nameInput).on('change', () => {
                item.name = $(nameInput).val();
                $(nameInput).addClass('changed');
            });

            $(supportInput).on('change', () => {
                item.support = parseFloat($(supportInput).val());
                $(supportInput).addClass('changed');
            });

            $(trendInput).on('change', () => {
                item.trend = parseFloat($(trendInput).val());
                $(trendInput).addClass('changed');
            });

            $(oppositionInput).on('change', () => {
                item.opposition = parseFloat($(oppositionInput).val());
            });

            $(removeBtn.querySelector('.btn')).on('click', () => {
                let cityIndex = app.cityData.findIndex(city => city.id === cityData.id);
                let agentIndex = app.cityData[cityIndex].politics.findIndex(feature => feature.id === item.id);
                app.cityData[cityIndex].politics.splice(agentIndex, 1);
                app.refreshCards();
            });

            newCityWrapper.querySelector('.city-politics').querySelector('tbody').appendChild(newField);
        });
        //======================================= FEATURES =======================================
        cityData.features.forEach(item => {
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
                    item = app.staticData.features.filter(x => x.name == $(nameInput).val())[0];
                };
                $(nameInput).addClass('changed');
                
            });

            $(baseInput).on('change', () => {
                item.factor = parseFloat($(baseInput).val());
                $(baseInput).addClass('changed');
                
            });

            $(removeBtn.querySelector('.btn')).on('click', () => {
                let cityIndex = app.cityData.findIndex(city => city.id === cityData.id);
                let featureIndex = app.cityData[cityIndex].features.findIndex(feature => feature.id === item.id);
                app.cityData[cityIndex].features.splice(featureIndex, 1);
                app.refreshCards();
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
                        $('.calculate-btn').trigger('click');
                    });
                    break;
                case 'Add Political Agent':
                    $(newBtn).on('click', () => {
                        app.addNewPoliticalAgent(cityData);
                        $('.calculate-btn').trigger('click');
                    });
                    break;
                case 'Add Feature':
                    $(newBtn).on('click', () => {
                        app.addNewFeature(cityData);
                        $('.calculate-btn').trigger('click');
                    });
                    break;
                case 'Test Water':
                    $(newBtn).on('click', () => {
                        console.log(app.getWaterGainForCIty(cityData));
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

    app.calculateCity = function (cityData) {
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
                        base: 1 + 0.04 - Math.random()*0.09,
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
                    base: Math.max(1.1 - Math.random()*0.2, 0)
                };

                Object.keys(good).forEach(key => {
                    productionItem[key] = good[key];
                });

                newCityData.production.push(productionItem);
            });

            //Generating political agents
            for (let index = 0; index < Math.random()*2 + 1; index++) {
                let randomIndex = Math.max(0, round(Math.random()*app.staticData.syndicates.length - 1, 0));
                let randomSyndicate = JSON.parse(JSON.stringify(app.staticData.syndicates[randomIndex]));
                randomSyndicate.support = Math.random();
                randomSyndicate.trend = Math.random()*0.04 + 0.01;
                randomSyndicate.opposition = Math.random();
                randomSyndicate.id = newCityData.politics.length;

                newCityData.politics.push(randomSyndicate);
            };

            //Generating geo features
            for (let index = 0; index < Math.random()*2 + 2; index++) {
                let randomIndex = Math.max(0, round(Math.random()*app.staticData.features.filter(x => x.type == 'GEO').length - 1, 0));
                let randomFeature = JSON.parse(JSON.stringify(app.staticData.features.filter(x => x.type == 'GEO')[randomIndex]));
                randomFeature.factor = Math.random() + 1;
                randomFeature.id = newCityData.features.length;

                newCityData.features.push(randomFeature);
            };

            //Generating buildings
            for (let index = 0; index < Math.random()*2 + 2; index++) {
                let randomIndex = Math.max(0, round(Math.random()*app.staticData.features.filter(x => x.type == 'BUILD').length - 1, 0));
                let randomFeature = JSON.parse(JSON.stringify(app.staticData.features.filter(x => x.type == 'BUILD')[randomIndex]));
                randomFeature.factor = Math.random() + 1;
                randomFeature.id = newCityData.features.length;

                newCityData.features.push(randomFeature);
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

            app.generateInitialCityInventoriesBasedOnUpkeep(newCityData);

            app.cityData.push(newCityData);
            newCityData = {};
            resolve();
        });
        return promise;
    };

    app.generateInitialCityInventoriesBasedOnUpkeep = function (city) {
        let promise = new Promise (resolve => {
            city.production.forEach(production => {
                let inventory = {
                    name: production.name,
                    value: Math.random()*1000*production.mod + (production.isUpkeep ? city.upkeep.filter(x => x.name == production.name)[0].value : 0)
                }
                city.agent.inventories.push(inventory);
            });
        });
        return promise;
    };

    app.addNewPoliticalAgent = function (city) {
        let randomIndex = Math.max(0, round(Math.random()*app.staticData.syndicates.length - 1, 0));
        let randomSyndicate = JSON.parse(JSON.stringify(app.staticData.syndicates[randomIndex]));
        randomSyndicate.support = (Math.random()), 2;
        randomSyndicate.trend = (Math.random()*0.04 + 0.01);
        randomSyndicate.opposition = (Math.random());
        randomSyndicate.id = city.politics.length;

        city.politics.push(randomSyndicate);
    };

    app.addNewFeature = function (city) {
        let randomIndex = Math.max(0, round(Math.random()*app.staticData.features.length - 1, 0));
        let randomFeature = JSON.parse(JSON.stringify(app.staticData.features[randomIndex]));
        randomFeature.factor = (Math.random() + 1 );
        randomFeature.id = city.features.length;

        city.features.push(randomFeature);
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

    app.getWaterGainForCIty = function(city) {
        let total = 0;
        city.features.forEach(feature => {
            let waterProducingFeatures = feature.produce.filter(x => x.name == 'Water');
            total += (waterProducingFeatures.length > 0 ? 500*city.production.filter(x => x.name == 'Water')[0].mod*(waterProducingFeatures[0].value)*feature.factor : 0);
        });
        return round(total, 0);
    };

    app.econCityAgentProduction = function(city) {
        let promise = new Promise (resolve => {
            let loopUpkeep = new Promise (resolve => {
                city.upkeep.forEach(upkeep => {
                    if (city.agent.inventories.filter(x => x.name == upkeep.name).value < upkeep.value) {
                        while (city.agent.inventories.filter(x => x.name == upkeep.name).value < upkeep.value) {
                            let canProduce = true;
                            let countProductionCost = new Promise (resolve => {
                                upkeep.production.forEach(item => {
                                    (city.agent.inventories.filter(x => x.name == item.good).value < item.quantity ? canProduce = false : '');
                                });
                                resolve();
                            });
                            
                            countProductionCost.then(() => {
                                if (canProduce) {
                                    upkeep.production.forEach(item => {
                                        city.agent.inventories.filter(x => x.name == item.good).value -= item.quantity;
                                    });
                                };
                            });
                            if (!canProduce) {
                                break;
                            };
                        };
                    };
                });
            });
            
            loopUpkeep.then(() => {
                let sortedGoods = 
                app.market.goods.forEach(good => {
                    while (canProduce) {
                        let canProduce = true;
                        let countProductionCost = new Promise (resolve => {
                            good.production.forEach(item => {
                                (city.agent.inventories.filter(x => x.name == item.good).value < item.quantity ? canProduce = false : '');
                            });
                            resolve();
                        });
                        
                        countProductionCost.then(() => {
                            if (canProduce) {
                                good.production.forEach(item => {
                                    city.agent.inventories.filter(x => x.name == item.good).value -= item.quantity;
                                });
                            };
                        });
                    };
                });
            });

            resolve();
        });
        
        return promise;
    };

    app.refreshCards = function () {
        $('.generated').remove();
        app.cityData.forEach(city => {
            app.generateCityCards(city);
        });
    };

    $(function() {
        app.templates.cityWrapper = document.querySelector('.city-wrapper.template');
        app.templates.btn = document.querySelector('.btn.template');
        app.containers.cityContainer = document.querySelector('.city-list.container');
        app.containers.anchorsContainer = document.querySelector('.city-anchors.container');

        let initPromise = new Promise (resolve => {
            app.calculateBaseProductionCost();
            app.calculateHistoricalMean();
            app.generateNewCity();
            resolve();
        });
        
        initPromise.then(() => {
            app.cityData.forEach(city => {
                app.calculateCity(city).then(() => {
                    app.calculateCityFeatures(city);
                    app.generateInitialCityInventoriesBasedOnUpkeep(city);
                });
            });
            app.refreshCards();
        });
        
        $('.calculate-btn').on('click', () => {
            app.cityData.forEach(city => {
                app.calculateCity(city).then(() => {
                    app.calculateCityFeatures(city).then(() => {
                        app.generateInitialCityInventoriesBasedOnUpkeep(city);
                        app.refreshCards();
                    });
                });
            });
        });

        $('.add-new-btn').on('click', () => {
            app.generateNewCity();
            app.calculateCity(app.cityData[(app.cityData.length > 0 ? app.cityData.length - 1 : app.cityData.length)]).then(() => {
                app.calculateCityFeatures(app.cityData[(app.cityData.length > 0 ? app.cityData.length - 1 : app.cityData.length)]);
                app.refreshCards();
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

})();