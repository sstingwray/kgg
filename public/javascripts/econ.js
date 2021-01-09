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
                    popUpkeepMod: 1*7,
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
                        base: 0.2,
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
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Waterfall',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Vulcano',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Mountain',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Hot Spring',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Arid Highland',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Green Hill',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Glacier',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Oasis',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Searing Desert',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Cave System',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Bountiful Plain',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Dense Jungle',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Rugged Woods',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Sea Shore',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Great River',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Prosperous Mesa',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Fuming Bog',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Fair Tundra',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Deep Sinkhole',
                    effect: '',
                    type: 'GEO',
                },
                {
                    name: 'Fuel Station',
                    effect: '',
                    type: 'BUILD',
                },
                {
                    name: 'Prima Refiner',
                    effect: '',
                    type: 'BUILD',
                },
                {
                    name: 'Prima Condenser',
                    effect: '',
                    type: 'BUILD',
                },
                {
                    name: 'School',
                    effect: '',
                    type: 'BUILD',
                },
                {
                    name: 'University',
                    effect: '',
                    type: 'BUILD',
                },
                {
                    name: 'Court',
                    effect: '',
                    type: 'BUILD',
                },
                {
                    name: 'Port',
                    effect: '',
                    type: 'BUILD',
                },
                {
                    name: 'Wharf',
                    effect: '',
                    type: 'BUILD',
                },
                {
                    name: 'Trading Depo',
                    effect: '',
                    type: 'BUILD',
                },
                {
                    name: 'Fortification',
                    effect: '',
                    type: 'BUILD',
                },
                {
                    name: 'Farm Stead',
                    effect: '',
                    type: 'BUILD',
                    variants: ['Grains', 'Miscanthus', 'Textile Plants', 'Fruits and Veggies', 'Forestry', 'Alchemical Gardens']
                },
                {
                    name: 'Factory',
                    effect: '',
                    type: 'BUILD',
                    variants: ['Small Craft', 'Large Craft', 'Composites', 'Alchemical Machines', 'Salvage', 'Weapons', 'Textiles', 'Industrial Goods']
                },
                {
                    name: 'Mine',
                    effect: '',
                    type: 'BUILD',
                    variants: ['Prima Ores', 'Industrial Ores', 'Granite', 'Sand']
                },
                {
                    name: 'Autopark',
                    effect: '',
                    type: 'BUILD',
                },
                {
                    name: 'Foundry',
                    effect: '',
                    type: 'BUILD',
                },
                {
                    name: 'Alchemical Station',
                    effect: '',
                    type: 'BUILD',
                },
                {
                    name: 'Weaponry',
                    effect: '',
                    type: 'BUILD',
                },
                {
                    name: 'Slums',
                    effect: '',
                    type: 'BUILD',
                },
                {
                    name: 'Illegal Factory',
                    effect: '',
                    type: 'BUILD',
                    variants: ['Small Craft', 'Large Craft', 'Composites', 'Alchemical Machines', 'Salvage', 'Weapons', 'Textiles', 'Industrial Goods']
                },
                {
                    name: 'Gang Hideout',
                    effect: '',
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
                'Add Feature'
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
            newField.querySelector('.base').querySelector('input').value = cityData.stats[key].base;
            newField.querySelector('.value').innerHTML = cityData.stats[key].result;
            $(baseInput).on('change', () => {
                cityData.stats[key].base = parseFloat($(baseInput).val());
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
            newField.querySelector('.mod').innerHTML = upkeepItem.mod;
            baseInput.value = upkeepItem.base;
            newField.querySelector('.value').innerHTML = upkeepItem.value;

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
            baseInput.value = productionItem.base;
            newField.querySelector('.mod').innerHTML = productionItem.mod;
            newField.querySelector('.inventory').innerHTML = cityData.agent.inventories.filter(x => x.name == productionItem.name)[0].value;

            $(baseInput).on('change', () => {
                cityData.production[key].base = parseFloat($(baseInput).val());
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
            newField.querySelector('.buy').innerHTML = price.buy;
            newField.querySelector('.sell').innerHTML = price.sell;

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
            supportInput.value = item.support;
            trendInput.value = item.trend;
            oppositionInput.value = item.opposition;

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
            baseInput.value = item.factor;

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
            cityData.stats.currentManpower.result = round(Math.min(cityData.stats.currentManpower.base, cityData.stats.manpowerLimit.result), 0);
            cityData.stats.mobilization.result = round(cityData.stats.currentManpower.result / cityData.stats.manpowerLimit.result, 2);
            cityData.stats.defences.result = round(parseFloat(cityData.stats.defences.base) + parseFloat(cityData.stats.mobilization.result), 2);
            cityData.stats.socialTrust.result = round(Math.min(2, cityData.stats.socialTrust.base - 1*factionTotal + 0.02*cityData.stats.prosperity.result - cityData.stats.devastation.result*(cityData.stats.devastation.result <= 0.2 ? 0.5 : (cityData.stats.devastation.result <= 0.33 ? 0.4 : 0.3))), 2);
            cityData.stats.crime.result = round(Math.max(cityData.stats.crime.base + (0.5 - cityData.stats.socialTrust.result**2)*0.8, cityData.stats.crime.base), 2);
            //econ stats
            cityData.stats.keyRate.result = cityData.stats.keyRate.base;
            cityData.stats.tarrifs.result = cityData.stats.tarrifs.base;
            cityData.stats.rent.result = cityData.stats.rent.base;
            cityData.stats.services.result = cityData.stats.services.base;
            cityData.stats.corruption.result = round(cityData.stats.corruption.base + 0.05*(1 + cityData.stats.crime.result), 2);
            cityData.stats.basicIncomePerTurn.result = round(cityData.stats.population.result*0.65*cityData.stats.keyRate.result*(1 + cityData.stats.prosperity.result*0.1)*(1 - cityData.stats.corruption.result)*(1 - 2*cityData.stats.mobilization.result)*(1 - cityData.stats.devastation.result) + parseInt(cityData.stats.rent.result) + parseInt(cityData.stats.services.result), 2);
            cityData.stats.currentBudget.result = cityData.stats.currentBudget.base;
            cityData.stats.productivity.result = cityData.stats.productivity.base;
            cityData.stats.integration.result = cityData.stats.integration.base;

            cityData.upkeep.forEach(upkeep => {
                upkeep.mod = round(upkeep.base*(1 + cityData.stats.crime.result/4)*(cityData.stats.currentManpower.result < cityData.stats.garrisonLimit.result ? 1 + cityData.stats.mobilization.result/4 : 1), 2);
                upkeep.value = round(((upkeep.prosperityUpkeepMod*cityData.stats.prosperity.result + upkeep.popUpkeepMod)*cityData.stats.population.result)*upkeep.packageSize*upkeep.mod, 0);
                switch (upkeep.name) {
                    case 'Granite':
                        upkeep.value = upkeep.value + round(4*cityData.features.filter(x => x.type == 'BUILD').length*upkeep.packageSize*upkeep.mod, 0);
                        break;
                    case 'Wood':
                        upkeep.value = upkeep.value + round(8*cityData.features.filter(x => x.type == 'BUILD').length*upkeep.packageSize*upkeep.mod, 0);
                        break;
                    case 'Weapon Parts':
                        upkeep.value = upkeep.value*round((1 + parseFloat(cityData.stats.mobilization.result)), 2);
                        break;
                    default:
                        break;
                };
            });

            cityData.production.forEach(production => {
                production.mod = round(production.base*(1 - cityData.stats.crime.result)*(1 + cityData.stats.prosperity.result*0.02)*(1 + parseInt(cityData.stats.productivity.result))*(cityData.stats.currentManpower.result < cityData.stats.garrisonLimit.result ? 1 - cityData.stats.mobilization.result : 1), 2);
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
            newCityData.stats.government.base = app.staticData.governmentTypes[round(Math.max(0, Math.random()*app.staticData.governmentTypes.length - 1), 0)].name;
            newCityData.stats.property.base = app.staticData.propertyTypes[round(Math.max(0, Math.random()*app.staticData.propertyTypes.length - 1), 0)].name;
            newCityData.stats.population.base = round(300 + 200*(Math.random()*19 + 1) + 10*(Math.random()*19 + 1), 0);
            newCityData.stats.prosperity.base = round((Math.random()*9 + 1), 0);
            newCityData.stats.defences.base = round((newCityData.stats.defences.base + 0.09 - Math.random()*0.04), 2);
            newCityData.stats.keyRate.base = round((newCityData.stats.keyRate.base + 0.09 - Math.random()*0.04), 2);
            newCityData.stats.tarrifs.base = round((newCityData.stats.tarrifs.base + 0.09 - Math.random()*0.04), 2);
            newCityData.stats.rent.base = round((newCityData.stats.rent.base + Math.random()*9 + 1), 0);
            newCityData.stats.services.base = round((newCityData.stats.services.base + Math.random()*9 + 1), 0);
            newCityData.stats.productivity.base = round((newCityData.stats.productivity.base + 0.09 - Math.random()*0.04), 2);
            newCityData.stats.integration.base = round((newCityData.stats.integration.base + 0.09 - Math.random()*0.04), 2);

            //Generating upkeep
            app.market.goods.forEach(good => {
                if (good.isUpkeep) {
                    let upkeepItem = {
                        name: good.name,
                        mod: 0,
                        base: round(1 + 0.04 - Math.random()*0.09, 2),
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
                    base: (Math.random() > 0.5 ? round(Math.max(1.1 - Math.random()*0.2, 0), 2) : 0)
                };

                Object.keys(good).forEach(key => {
                    productionItem[key] = good[key];
                });

                newCityData.production.push(productionItem);
            });

            //Generating political agents
            for (let index = 0; index < Math.random()*2 + 1; index++) {
                let randomIndex = round(Math.max(Math.random()*app.staticData.syndicates.length - 1, 0), 0);
                let randomSyndicate = JSON.parse(JSON.stringify(app.staticData.syndicates[randomIndex]));
                randomSyndicate.support = round((Math.random()), 2);
                randomSyndicate.trend = round((Math.random()*0.04 + 0.01), 2);
                randomSyndicate.opposition = round((Math.random()), 2);
                randomSyndicate.id = newCityData.politics.length;

                newCityData.politics.push(randomSyndicate);
            };

            //Generating geo features
            for (let index = 0; index < Math.random()*2 + 2; index++) {
                let randomIndex = round(Math.max(Math.random()*app.staticData.features.filter(x => x.type == 'GEO').length - 1, 0), 0);
                let randomFeature = JSON.parse(JSON.stringify(app.staticData.features.filter(x => x.type == 'GEO')[randomIndex]));
                randomFeature.factor = round((Math.random() + 1 ), 2);
                randomFeature.id = newCityData.features.length;

                newCityData.features.push(randomFeature);
            };

            //Generating buildings
            for (let index = 0; index < Math.random()*2 + 2; index++) {
                let randomIndex = round(Math.max(Math.random()*app.staticData.features.filter(x => x.type == 'BUILD').length - 1, 0), 0);
                let randomFeature = JSON.parse(JSON.stringify(app.staticData.features.filter(x => x.type == 'BUILD')[randomIndex]));
                randomFeature.factor = round((Math.random() + 1 ), 2);
                randomFeature.id = newCityData.features.length;

                newCityData.features.push(randomFeature);
            };

            //Generating econ agent price beliefs
            app.market.goods.forEach(good => {
                let priceBelief = {
                    name: good.name,
                    upper: round((good.basePrice + Math.random()*good.basePrice*0.1 + good.basePrice*0.05), 2),
                    lower: round((good.basePrice - Math.random()*good.basePrice*0.1 - good.basePrice*0.05), 2)
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

    app.generateInitialCityInventoriesBasedOnUpkeep = function (city) {
        let promise = new Promise (resolve => {
            city.production.forEach(production => {
                let inventory = {
                    name: production.name,
                    value: round(Math.random()*1000*production.mod + (production.isUpkeep ? city.upkeep.filter(x => x.name == production.name)[0].value : 0), 0)
                }
                city.agent.inventories.push(inventory);
            });
        });
        return promise;
    };

    app.addNewPoliticalAgent = function (city) {
        let randomIndex = round(Math.max(Math.random()*app.staticData.syndicates.length - 1, 0), 0);
        let randomSyndicate = JSON.parse(JSON.stringify(app.staticData.syndicates[randomIndex]));
        randomSyndicate.support = round((Math.random()), 2);
        randomSyndicate.trend = round((Math.random()*0.04 + 0.01), 2);
        randomSyndicate.opposition = round((Math.random()), 2);
        randomSyndicate.id = city.politics.length;

        city.politics.push(randomSyndicate);
    };

    app.addNewFeature = function (city) {
        let randomIndex = round(Math.max(Math.random()*app.staticData.features.length - 1, 0), 0);
        let randomFeature = JSON.parse(JSON.stringify(app.staticData.features[randomIndex]));
        randomFeature.factor = round((Math.random() + 1 ), 2);
        randomFeature.id = city.features.length;

        city.features.push(randomFeature);
    };

    app.calculateBaseProductionCost = function() {
        app.market.goods.forEach(good => {
            good.production.forEach(item => {
                good.basePrice += round(app.market.goods.filter(x => x.name == item.good)[0].basePrice*item.quantity, 2);
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
            good.historicalMean[app.currentTurn].value = (total == 0 ? good.basePrice : round(total/count, 2));
        });
    };

    app.getAverageHistoricalMean = function(good) {
        let total = 0;
        let count = 0;
        good.historicalMean.forEach(turnData => {
            count++;
            total += turnData.value;
        });
        return round(total/count, 2);
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
            app.generateNewCity();
            app.generateNewCity();
            app.cityData.forEach(city => {
                app.calculateCity(city).then(() => {
                    app.generateInitialCityInventoriesBasedOnUpkeep(city);
                });
            });
            resolve();
        });
        
        initPromise.then(() => {
            app.refreshCards();
        });
        
        $('.calculate-btn').on('click', () => {
            app.cityData.forEach(city => {
                app.calculateCity(city);
            });
            app.refreshCards();
        });

        $('.add-new-btn').on('click', () => {
            app.generateNewCity();
            app.refreshCards();
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