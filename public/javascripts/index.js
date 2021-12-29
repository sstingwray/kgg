(function() {
    'use strict';

    let app = {
        parameters: {
            animationDelay: 300
        },
        data: {
            rarity: [
                'Обычное',
                'Необычное',
                'Редкое',
                'Очень редкое'
            ],
            treasureGen: {
                antiqueTypes: [
                    'Статуэтки',
                    'Рисунки',
                    'Тексты',
                    'Утварь'
                ],
                artisanalGoodTypes: [
                    'Одежда',
                    'Инструмент',
                    'Пища',
                    'Материал'
                ],
                financialGoodTypes: [
                    'Облигации',
                    'Свидетельства',
                    'Закладные',
                    'Акции'
                ],
                bioGoodTypes: [
                    'Мясо',
                    'Шкуры',
                    'Кости',
                    'Органы'
                ],
            }
        },
        gizmoPatterns: {
            treasureGen: {
                title:'Генератор Фэнтези Сокровищ',
                btnCaller: 'treasureGen',
                class: 'treasure-gen',
            },
            politicGen: {
                title:'Генератор политического компаса',
                btnCaller: 'politicGen',
                class: 'politic-gen',
            },
            econMarketSim: {
                title: 'Симулятор Рыночной Экономики',
                btnCaller: 'econMarketSim',
                class: 'market-econ-sim'
            }
        },
        btnPatterns: {
            treasureGen: {
                title: 'Генератор Фэнтези Сокровищ',
                type: 'gizmo',
                destination: 'treasureGen'
            },
            /*nuAvalon: {
                title: '[WIP] Экономика Ню-Авалона',
                type: 'link',
                destination: './nu-avalon'
            },*/
            politicGen: {
                title: 'Генератор политического компаса',
                type: 'gizmo',
                destination: 'politicGen'
            },
            econMarketSim: {
                title: 'Симулятор Рыночной Экономики',
                type: 'gizmo',
                destination: 'econMarketSim'
            },
        },
        components: {
            spinner: {},
            btnClose: {},
            btnTemplate: {},
            switchTemplate: {},
            gizmoTemplate: {}
        },
        containers: {
            btnPanel: {},
            treasureKnobsPanel: {}
        },
        marketEconSimModule: {
            defaultAgent: {
                name: 'Брокер',
                nameTag: 0,
                wallet: 3000,
                durability: 10,
                bailOutChance: true,
                type: 'trader',
                lastTurnProfit: 0,
                turnsWithoutProfit: 0,
                upkeepRules: [
                    {
                        good: 'food',
                        quantity: 3
                    },
                    {
                        good: 'goods',
                        quantity: 1
                    },
                ],
                inventory: {
                    manpower: 0,
                    fuel: 0,
                    food: 0,
                    alloys: 0,
                    goods: 0,
                },
                priceBeliefs: {
                    manpower: {
                        upperLimit: 3,
                        lowerLimit: 1
                    },
                    fuel: {
                        upperLimit: 3,
                        lowerLimit: 1
                    },
                    food: {
                        upperLimit: 3,
                        lowerLimit: 1
                    },
                    alloys: {
                        upperLimit: 3,
                        lowerLimit: 1
                    },
                    goods: {
                        upperLimit: 3,
                        lowerLimit: 1
                    },
                }
            },
            market: {
                currentTurn: 0,
                currentAgents: [],
                currentAsks: [],
                currentLots: [],
                currentDeals: [],
                goodHistoricalMeans: {
                    manpower: 1,
                    fuel: 1,
                    food: 1,
                    alloys: 1,
                    goods: 1,
                },
                topGoodType: 'manpower',
                bailOutAgent: {
                    name: 'Большой Брат',
                    wallet: 3000,
                    inventory: {
                        manpower: 0,
                        fuel: 0,
                        food: 0,
                        alloys: 0,
                        goods: 0,
                    },
                },
            },
            productionRuleSets: {
                trader: {
                    name: 'Торговец',
                    rules: [],
                },
                farmer: {
                    name: 'Фермер',
                    rules: [
                        {
                            name: 'farming',
                            components: [
                                {
                                    key: 'manpower',
                                    quantity: 2
                                }
                            ],
                            outputs: [
                                {
                                    key: 'food',
                                    quantity: 3
                                },
                            ],
                        }
                    ],
                },
                synthesist: {
                    name: 'Синтезатор',
                    rules: [
                        {
                            name: 'synthesis',
                            components: [
                                {
                                    key: 'fuel',
                                    quantity: 2
                                }
                            ],
                            outputs: [
                                {
                                    key: 'food',
                                    quantity: 2
                                },
                            ],
                        }
                    ],
                },
                supplier: {
                    name: 'Снабженец',
                    rules: [
                        {
                            name: 'professional',
                            components: [
                                {
                                    key: 'goods',
                                    quantity: 2
                                },
                            ],
                            outputs: [
                                {
                                    key: 'manpower',
                                    quantity: 2
                                },
                            ],
                        }
                    ]
                },
                recruiter: {
                    name: 'Рекрутер',
                    rules: [
                        {
                            name: 'mass',
                            components: [
                                {
                                    key: 'food',
                                    quantity: 2
                                }
                            ],
                            outputs: [
                                {
                                    key: 'manpower',
                                    quantity: 1
                                },
                            ],
                        }
                    ]
                },
                refiner: {
                    name: 'Энергетик',
                    rules: [
                        {
                            name: 'refining',
                            components: [
                                {
                                    key: 'manpower',
                                    quantity: 2
                                }
                            ],
                            outputs: [
                                {
                                    key: 'fuel',
                                    quantity: 2
                                },
                            ],
                        }
                    ],
                },
                smelter: {
                    name: 'Металлург',
                    rules: [
                        {
                            name: 'smelting',
                            components: [
                                {
                                    key: 'fuel',
                                    quantity: 2
                                }
                            ],
                            outputs: [
                                {
                                    key: 'alloys',
                                    quantity: 2
                                },
                            ],
                        }
                    ],
                },
                artisan: {
                    name: 'Ремесленник',
                    rules: [
                        {
                            name: 'manufacturing',
                            components: [
                                {
                                    key: 'alloys',
                                    quantity: 2
                                },
                            ],
                            outputs: [
                                {
                                    key: 'goods',
                                    quantity: 2
                                },
                            ],
                        }
                    ],
                }
            },
            goods: {
                manpower: {
                    name: 'Рабочие',
                    baseCost: 0,
                },
                fuel: {
                    name: 'Топливо',
                    baseCost: 0,
                },
                food: {
                    name: 'Пища',
                    baseCost: 0,
                },
                alloys: {
                    name: 'Сплавы',
                    baseCost: 0,
                },
                goods: {
                    name: 'Товары',
                    baseCost: 0,
                },
            }
        }

    }

    app.fabricateButton = (btnPattern) => {
        let newBtn = app.components.btnTemplate.cloneNode(true);

        newBtn.classList.add('generated');
        newBtn.classList.remove ('template');

        newBtn.innerHTML = btnPattern.title;

        switch (btnPattern.type) {
            case 'gizmo':
                $(newBtn).on('click', () => {
                    $('.gizmo.' + app.gizmoPatterns[btnPattern.destination].class).show();
                    $('.gizmo.' + app.gizmoPatterns[btnPattern.destination].class).addClass('active');
                    $(app.components.btnClose).show();
                    $(app.components.btnClose).addClass('active');
                    $('.main-content-block').addClass('blurred');
                    $('body').addClass('locked');
                });
                break;
            case 'link':
                $(newBtn).on('click', () => {
                    window.open(btnPattern.destination, '_blank');
                });
                break;
            default:

                break;
        }
        app.containers.btnPanel.appendChild(newBtn);

    };

    app.fabricateSwitch = (container, labelText, checkboxClass, checked = true, hintText = '') => {
        let newSwitch = app.components.switchTemplate.cloneNode(true);
        
        newSwitch.classList.add('generated');
        newSwitch.classList.remove ('template');
        newSwitch.querySelector('.label').innerHTML = labelText;
        newSwitch.querySelector('.label').title = hintText;
        newSwitch.querySelector('.switch').classList.add(checkboxClass);
        newSwitch.querySelector('input').checked = checked;

        container.appendChild(newSwitch);
    }

    app.fabricateGizmo = (gizmoPattern) => {
        let newGizmo = app.components.gizmoTemplate.cloneNode(true);

        newGizmo.classList.add('generated ' && gizmoPattern.class);
        newGizmo.classList.remove ('template');

        newGizmo.querySelector('.title').innerHTML = gizmoPattern.title;
        app.fabricateButton(app.btnPatterns[gizmoPattern.btnCaller]);
        $(newGizmo).hide();
        document.body.appendChild(newGizmo);
    };

    //TREASUREGEN
    app.treasureTradeouts = () => {
        let gizmo = document.querySelector('.gizmo.treasure-gen');
        let resultTemplate = gizmo.querySelector('.gen-container.template');
        let resultItemTemplate = gizmo.querySelector('.gen-item.template');
        let resultContainer = gizmo.querySelector('.gen-results');

        let isSWModifier = gizmo.querySelector('.sw-base-multiplier > input').checked;
        let is5000Tradeout = gizmo.querySelector('.sw-5000-tradeout > input').checked;
        let is1000Tradeout = gizmo.querySelector('.sw-1000-tradeout > input').checked;
        let is100Tradeout = gizmo.querySelector('.sw-100-tradeout > input').checked;
        let isAntiqueTradeout = gizmo.querySelector('.sw-antique-tradeout > input').checked;
        let isArtisanGoodsTradeout = gizmo.querySelector('.sw-artisan-goods-tradeout > input').checked;
        let isBioGoodsTradeout = gizmo.querySelector('.sw-bio-goods-tradeout > input').checked;

        let basePool = gizmo.querySelector('.input-value').value;
        let timestamp = new Date();

        let newResultLine = resultTemplate.cloneNode(true);

        newResultLine.classList.add('generated');
        newResultLine.classList.remove ('template');

        let fnPrependNewItem = (type = null, description = null, gpValue = null, weight = null, rarity = null, text = null) => {
            let newResultItem = resultItemTemplate.cloneNode(true);
            newResultItem.classList.add('generated');
            newResultItem.classList.remove ('template');
            newResultItem.querySelector('.item-text').innerHTML = text;
            newResultItem.querySelector('.item-type > .label').innerHTML = (type != null ? 'Тип: ' : '');
            newResultItem.querySelector('.item-type > .value').innerHTML = (type != null ? type : '');
            newResultItem.querySelector('.item-rarity > .label').innerHTML = (rarity != null ? 'Редкость: ' : '');
            newResultItem.querySelector('.item-rarity > .value').innerHTML = (rarity != null ? rarity : '');
            newResultItem.querySelector('.item-description > .label').innerHTML = (description != null ? 'Описание: ' : '');
            newResultItem.querySelector('.item-description > .value').innerHTML = (description != null ? description : '');
            newResultItem.querySelector('.item-value > .label').innerHTML = (gpValue != null ? 'Стоимость: ' : '');
            newResultItem.querySelector('.item-value > .value').innerHTML = (gpValue != null ? gpValue : '');
            newResultItem.querySelector('.item-weight > .label').innerHTML = (weight != null ? 'Вес, фунты: ' : '');
            newResultItem.querySelector('.item-weight > .value').innerHTML = (weight != null ? weight : '');

            newResultLine.prepend(newResultItem);
        };

        //$('.sw-gen-container.generated').remove();

        let calculation = new Promise ((resolve) => {
            let totalGold = (isSWModifier ? (Math.floor(Math.random()*3) + 1)*basePool : basePool);
            
            resolve(totalGold);
        }).then((gold) => {
            if (is5000Tradeout) {
                let tradeouts5000 = Math.floor(gold/5000);
                let resultsInit = [...Array(tradeouts5000).keys()].map(x => x = Math.round(Math.random()*9) + 1).filter(x => x === 1).length;
                let resultsTypes = [...Array(resultsInit).keys()].map(x => x = Math.round(Math.random()*19) + 1);

                let resultsMajorGemsTypes = resultsTypes.filter(x => x < 20).map(x => x = Math.round(Math.random()*3) + 1);
                let resultsMajorGemsTypeOne = resultsMajorGemsTypes.filter(x => x === 1).map(x => x = (Math.round(Math.random()*99) + 1)*10);
                let resultsMajorGemsTypeTwo = resultsMajorGemsTypes.filter(x => x === 2).map(x => x = (Math.round(Math.random()*99) + 1)*80);
                let resultsMajorGemsTypeThree = resultsMajorGemsTypes.filter(x => x === 3).map(x => x = (Math.round(Math.random()*99) + 1)*120);
                let resultsMajorGemsTypeFour = resultsMajorGemsTypes.filter(x => x === 4).map(x => x = (Math.round(Math.random()*99) + 1)*200);

                let totalGems = resultsMajorGemsTypeOne.concat(resultsMajorGemsTypeTwo).concat(resultsMajorGemsTypeThree).concat(resultsMajorGemsTypeFour);

                let resultsMajorMagicItemTypes = resultsTypes.filter(x => x === 20).map(x => x = Math.round(Math.random()*3) + 1);
                let resultsMajorMagicItemTypeOne = resultsMajorMagicItemTypes.filter(x => x === 1).map(x => x = Math.round(Math.random()*99) + 1 + ', ' + Math.round(Math.random()*99) + 1 + ', ' + Math.round(Math.random()*99) + 1 + ', ' + Math.round(Math.random()*99) + 1 + ', ' + Math.round(Math.random()*99) + 1 + ', ' + Math.round(Math.random()*99) + 1 + ', ' + Math.round(Math.random()*99) + 1);
                let resultsMajorMagicItemTypeTwo = resultsMajorMagicItemTypes.filter(x => x === 2).map(x => x = Math.round(Math.random()*5) + 1 + 12);
                let resultsMajorMagicItemTypeThree = resultsMajorMagicItemTypes.filter(x => x === 3).map(x => x = Math.round(Math.random()*5) + 1 + 12);
                let resultsMajorMagicItemTypeFour = resultsMajorMagicItemTypes.filter(x => x === 4).map(x => x = Math.round(Math.random()*19) + 1 + 40);

                console.log('Total gold pool for [' + timestamp.toLocaleTimeString() + ']: ' + gold);

                if (resultsInit > 0) {
                    gold -= resultsInit*5000;

                    if (resultsMajorMagicItemTypeOne.length > 0) {
                        for (let item of resultsMajorMagicItemTypeOne) {
                            fnPrependNewItem('5000gp обмен', 'Potion #' + item + ' (Table 85)');
                        };
                    };
                    if (resultsMajorMagicItemTypeTwo.length > 0) {
                        for (let item of resultsMajorMagicItemTypeTwo) {
                            fnPrependNewItem('5000gp обмен', 'Scroll #' + item + ' (Table 86)');
                        };
                    };
                    if (resultsMajorMagicItemTypeThree.length > 0) {
                        for (let item of resultsMajorMagicItemTypeThree) {
                            fnPrependNewItem('5000gp обмен', 'Magic Item #' + item + ' (Table 89)');
                        };
                    };
                    if (resultsMajorMagicItemTypeFour.length > 0) {
                        for (let item of resultsMajorMagicItemTypeFour) {
                            fnPrependNewItem('5000gp обмен', 'Magic Item #' + item + ' (Table 98)');
                        };
                    };
                    if (totalGems.length > 0) {
                        for (let item of totalGems) {
                            fnPrependNewItem('5000gp обмен', 'Major Gem', item);
                        };
                    };
                    
                };
            };
            
            return gold
        }).then((gold) => {
            if (is1000Tradeout) {
                let tradeouts1000 = Math.floor(gold/1000);
                let resultsInit = [...Array(tradeouts1000).keys()].map(x => x = Math.round(Math.random()*9) + 1).filter(x => x === 1).length;
                let resultsTypes = [...Array(resultsInit).keys()].map(x => x = Math.round(Math.random()*19) + 1);

                let resultsMediumGemsTypes = resultsTypes.filter(x => x < 20).map(x => x = Math.round(Math.random()*3) + 1);
                let resultsMediumGemsTypeOne = resultsMediumGemsTypes.filter(x => x === 1).map(x => x = Math.round(Math.random()*99) + 1);
                let resultsMediumGemsTypeTwo = resultsMediumGemsTypes.filter(x => x === 2).map(x => x = (Math.round(Math.random()*5) + 1)*200);
                let resultsMediumGemsTypeThree = resultsMediumGemsTypes.filter(x => x === 3).map(x => x = (Math.round(Math.random()*5) + 1)*300);
                let resultsMediumGemsTypeFour = resultsMediumGemsTypes.filter(x => x === 4).map(x => x = (Math.round(Math.random()*99) + 1)*100);

                let totalGems = resultsMediumGemsTypeOne.concat(resultsMediumGemsTypeTwo).concat(resultsMediumGemsTypeThree).concat(resultsMediumGemsTypeFour);

                let resultsMediumMagicItemTypes = resultsTypes.filter(x => x === 20).map(x => x = Math.round(Math.random()*3) + 1);
                let resultsMediumMagicItemTypeOne = resultsMediumMagicItemTypes.filter(x => x === 1).map(x => x = Math.round(Math.random()*99) + 1 + ', ' + Math.round(Math.random()*99) + 1 + ', ' + Math.round(Math.random()*99) + 1);
                let resultsMediumMagicItemTypeTwo = resultsMediumMagicItemTypes.filter(x => x === 2).map(x => x = Math.round(Math.random()*5) + 1 + 6);
                let resultsMediumMagicItemTypeThree = resultsMediumMagicItemTypes.filter(x => x === 3).map(x => x = Math.round(Math.random()*5) + 1 + 6);
                let resultsMediumMagicItemTypeFour = resultsMediumMagicItemTypes.filter(x => x === 4).map(x => x = Math.round(Math.random()*19) + 1 + 20);
                
                if (resultsInit > 0) {
                    gold -= resultsInit*1000;

                    if (resultsMediumMagicItemTypeOne.length > 0) {
                        for (let item of resultsMediumMagicItemTypeOne) {
                            fnPrependNewItem('1000gp обмен', 'Potion #' + item + ' (Table 85)');
                        };
                    };
                    if (resultsMediumMagicItemTypeTwo.length > 0) {
                        for (let item of resultsMediumMagicItemTypeTwo) {
                            fnPrependNewItem('1000gp обмен', 'Scroll #' + item + ' (Table 86)');
                        };
                    };
                    if (resultsMediumMagicItemTypeThree.length > 0) {
                        for (let item of resultsMediumMagicItemTypeThree) {
                            fnPrependNewItem('1000gp обмен', 'Magic Item #' + item + ' (Table 89)');
                        };
                    };
                    if (resultsMediumMagicItemTypeFour.length > 0) {
                        for (let item of resultsMediumMagicItemTypeFour) {
                            fnPrependNewItem('1000gp обмен', 'Magic Item #' + item + ' (Table 98)');
                        };
                    };
                    if (totalGems.length > 0) {
                        for (let item of totalGems) {
                            fnPrependNewItem('1000gp обмен', 'Medium Gem', item);
                        };
                    };
                };
            };

            return gold
        }).then((gold) => {
            if (is100Tradeout) {
                let tradeouts100 = Math.floor(gold/100);
                let resultsInit = [...Array(tradeouts100).keys()].map(x => x = Math.round(Math.random()*9) + 1).filter(x => x === 1).length;
                let resultsTypes = [...Array(resultsInit).keys()].map(x => x = Math.round(Math.random()*19) + 1);

                let resultsMinorGemsTypes = resultsTypes.filter(x => x < 20).map(x => x = Math.round(Math.random()*3) + 1);
                let resultsMinorGemsTypeOne = resultsMinorGemsTypes.filter(x => x === 1).map(x => x = Math.round(Math.random()*5) + 1);
                let resultsMinorGemsTypeTwo = resultsMinorGemsTypes.filter(x => x === 2).map(x => x = Math.round(Math.random()*99) + 1 + 25);
                let resultsMinorGemsTypeThree = resultsMinorGemsTypes.filter(x => x === 3).map(x => x = Math.round(Math.random()*99) + 1 + 75);
                let resultsMinorGemsTypeFour = resultsMinorGemsTypes.filter(x => x === 4).map(x => x = (Math.round(Math.random()*99) + 1)*10);
                let totalGems = resultsMinorGemsTypeOne.concat(resultsMinorGemsTypeTwo).concat(resultsMinorGemsTypeThree).concat(resultsMinorGemsTypeFour);

                let resultsMinorMagicItemTypes = resultsTypes.filter(x => x === 20).map(x => x = Math.round(Math.random()*3) + 1);
                let resultsMinorMagicItemTypeOne = resultsMinorMagicItemTypes.filter(x => x === 1).map(x => x = Math.round(Math.random()*99) + 1);
                let resultsMinorMagicItemTypeTwo = resultsMinorMagicItemTypes.filter(x => x === 2).map(x => x = Math.round(Math.random()*5) + 1);
                let resultsMinorMagicItemTypeThree = resultsMinorMagicItemTypes.filter(x => x === 3).map(x => x = Math.round(Math.random()*5) + 1);
                let resultsMinorMagicItemTypeFour = resultsMinorMagicItemTypes.filter(x => x === 4).map(x => x = Math.round(Math.random()*19) + 1);

                if (resultsInit > 0) {
                    gold -= resultsInit*100;

                    if (resultsMinorMagicItemTypeOne.length > 0) {
                        for (let item of resultsMinorMagicItemTypeOne) {
                            fnPrependNewItem('100gp обмен', 'Potion #' + item + ' (Table 85)');
                        };
                    };
                    if (resultsMinorMagicItemTypeTwo.length > 0) {
                        for (let item of resultsMinorMagicItemTypeTwo) {
                            fnPrependNewItem('100gp обмен', 'Scroll #' + item + ' (Table 86)');
                        };
                    };
                    if (resultsMinorMagicItemTypeThree.length > 0) {
                        for (let item of resultsMinorMagicItemTypeThree) {
                            fnPrependNewItem('100gp обмен', 'Magic Item #' + item + ' (Table 89)');
                        };
                    };
                    if (resultsMinorMagicItemTypeFour.length > 0) {
                        for (let item of resultsMinorMagicItemTypeFour) {
                            fnPrependNewItem('100gp обмен', 'Magic Item #' + item + ' (Table 98)');
                        };
                    };
                    if (totalGems.length > 0) {
                        for (let item of totalGems) {
                            console.log(item);
                            fnPrependNewItem('100gp обмен', 'Minor Gem', item);
                        };
                    };
                };
            };

            return gold
        }).then((gold) => {
            if (isAntiqueTradeout) {
                let tradeoutAmount = Math.round(gold*Math.random());
                let tradeoutNumber = Math.round(Math.random()*3) + 1;
                let tradeoutsAntique = Math.floor(tradeoutAmount/tradeoutNumber);
                let resultsTypes = [...Array(tradeoutNumber).keys()].map(x => x = ({ typeNum: Math.round(Math.random()*19) + 1 }));

                let resultsAntiqueTypeOne = resultsTypes.filter(x => x.typeNum <= 10).map(x => ({
                    ...x,
                    rarity: app.data.rarity[0],
                    gpValue: Math.round((Math.random()*0.5)*tradeoutsAntique),
                    description: app.data.treasureGen.antiqueTypes[Math.round(Math.random()*3)],
                    weight: Math.round(Math.random()*19) + 1,
                    type: 'Антиквариат',
                }));

                let resultsAntiqueTypeTwo = resultsTypes.filter(x => x.typeNum > 10 && x.typeNum <= 15).map(x => ({
                    ...x,
                    rarity: app.data.rarity[1],
                    gpValue: Math.round((Math.random()*0.5 + 0.5)*tradeoutsAntique),
                    description: app.data.treasureGen.antiqueTypes[Math.round(Math.random()*3)],
                    weight: Math.round(Math.random()*19) + 1,
                    type: 'Антиквариат',
                }));

                let resultsAntiqueTypeThree = resultsTypes.filter(x => x.typeNum > 15 && x.typeNum <= 18).map(x => ({
                    ...x,
                    rarity: app.data.rarity[2],
                    gpValue: Math.round((Math.random()*0.5 + 1)*tradeoutsAntique),
                    description: app.data.treasureGen.antiqueTypes[Math.round(Math.random()*3)],
                    weight: Math.round(Math.random()*19) + 1,
                    type: 'Антиквариат',
                }));

                let resultsAntiqueTypeFour = resultsTypes.filter(x => x.typeNum > 18).map(x => ({
                    ...x,
                    rarity: app.data.rarity[3],
                    gpValue: Math.round((Math.random()*0.5 + 1.5)*tradeoutsAntique),
                    description: app.data.treasureGen.antiqueTypes[Math.round(Math.random()*3)],
                    weight: Math.round(Math.random()*19) + 1,
                    type: 'Антиквариат',
                }));

                let totalAntiques = resultsAntiqueTypeOne.concat(resultsAntiqueTypeTwo).concat(resultsAntiqueTypeThree).concat(resultsAntiqueTypeFour);

                if (tradeoutAmount > 50) {
                    gold -= tradeoutAmount;

                    if (totalAntiques.length > 0) {
                        for (let item of totalAntiques) {
                            fnPrependNewItem(item.type, item.description, item.gpValue, item.weight, item.rarity);
                        };
                    };
                };
            };

            return gold
        }).then((gold) => {
            if (isArtisanGoodsTradeout) {
                let tradeoutAmount = Math.round(gold*Math.random());
                let tradeoutNumber = Math.round(Math.random()*3) + 1;
                let tradeoutsArtisanGoods = Math.floor(tradeoutAmount/tradeoutNumber);
                let resultsTypes = [...Array(tradeoutNumber).keys()].map(x => x = ({ typeNum: Math.round(Math.random()*19) + 1 }));

                let resultsArtisanGoodsTypeOne = resultsTypes.filter(x => x.typeNum <= 10).map(x => ({
                    ...x,
                    rarity: app.data.rarity[0],
                    gpValue: Math.round((Math.random()*0.5)*tradeoutsArtisanGoods),
                    description: app.data.treasureGen.artisanalGoodTypes[Math.round(Math.random()*3)],
                    weight: Math.round(Math.random()*19) + 1,
                    type: 'Ремесло',
                }));

                let resultsArtisanGoodsTypeTwo = resultsTypes.filter(x => x.typeNum > 10 && x.typeNum <= 15).map(x => ({
                    ...x,
                    rarity: app.data.rarity[1],
                    gpValue: Math.round((Math.random()*0.5 + 0.5)*tradeoutsArtisanGoods),
                    description: app.data.treasureGen.artisanalGoodTypes[Math.round(Math.random()*3)],
                    weight: Math.round(Math.random()*19) + 1,
                    type: 'Ремесло',
                }));

                let resultsArtisanGoodsTypeThree = resultsTypes.filter(x => x.typeNum > 15 && x.typeNum <= 18).map(x => ({
                    ...x,
                    rarity: app.data.rarity[2],
                    gpValue: Math.round((Math.random()*0.5 + 1)*tradeoutsArtisanGoods),
                    description: app.data.treasureGen.artisanalGoodTypes[Math.round(Math.random()*3)],
                    weight: Math.round(Math.random()*19) + 1,
                    type: 'Ремесло',
                }));

                let resultsArtisanGoodsTypeFour = resultsTypes.filter(x => x.typeNum > 18).map(x => ({
                    ...x,
                    rarity: app.data.rarity[3],
                    gpValue: Math.round((Math.random()*0.5 + 1.5)*tradeoutsArtisanGoods),
                    description: app.data.treasureGen.artisanalGoodTypes[Math.round(Math.random()*3)],
                    weight: Math.round(Math.random()*19) + 1,
                    type: 'Ремесло',
                }));

                let totalArtisanGoods = resultsArtisanGoodsTypeOne.concat(resultsArtisanGoodsTypeTwo).concat(resultsArtisanGoodsTypeThree).concat(resultsArtisanGoodsTypeFour);

                if (tradeoutAmount > 50) {
                    gold -= tradeoutAmount;

                    if (totalArtisanGoods.length > 0) {
                        for (let item of totalArtisanGoods) {
                            fnPrependNewItem(item.type, item.description, item.gpValue, item.weight, item.rarity);
                        };
                    };
                };
            };

            return gold
        }).then((gold) => {
            if (isBioGoodsTradeout) {
                let tradeoutNumber = Math.round(Math.random()*5) + 1;
                let tradeoutsBioGoods = Math.floor(gold/tradeoutNumber);
                let resultsTypes = [...Array(tradeoutNumber).keys()].map(x => x = ({ typeNum: Math.round(Math.random()*19) + 1 }));

                let resultsBioGoodsTypeOne = resultsTypes.filter(x => x.typeNum <= 10).map(x => ({
                    ...x,
                    rarity: app.data.rarity[0],
                    gpValue: Math.round((Math.random()*0.5)*tradeoutsBioGoods),
                    description: app.data.treasureGen.bioGoodTypes[Math.round(Math.random()*3)],
                    weight: Math.round(Math.random()*19) + 1,
                    type: 'Промысел',
                }));

                let resultsBioGoodsTypeTwo = resultsTypes.filter(x => x.typeNum > 10 && x.typeNum <= 15).map(x => ({
                    ...x,
                    rarity: app.data.rarity[1],
                    gpValue: Math.round((Math.random()*0.5 + 0.5)*tradeoutsBioGoods),
                    description: app.data.treasureGen.bioGoodTypes[Math.round(Math.random()*3)],
                    weight: Math.round(Math.random()*19) + 1,
                    type: 'Промысел',
                }));

                let resultsBioGoodsTypeThree = resultsTypes.filter(x => x.typeNum > 15 && x.typeNum <= 18).map(x => ({
                    ...x,
                    rarity: app.data.rarity[2],
                    gpValue: Math.round((Math.random()*0.5 + 1)*tradeoutsBioGoods),
                    description: app.data.treasureGen.bioGoodTypes[Math.round(Math.random()*3)],
                    weight: Math.round(Math.random()*19) + 1,
                    type: 'Промысел',
                }));

                let resultsBioGoodsTypeFour = resultsTypes.filter(x => x.typeNum > 18).map(x => ({
                    ...x,
                    rarity: app.data.rarity[3],
                    gpValue: Math.round((Math.random()*0.5 + 1.5)*tradeoutsBioGoods),
                    description: app.data.treasureGen.bioGoodTypes[Math.round(Math.random()*3)],
                    weight: Math.round(Math.random()*19) + 1,
                    type: 'Промысел',
                }));

                let totalBioGoods = resultsBioGoodsTypeOne.concat(resultsBioGoodsTypeTwo).concat(resultsBioGoodsTypeThree).concat(resultsBioGoodsTypeFour);

                if (totalBioGoods.length > 0) {
                    for (let item of totalBioGoods) {
                        fnPrependNewItem(item.type, item.description, item.gpValue, item.weight, item.rarity);
                    };
                };

                gold = 0;
            };

            return gold
        }).then((gold) => {
            if (gold > 0) {
                fnPrependNewItem(null, 'Валюта', gold);
            };
        });

        calculation.then(() => {
            fnPrependNewItem(null, null, null, null, null, '[' + timestamp.toLocaleTimeString() + ']');
            resultContainer.prepend(newResultLine);
        });        
    };

    //POLCOMPASS
    app.fabricatePoliticalAgent = () => {
        let gizmo = document.querySelector('.gizmo.politic-gen');
        let agentsContainer = gizmo.querySelector('table.politic-gen-agents > tbody');
        let agentRowTemplate = gizmo.querySelector('.politic-gen-agent.template');
        let newAgentRow = agentRowTemplate.cloneNode(true);

        newAgentRow.classList.add('generated');
        newAgentRow.classList.remove ('template');

        newAgentRow.querySelector('td.tag > input').value = 'ABCD';
        newAgentRow.querySelector('td.trad-prog > input').value = round(Math.random(), 2);
        newAgentRow.querySelector('td.contr-freed > input').value = round(Math.random(), 2);

        $(newAgentRow.querySelectorAll('td > input')).on('change', () => {
            app.drawPoliticCanvas();
        });

        $(newAgentRow.querySelector('td > select')).on('change', (event) => {
            event.currentTarget.value = $("option:selected", event.currentTarget).val();
            app.drawPoliticCanvas();
        });

        $(newAgentRow.querySelector('td > .remove')).on('click', (event) => {
            $(event.currentTarget).closest('tr').remove();
            app.drawPoliticCanvas();
        });

        agentsContainer.appendChild(newAgentRow);
        app.drawPoliticCanvas();
    };

    app.drawPoliticCanvas = () => {
        let actorRows = $('.politic-gen-agent.generated');
        let canvasBack = document.querySelector('.politic-canvas.back');
        let canvasFront = document.querySelector('.politic-canvas.front');
        let contextBack = canvasBack.getContext("2d");
        let contextFront = canvasFront.getContext("2d");
        let canvasWidth = canvasFront.width;
        let heightRatio = 1;
        let canvasHeight = canvasWidth*heightRatio;

        canvasBack.height = canvasHeight;
        canvasFront.height = canvasHeight;

        contextBack.clearRect(0, 0, canvasWidth, canvasHeight);
        contextFront.clearRect(0, 0, canvasWidth, canvasHeight);

        contextBack.fillStyle = '#F1F4F4';
        contextBack.strokeStyle = '#F1F4F4';
        contextBack.lineWidth = 1;
        contextBack.textAlign = 'center';
        contextBack.textBaseline = 'middle'

        contextFront.fillStyle = '#F1F4F4';
        contextFront.strokeStyle = '#F1F4F4';
        contextFront.lineWidth = 1;
        contextFront.textAlign = 'center';
        contextFront.textBaseline = 'middle'

        //top line
        contextBack.moveTo(canvasWidth/2, 0);
        contextBack.lineTo(canvasWidth/2, canvasHeight/4);
        contextBack.stroke();

        //left line
        contextBack.moveTo(0, canvasHeight/2);
        contextBack.lineTo(canvasWidth/4, canvasHeight/2);
        contextBack.stroke();

        //bottom line
        contextBack.moveTo(canvasWidth/2, canvasHeight);
        contextBack.lineTo(canvasWidth/2, canvasHeight - canvasHeight/4);
        contextBack.stroke();

        //left line
        contextBack.moveTo(canvasWidth, canvasHeight/2);
        contextBack.lineTo(canvasWidth - canvasWidth/4, canvasHeight/2);
        contextBack.stroke();

        //top-to-left line
        contextBack.moveTo(canvasWidth/2, canvasHeight/4);
        contextBack.lineTo(canvasWidth/4, canvasHeight/2);
        contextBack.stroke();

        //left-to-bottom line
        contextBack.moveTo(canvasWidth/4, canvasHeight/2);
        contextBack.lineTo(canvasWidth/2, canvasHeight - canvasHeight/4);
        contextBack.stroke();

        //bottom-to-right line
        contextBack.moveTo(canvasWidth/2, canvasHeight - canvasHeight/4);
        contextBack.lineTo(canvasWidth - canvasWidth/4, canvasHeight/2);
        contextBack.stroke();

        //right-to-top line
        contextBack.moveTo(canvasWidth - canvasWidth/4, canvasHeight/2);
        contextBack.lineTo(canvasWidth/2, canvasHeight/4);
        contextBack.stroke();

        contextBack.fillText('Прогресс', canvasWidth/6, canvasHeight/8);
        contextBack.fillText('Контроль', canvasWidth/6, canvasHeight - canvasHeight/6);
        contextBack.fillText('Традиции', canvasWidth - canvasWidth/6, canvasHeight - canvasHeight/6);
        contextBack.fillText('Свобода', canvasWidth - canvasWidth/6, canvasHeight/8);
        contextBack.fillText('Центризм', canvasWidth/2, canvasHeight/2);

        let drawActorPip = (actor) => {
            let x = actor.querySelector('td.trad-prog > input').value;
            let y = actor.querySelector('td.contr-freed > input').value;
            let tag = actor.querySelector('td.tag > input').value;
            let padding = 25;

            (canvasWidth*x > canvasWidth - padding ? x = (canvasWidth - padding)/canvasWidth : (canvasWidth*x < padding ? x = padding/canvasWidth : ''));
            (canvasWidth*y > canvasWidth - padding ? y = (canvasWidth - padding)/canvasWidth : (canvasWidth*y < padding ? y = padding/canvasWidth : ''));

            return new Promise ((resolve) => {
                contextFront.strokeStyle = actor.querySelector('td.color > select').value;
                contextFront.lineWidth = 8;
                contextFront.beginPath();
                contextFront.arc(canvasWidth*x, canvasHeight*y, 20, 0, 2*Math.PI);
                contextFront.stroke();
                contextFront.fill();
                resolve();
            }).then(() => {
                contextFront.fillStyle = '#282424';
                contextFront.fillText(tag, canvasWidth*x, canvasHeight*y);
            });
        };

        for (let actor of actorRows) {
            drawActorPip(actor);
        };
    };

    //ECONSIM
    app.fabricateNewEconAgent = () => {
        let newAgent = JSON.parse(JSON.stringify(app.marketEconSimModule.defaultAgent));

        newAgent.nameTag += app.marketEconSimModule.market.currentAgents.length;
        newAgent.name += ' #' + newAgent.nameTag;
        newAgent.type = Object.keys(app.marketEconSimModule.productionRuleSets)[Math.floor(Object.keys(app.marketEconSimModule.productionRuleSets).length*Math.random())];

        Object.keys(newAgent.inventory).forEach(key => {
            newAgent.inventory[key] = round(Math.random()*100 + 100, 0);
        });

        app.marketEconSimModule.market.currentAgents.push(newAgent);
    };

    app.marketTurnSimulation = () => {
        return new Promise (resolve => {
            let agentListingPromises = [];

            for (let agent of app.marketEconSimModule.market.currentAgents) {
                let createAgentListing = new Promise (resolve => {
                    let goodListingPromises = [];
                    agent.lastTurnProfit = 0;
                                
                    for (let goodKey of Object.keys(agent.inventory)) {
                        let createGoodListing = new Promise (resolve => {
                            let upkeepAmount = agent.upkeepRules.filter(x => x.good == goodKey).reduce((a, b) => a + b.quantity, 0);
                            let productionAmount = (app.marketEconSimModule.productionRuleSets[agent.type].rules.filter(x => x.outputs.filter(y => y.key== goodKey).length > 0).length > 0 ? - 500 : 0);
                            let transactionType = (agent.inventory[goodKey] > upkeepAmount*10 + productionAmount + 100 ? 'lot' : 'ask');
                            let transactionAmount = Math.abs(agent.inventory[goodKey] - upkeepAmount*10 - productionAmount - 100);
                            //console.log(agent.name + ' wants to ' + transactionType + ' ' + transactionAmount + ' of ' + goodKey);

                            switch (transactionType) {
                                case 'lot':
                                    {
                                        let mean = app.marketEconSimModule.market.goodHistoricalMeans[goodKey];
                                        let upperPriceLimit = agent.priceBeliefs[goodKey].upperLimit;
                                        let lowerPriceLimit = agent.priceBeliefs[goodKey].lowerLimit;
                                        let favorability = (mean > upperPriceLimit ? 1 : (mean < lowerPriceLimit ? 0.2 : Math.max(0.2, findNumberPosition(mean, lowerPriceLimit, upperPriceLimit))));
                                        let amount = round(favorability*transactionAmount, 0);

                                        if (amount > 0) {
                                            //console.log('Due to favorability of ' + round(favorability, 2) + ', the amount will instead be ' + amount);
                                            app.marketEconSimModule.market.currentLots.push({
                                                sellerName: agent.name,
                                                good: goodKey,
                                                quantity: amount,
                                                price: upperPriceLimit,
                                            });
                                        };
                                    };
                                    break;
                                case 'ask':
                                    { 
                                        let mean = app.marketEconSimModule.market.goodHistoricalMeans[goodKey];
                                        let upperPriceLimit = agent.priceBeliefs[goodKey].upperLimit;
                                        let lowerPriceLimit = agent.priceBeliefs[goodKey].lowerLimit;
                                        let favorability = (mean > upperPriceLimit ? 0.2 : (mean < lowerPriceLimit ? 1 : Math.max(0.2, 1 - findNumberPosition(mean, lowerPriceLimit, upperPriceLimit))));
                                        let amount = round(Math.min(favorability*transactionAmount, agent.wallet/upperPriceLimit), 0);

                                        if (amount > 0) {
                                            //console.log('Due to favorability of ' + round(favorability, 2) + ' or having money to buy only ' + round(agent.wallet/upperPriceLimit, 0) + ', the amount will instead be ' + amount);
                                            app.marketEconSimModule.market.currentAsks.push({
                                                buyerName: agent.name,
                                                good: goodKey,
                                                quantity: amount,
                                                price: lowerPriceLimit,
                                            });
                                        };
                                    };
                                    break;
                            };
                            resolve();
                        });
                        
                        goodListingPromises.push(createGoodListing);
                    };

                    Promise.all(goodListingPromises).then(() => {
                        resolve();
                    })
                });

                agentListingPromises.push(createAgentListing);
            };

            Promise.all(agentListingPromises).then(() => {
                let matchingPromises = [];
                let goodsDemand = [];

                for (let goodKey of Object.keys(app.marketEconSimModule.goods)) {
                    let matchGood = new Promise (resolve => {
                        let shuffledLots = shuffle(app.marketEconSimModule.market.currentLots.filter(x => x.good == goodKey));
                        let shuffledAsks = shuffle(app.marketEconSimModule.market.currentAsks.filter(x => x.good == goodKey));
                        let sortedLots = shuffledLots.sort((a, b) => (a.price > b.price) ? 1 : -1);
                        let sortedAsks = shuffledAsks.sort((a, b) => (a.price < b.price) ? 1 : -1);
                        let historicalMean = app.marketEconSimModule.market.goodHistoricalMeans[goodKey];
                        let supply = sortedLots.reduce((a, b) => a + historicalMean*b.quantity, 0);
                        let demand = sortedAsks.reduce((a, b) => a + historicalMean*b.quantity, 0);
                        let currentTurnMeanPriceForGood = [];
        
                        console.log('Lots for ' + goodKey);
                        console.log(sortedLots);
                        console.log('Asks for ' + goodKey);
                        console.log(sortedAsks);

                        let iterateDeals = (i, j) => {
                            return new Promise (resolve => {
                                
                                if (i >= sortedLots.length || j >= sortedAsks.length) resolve()
                                else {
                                    let seller = sortedLots[i];
                                    let sellerAgent = app.marketEconSimModule.market.currentAgents.filter(x => x.name == seller.sellerName)[0];

                                    let buyer = sortedAsks[j];
                                    let buyerAgent = app.marketEconSimModule.market.currentAgents.filter(x => x.name == buyer.buyerName)[0];

                                    let clearingPrice = round((buyer.price + seller.price)/2, 2);
                                    let quantity = Math.min(buyer.quantity, seller.quantity, Math.floor(buyerAgent.wallet/clearingPrice));
                                    let totalPrice = round(quantity*clearingPrice, 2);
                                    
                                    let buyerAgentPriceBeliefs = buyerAgent.priceBeliefs[goodKey];
                                    let buyerMarketShare = sortedLots.filter(x => x.name == buyer.buyerName).reduce((a, b) => a + b.price*b.quantity, 0);
                                    let buyerDisplacement = (Math.abs(round((buyerAgentPriceBeliefs.upperLimit + buyerAgentPriceBeliefs.lowerLimit)/2 - clearingPrice), 2))/(round((buyerAgentPriceBeliefs.upperLimit + buyerAgentPriceBeliefs.lowerLimit)/2, 2));
                                    
                                    let sellerAgentPriceBeliefs = sellerAgent.priceBeliefs[goodKey];
                                    let sellerMarketShare = sortedLots.filter(x => x.name == seller.sellerName).reduce((a, b) => a + b.price*b.quantity, 0);
                                    let sellerWeight = (seller.quantity == 0 && quantity == 0 ? 0 : seller.quantity/(seller.quantity + quantity));
                                    let sellerDisplacment = sellerWeight*(sellerAgentPriceBeliefs.upperLimit + sellerAgentPriceBeliefs.lowerLimit)/2;

                                    
                                    DealMatching: if (quantity >= 1) {
                                        let sellerOldInventory = sellerAgent.inventory[goodKey];
                                        buyer.quantity -= quantity;
                                        seller.quantity -= quantity;
                                        buyerAgent.inventory[goodKey] += quantity;
                                        sellerAgent.inventory[goodKey] -= quantity;
                                        buyerAgent.wallet -= totalPrice;
                                        sellerAgent.wallet += totalPrice;
                                        sellerAgent.lastTurnProfit += totalPrice;

                                        if (sellerAgent.inventory[goodKey] < 0) console.log('Agent ' + sellerAgent.name + ' inventory of ' + goodKey + ' became negative during Market Phase while being a seller! Was ' + sellerOldInventory + ', became ' + sellerAgent.inventory[goodKey] + '. Sold quantity was ' + quantity);
                
                                        currentTurnMeanPriceForGood.push(clearingPrice);
                                        //console.log(currentTurnMeanPriceForGood);
                
                                        app.marketEconSimModule.market.currentDeals.push({
                                            turn: app.marketEconSimModule.market.currentTurn,
                                            good: goodKey,
                                            buyer: buyerAgent.name,
                                            seller: sellerAgent.name,
                                            quantity: quantity,
                                            clearingPrice: clearingPrice,
                                            totalPrice: totalPrice
                                        });
                                    };

                                    PriceBeliefsAdjustment: {
                                        if (buyer.quantity/2 >= quantity) {
                                            buyerAgentPriceBeliefs.lowerLimit += round(buyerAgentPriceBeliefs.upperLimit/10, 2);
                                            buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round(buyerAgentPriceBeliefs.upperLimit/10, 2), buyerAgentPriceBeliefs.lowerLimit);
                                        } else {
                                            buyerAgentPriceBeliefs.upperLimit += round(buyerAgentPriceBeliefs.upperLimit/10, 2);
                                        };
                    
                                        if (buyerMarketShare < 1) {
                                            //console.log('Buyer ' + buyerAgent.name + ' had no full Market Share, upping beliefs for ' + goodKey + ' by ' + round(buyerDisplacement, 2));
                                            buyerAgentPriceBeliefs.lowerLimit += round(buyerDisplacement, 2);
                                            buyerAgentPriceBeliefs.upperLimit += round(buyerDisplacement, 2);
                                        } else if (seller.price > clearingPrice) {
                                            //console.log('Seller ' + sellerAgent.name + ' price was higher than clearing pice, lowering buyer' + buyerAgent.name + ' beliefs for ' + goodKey + ' by ' + round((seller.price - clearingPrice)*1.1, 2));
                                            buyerAgentPriceBeliefs.lowerLimit = Math.max(buyerAgentPriceBeliefs.lowerLimit - round((seller.price - clearingPrice)*1.1, 2), 1);
                                            buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round((seller.price - clearingPrice)*1.1, 2), 1);
                                        } else if (supply > demand && seller.price > app.marketEconSimModule.market.goodHistoricalMeans[goodKey]) {
                                            //console.log('Supply was higher than demand and seller ' + seller.price + ' price was higher than current historical mean' + app.marketEconSimModule.market.goodHistoricalMeans[goodKey] + ', lowering buyer ' + buyerAgent.name + ' beliefs for ' + goodKey + ' by ' + round((seller.price - app.marketEconSimModule.market.goodHistoricalMeans[goodKey])*1.1, 2));
                                            buyerAgentPriceBeliefs.lowerLimit = Math.max(buyerAgentPriceBeliefs.lowerLimit - round((seller.price - app.marketEconSimModule.market.goodHistoricalMeans[goodKey])*1.1, 2), 1);
                                            buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round((seller.price - app.marketEconSimModule.market.goodHistoricalMeans[goodKey])*1.1, 2), 1);
                                        } else if (demand > supply) {
                                            //console.log('Demand was higher than supply, upping buyer ' + buyerAgent.name + ' beliefs for ' + goodKey + ' by ' + round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2));
                                            buyerAgentPriceBeliefs.lowerLimit += round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2);
                                            buyerAgentPriceBeliefs.upperLimit += round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2);
                                        } else {
                                            //console.log('No conditions were met, lowering buyer ' + buyerAgent.name + ' beliefs for ' + goodKey + ' by ' + round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2));
                                            buyerAgentPriceBeliefs.lowerLimit = Math.max(buyerAgentPriceBeliefs.lowerLimit - round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2), 1);
                                            buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2), 1);
                                        };
                    
                                        //seller price adjustment
                                        //if at least 50% of offer filled
                                        if (quantity == 0) {
                                            //console.log('Seller ' + sellerAgent.name + ' couldnt sell anything, lowering beliefs for ' + goodKey + ' by ' + round(sellerDisplacment/6, 2));
                                            sellerAgentPriceBeliefs.lowerLimit = Math.max(sellerAgentPriceBeliefs.lowerLimit - round(sellerDisplacment/6, 2), 1);
                                            sellerAgentPriceBeliefs.upperLimit = Math.max(sellerAgentPriceBeliefs.upperLimit - round(sellerDisplacment/6, 2), 1);
                                        } else if (sellerMarketShare < 0.75*supply) {
                                            //console.log('Seller ' + sellerAgent.name + ' market share is less than 75% of the ' + goodKey + ' market, lowering beliefs for ' + goodKey + ' by ' + round(sellerDisplacment/7, 2));
                                            sellerAgentPriceBeliefs.lowerLimit = Math.max(sellerAgentPriceBeliefs.lowerLimit - round(sellerDisplacment/7, 2), 1);
                                            sellerAgentPriceBeliefs.upperLimit = Math.max(sellerAgentPriceBeliefs.upperLimit - round(sellerDisplacment/7, 2), 1);
                                        } else if (seller.price < clearingPrice) {
                                            //console.log('Seller ' + sellerAgent.name + ' price was lower than a clearing price, upping beliefs for ' + goodKey + ' by ' + round(sellerWeight*(clearingPrice - seller.price)*1.2, 2));
                                            sellerAgentPriceBeliefs.lowerLimit += round(sellerWeight*(clearingPrice - seller.price)*1.2, 2);
                                            sellerAgentPriceBeliefs.upperLimit += round(sellerWeight*(clearingPrice - seller.price)*1.2, 2);
                                        } else if (demand > supply) {
                                            //console.log('Demand was higher than supply, upping seller ' + sellerAgent.name + ' beliefs for ' + goodKey + ' by ' + round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2));
                                            buyerAgentPriceBeliefs.lowerLimit += round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2);
                                            buyerAgentPriceBeliefs.upperLimit += round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2);
                                        } else {
                                            //console.log('No conditions were met, lowering seller ' + sellerAgent.name + ' beliefs for ' + goodKey + ' by ' + round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2));
                                            buyerAgentPriceBeliefs.lowerLimit = Math.max(buyerAgentPriceBeliefs.lowerLimit - round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2), 1);
                                            buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2), 1);
                                        };

                                    };

                                    console.log('Good is ' + goodKey + ', ' + 'seller # ' + i + '/' + (sortedLots.length - 1) + ', buyer # ' + j + '/' + (sortedAsks.length - 1));
                                    if (seller.quantity > 0) iterateDeals(i, j + 1)
                                    else if (buyer.quantity > 0) iterateDeals(i + 1, j)
                                    else resolve();
                                };
                                
                            });
                        };

                        let askComparison = async (ask, lot) => {
                            return new Promise (resolve => {
                                console.log('Solving ask');
                                console.log(ask);
                                console.log('For lot');
                                console.log(lot);
                                if (ask.quantity > 0 && lot.quantity - ask.quantity > 0) {
                                    let buyer = ask;
                                    let buyerAgent = app.marketEconSimModule.market.currentAgents.filter(x => x.name == buyer.buyerName)[0];
                                    let seller = lot;
                                    let sellerAgent = app.marketEconSimModule.market.currentAgents.filter(x => x.name == seller.sellerName)[0];

                                    let clearingPrice = round((buyer.price + seller.price)/2, 2);
                                    let quantity = Math.min(buyer.quantity, seller.quantity, Math.floor(buyerAgent.wallet/clearingPrice));
                                    let totalPrice = round(quantity*clearingPrice, 2);
                                    
                                    let buyerAgentPriceBeliefs = buyerAgent.priceBeliefs[goodKey];
                                    let buyerMarketShare = sortedLots.filter(x => x.name == buyer.buyerName).reduce((a, b) => a + b.price*b.quantity, 0);
                                    let buyerDisplacement = (Math.abs(round((buyerAgentPriceBeliefs.upperLimit + buyerAgentPriceBeliefs.lowerLimit)/2 - clearingPrice), 2))/(round((buyerAgentPriceBeliefs.upperLimit + buyerAgentPriceBeliefs.lowerLimit)/2, 2));
                                    
                                    let sellerAgentPriceBeliefs = sellerAgent.priceBeliefs[goodKey];
                                    let sellerMarketShare = sortedLots.filter(x => x.name == seller.sellerName).reduce((a, b) => a + b.price*b.quantity, 0);
                                    let sellerWeight = (seller.quantity == 0 && quantity == 0 ? 0 : seller.quantity/(seller.quantity + quantity));
                                    let sellerDisplacment = sellerWeight*(sellerAgentPriceBeliefs.upperLimit + sellerAgentPriceBeliefs.lowerLimit)/2;

                                    if (quantity >= 1) {
                                        let sellerOldInventory = sellerAgent.inventory[goodKey];
                                        buyer.quantity -= quantity;
                                        seller.quantity -= quantity;
                                        buyerAgent.inventory[goodKey] += quantity;
                                        sellerAgent.inventory[goodKey] -= quantity;
                                        buyerAgent.wallet -= totalPrice;
                                        sellerAgent.wallet += totalPrice;
                                        sellerAgent.lastTurnProfit += totalPrice;

                                        if (sellerAgent.inventory[goodKey] < 0) console.log('Agent ' + sellerAgent.name + ' inventory of ' + goodKey + ' became negative during Market Phase while being a seller! Was ' + sellerOldInventory + ', became ' + sellerAgent.inventory[goodKey] + '. Sold quantity was ' + quantity);
                
                                        currentTurnMeanPriceForGood.push(clearingPrice);
                                        //console.log(currentTurnMeanPriceForGood);
                
                                        app.marketEconSimModule.market.currentDeals.push({
                                            turn: app.marketEconSimModule.market.currentTurn,
                                            good: goodKey,
                                            buyer: buyerAgent.name,
                                            seller: sellerAgent.name,
                                            quantity: quantity,
                                            clearingPrice: clearingPrice,
                                            totalPrice: totalPrice
                                        });
                                    };

                                    if (buyer.quantity/2 >= quantity) {
                                        buyerAgentPriceBeliefs.lowerLimit += round(buyerAgentPriceBeliefs.upperLimit/10, 2);
                                        buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round(buyerAgentPriceBeliefs.upperLimit/10, 2), buyerAgentPriceBeliefs.lowerLimit);
                                    } else {
                                        buyerAgentPriceBeliefs.upperLimit += round(buyerAgentPriceBeliefs.upperLimit/10, 2);
                                    };
                
                                    if (buyerMarketShare < 1) {
                                        //console.log('Buyer ' + buyerAgent.name + ' had no full Market Share, upping beliefs for ' + goodKey + ' by ' + round(buyerDisplacement, 2));
                                        buyerAgentPriceBeliefs.lowerLimit += round(buyerDisplacement, 2);
                                        buyerAgentPriceBeliefs.upperLimit += round(buyerDisplacement, 2);
                                    } else if (seller.price > clearingPrice) {
                                        //console.log('Seller ' + sellerAgent.name + ' price was higher than clearing pice, lowering buyer' + buyerAgent.name + ' beliefs for ' + goodKey + ' by ' + round((seller.price - clearingPrice)*1.1, 2));
                                        buyerAgentPriceBeliefs.lowerLimit = Math.max(buyerAgentPriceBeliefs.lowerLimit - round((seller.price - clearingPrice)*1.1, 2), 1);
                                        buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round((seller.price - clearingPrice)*1.1, 2), 1);
                                    } else if (supply > demand && seller.price > app.marketEconSimModule.market.goodHistoricalMeans[goodKey]) {
                                        //console.log('Supply was higher than demand and seller ' + seller.price + ' price was higher than current historical mean' + app.marketEconSimModule.market.goodHistoricalMeans[goodKey] + ', lowering buyer ' + buyerAgent.name + ' beliefs for ' + goodKey + ' by ' + round((seller.price - app.marketEconSimModule.market.goodHistoricalMeans[goodKey])*1.1, 2));
                                        buyerAgentPriceBeliefs.lowerLimit = Math.max(buyerAgentPriceBeliefs.lowerLimit - round((seller.price - app.marketEconSimModule.market.goodHistoricalMeans[goodKey])*1.1, 2), 1);
                                        buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round((seller.price - app.marketEconSimModule.market.goodHistoricalMeans[goodKey])*1.1, 2), 1);
                                    } else if (demand > supply) {
                                        //console.log('Demand was higher than supply, upping buyer ' + buyerAgent.name + ' beliefs for ' + goodKey + ' by ' + round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2));
                                        buyerAgentPriceBeliefs.lowerLimit += round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2);
                                        buyerAgentPriceBeliefs.upperLimit += round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2);
                                    } else {
                                        //console.log('No conditions were met, lowering buyer ' + buyerAgent.name + ' beliefs for ' + goodKey + ' by ' + round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2));
                                        buyerAgentPriceBeliefs.lowerLimit = Math.max(buyerAgentPriceBeliefs.lowerLimit - round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2), 1);
                                        buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2), 1);
                                    };
                
                                    //seller price adjustment
                                    //if at least 50% of offer filled
                                    if (quantity == 0) {
                                        //console.log('Seller ' + sellerAgent.name + ' couldnt sell anything, lowering beliefs for ' + goodKey + ' by ' + round(sellerDisplacment/6, 2));
                                        sellerAgentPriceBeliefs.lowerLimit = Math.max(sellerAgentPriceBeliefs.lowerLimit - round(sellerDisplacment/6, 2), 1);
                                        sellerAgentPriceBeliefs.upperLimit = Math.max(sellerAgentPriceBeliefs.upperLimit - round(sellerDisplacment/6, 2), 1);
                                    } else if (sellerMarketShare < 0.75*supply) {
                                        //console.log('Seller ' + sellerAgent.name + ' market share is less than 75% of the ' + goodKey + ' market, lowering beliefs for ' + goodKey + ' by ' + round(sellerDisplacment/7, 2));
                                        sellerAgentPriceBeliefs.lowerLimit = Math.max(sellerAgentPriceBeliefs.lowerLimit - round(sellerDisplacment/7, 2), 1);
                                        sellerAgentPriceBeliefs.upperLimit = Math.max(sellerAgentPriceBeliefs.upperLimit - round(sellerDisplacment/7, 2), 1);
                                    } else if (seller.price < clearingPrice) {
                                        //console.log('Seller ' + sellerAgent.name + ' price was lower than a clearing price, upping beliefs for ' + goodKey + ' by ' + round(sellerWeight*(clearingPrice - seller.price)*1.2, 2));
                                        sellerAgentPriceBeliefs.lowerLimit += round(sellerWeight*(clearingPrice - seller.price)*1.2, 2);
                                        sellerAgentPriceBeliefs.upperLimit += round(sellerWeight*(clearingPrice - seller.price)*1.2, 2);
                                    } else if (demand > supply) {
                                        //console.log('Demand was higher than supply, upping seller ' + sellerAgent.name + ' beliefs for ' + goodKey + ' by ' + round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2));
                                        buyerAgentPriceBeliefs.lowerLimit += round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2);
                                        buyerAgentPriceBeliefs.upperLimit += round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2);
                                    } else {
                                        //console.log('No conditions were met, lowering seller ' + sellerAgent.name + ' beliefs for ' + goodKey + ' by ' + round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2));
                                        buyerAgentPriceBeliefs.lowerLimit = Math.max(buyerAgentPriceBeliefs.lowerLimit - round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2), 1);
                                        buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2), 1);
                                    };

                                    resolve();
                                };
                                
                            });
                        }

                        let compareLotWithAsks = async lot => {
                            for (let ask of sortedAsks) {
                                if (lot.quantity > 0) await askComparison(ask, lot);
                            };
                        };

                        let compareLots = async () => {
                            for (let lot of sortedLots) {
                                await compareLotWithAsks(lot);
                            };
                        };

                        iterateDeals(0, 0).then(() => {
                            if (currentTurnMeanPriceForGood.length > 0) app.marketEconSimModule.market.goodHistoricalMeans[goodKey] = round(currentTurnMeanPriceForGood.reduce((a, b) => a + b)/currentTurnMeanPriceForGood.length, 2);

                            //console.log(goodKey + ' supply is ' + supply);
                            //console.log(goodKey + ' demand is ' + demand);
                            
                            goodsDemand.push({
                                good: goodKey,
                                demand: demand,
                            });

                            resolve(goodKey + ' is matched');
                        });

                        /*compareLots().then(() => {
                            if (currentTurnMeanPriceForGood.length > 0) app.marketEconSimModule.market.goodHistoricalMeans[goodKey] = round(currentTurnMeanPriceForGood.reduce((a, b) => a + b)/currentTurnMeanPriceForGood.length, 2);

                            //console.log(goodKey + ' supply is ' + supply);
                            //console.log(goodKey + ' demand is ' + demand);
                            
                            goodsDemand.push({
                                good: goodKey,
                                demand: demand,
                            });

                            resolve();
                        });*/
                    });

                    matchingPromises.push(matchGood);
                };

                console.log(matchingPromises);
                
                Promise.all(matchingPromises).then((result) => {
                    console.log(result);
                    console.log('You are here');
                    let agentChangePromises = [];
                    
                    goodsDemand = goodsDemand.sort((a, b) => (a.demand > b.demand) ? -1 : 1);
                    app.marketEconSimModule.market.topGoodType = goodsDemand[0].good;
                    
                    
                    //console.log('Demand for this turn');
                    //console.log(goodsDemand);
                    //console.log('Top good this turn ' + app.marketEconSimModule.market.topGoodType);

                    for (let agent of app.marketEconSimModule.market.currentAgents) {
                        let agentChange = new Promise (resolve => {
                            (agent.lastTurnProfit > 0 ? agent.turnsWithoutProfit = 0: agent.turnsWithoutProfit++);

                            if (agent.turnsWithoutProfit > 2) {
                                //if the agent haven't been making any profit for more than 3 turns, they will try to switch their type with different production rules
                                let oldType = agent.type;
                                //the switch will be based upon the biggest inventory available to the agent to produce from
                                let highestInventoryItem = Object.keys(agent.inventory).sort((a, b) => (agent.inventory[a] > agent.inventory[b]) ? -1 : 1)[0];
                                let itemAmount = agent.inventory[highestInventoryItem];
                                let newRandomType = Object.keys(app.marketEconSimModule.productionRuleSets).filter(x => app.marketEconSimModule.productionRuleSets[x].rules.filter(y => y.components.filter(z => z.key == highestInventoryItem).length > 0).length > 0);
                                //console.log(agent.name + ' new types based on highest inventory (' + itemAmount + ' of ' + highestInventoryItem + ') are ' + newRandomType);
                                //with 25% chance it will instead be to produce most profitable good 
                                let mostLucrativeTypes = Object.keys(app.marketEconSimModule.productionRuleSets).filter(x => app.marketEconSimModule.productionRuleSets[x].rules.filter(y => y.outputs.filter(z => z.key == app.marketEconSimModule.market.topGoodType).length > 0).length > 0);
                                //console.log('Meanwhile most lucrative types are: ' + mostLucrativeTypes.join(', '));
                                agent.type = (Math.random() < 0.75 ? newRandomType[Math.floor(newRandomType.length*Math.random())] : mostLucrativeTypes[Math.floor(mostLucrativeTypes.length*Math.random())]);
                                //console.log(agent.name + ' changed their type from ' + oldType + ' to ' + agent.type);
                            };
                            resolve();
                        });
                        agentChangePromises.push(agentChange);
                    };

                    Promise.all(agentChangePromises).then(() => {
                        console.log('Deals for Turn #' + app.marketEconSimModule.market.currentTurn);
                        console.log(app.marketEconSimModule.market.currentDeals);
                        resolve('Market matching for Turn #' + app.marketEconSimModule.market.currentTurn + ' is finished');
                    });
                });
            });
        });
    };

    app.marketTurnSimulation2 = async () => {
        let gatherListings = async () => {
            let createGoodListing = async (agent, goodKey) => {
                let upkeepAmount = agent.upkeepRules.filter(x => x.good == goodKey).reduce((a, b) => a + b.quantity, 0);
                let productionAmount = (app.marketEconSimModule.productionRuleSets[agent.type].rules.filter(x => x.outputs.filter(y => y.key== goodKey).length > 0).length > 0 ? - 500 : 0);
                let transactionType = (agent.inventory[goodKey] > upkeepAmount*10 + productionAmount + 100 ? 'lot' : 'ask');
                let transactionAmount = Math.abs(agent.inventory[goodKey] - upkeepAmount*10 - productionAmount - 100);
                //console.log(`${agent.name} wants to ${transactionType} ${transactionAmount} of ${goodKey}`);

                switch (transactionType) {
                    case 'lot':
                        {
                            let mean = app.marketEconSimModule.market.goodHistoricalMeans[goodKey];
                            let upperPriceLimit = agent.priceBeliefs[goodKey].upperLimit;
                            let lowerPriceLimit = agent.priceBeliefs[goodKey].lowerLimit;
                            let favorability = (mean > upperPriceLimit ? 1 : (mean < lowerPriceLimit ? 0.2 : Math.max(0.2, findNumberPosition(mean, lowerPriceLimit, upperPriceLimit))));
                            let amount = round(favorability*transactionAmount, 0);

                            if (amount > 0) {
                                //console.log(`Due to favorability of ${round(favorability, 2)}, the amount will instead be ${amount}`);
                                app.marketEconSimModule.market.currentLots.push({
                                    sellerName: agent.name,
                                    good: goodKey,
                                    quantity: amount,
                                    price: upperPriceLimit,
                                });
                            };
                        };
                        break;
                    case 'ask':
                        { 
                            let mean = app.marketEconSimModule.market.goodHistoricalMeans[goodKey];
                            let upperPriceLimit = agent.priceBeliefs[goodKey].upperLimit;
                            let lowerPriceLimit = agent.priceBeliefs[goodKey].lowerLimit;
                            let favorability = (mean > upperPriceLimit ? 0.2 : (mean < lowerPriceLimit ? 1 : Math.max(0.2, 1 - findNumberPosition(mean, lowerPriceLimit, upperPriceLimit))));
                            let amount = round(Math.min(favorability*transactionAmount, agent.wallet/upperPriceLimit), 0);

                            if (amount > 0) {
                                //console.log(`Due to favorability of ${round(favorability, 2)} or having money to buy only ${round(agent.wallet / upperPriceLimit, 0)}, the amount will instead be ${amount}`);
                                app.marketEconSimModule.market.currentAsks.push({
                                    buyerName: agent.name,
                                    good: goodKey,
                                    quantity: amount,
                                    price: lowerPriceLimit,
                                });
                            };
                        };
                        break;
                };
            };
            let createGoodListingsForAgent = async (agent) => { 
                for await (let goodKey of Object.keys(agent.inventory)) {
                    await createGoodListing(agent, goodKey);
                };
                console.log(`Done making good listings for agent ${agent.name}`);
            };

            for await (let agent of app.marketEconSimModule.market.currentAgents) {
                await createGoodListingsForAgent(agent);
            };

            console.log(`Done making good listings for turn #${app.marketEconSimModule.market.currentTurn}`);
        };
        let matchListings = async () => {
            let goodsDemand = [];
            let matchGood = async (goodKey) => {
                let shuffledLots = shuffle(app.marketEconSimModule.market.currentLots.filter(x => x.good == goodKey));
                let shuffledAsks = shuffle(app.marketEconSimModule.market.currentAsks.filter(x => x.good == goodKey));
                let sortedLots = shuffledLots.sort((a, b) => (a.price > b.price) ? 1 : -1);
                let sortedAsks = shuffledAsks.sort((a, b) => (a.price < b.price) ? 1 : -1);
                let historicalMean = app.marketEconSimModule.market.goodHistoricalMeans[goodKey];
                let supply = sortedLots.reduce((a, b) => a + historicalMean*b.quantity, 0);
                let demand = sortedAsks.reduce((a, b) => a + historicalMean*b.quantity, 0);
                let currentTurnMeanPriceForGood = [];
                let iterateDeals = async (i, j) => {
                    if (i >= sortedLots.length || j >= sortedAsks.length) return;
                    else {
                        let seller = sortedLots[i];
                        let sellerAgent = app.marketEconSimModule.market.currentAgents.filter(x => x.name == seller.sellerName)[0];

                        let buyer = sortedAsks[j];
                        let buyerAgent = app.marketEconSimModule.market.currentAgents.filter(x => x.name == buyer.buyerName)[0];

                        let clearingPrice = round((buyer.price + seller.price)/2, 2);
                        let quantity = Math.min(buyer.quantity, seller.quantity, sellerAgent.inventory[goodKey], Math.floor(buyerAgent.wallet/clearingPrice));
                        let totalPrice = round(quantity*clearingPrice, 2);
                        
                        let buyerAgentPriceBeliefs = buyerAgent.priceBeliefs[goodKey];
                        let buyerMarketShare = sortedLots.filter(x => x.name == buyer.buyerName).reduce((a, b) => a + b.price*b.quantity, 0);
                        let buyerDisplacement = (Math.abs(round((buyerAgentPriceBeliefs.upperLimit + buyerAgentPriceBeliefs.lowerLimit)/2 - clearingPrice), 2))/(round((buyerAgentPriceBeliefs.upperLimit + buyerAgentPriceBeliefs.lowerLimit)/2, 2));
                        
                        let sellerAgentPriceBeliefs = sellerAgent.priceBeliefs[goodKey];
                        let sellerMarketShare = sortedLots.filter(x => x.name == seller.sellerName).reduce((a, b) => a + b.price*b.quantity, 0);
                        let sellerWeight = (seller.quantity == 0 && quantity == 0 ? 0 : seller.quantity/(seller.quantity + quantity));
                        let sellerDisplacment = sellerWeight*(sellerAgentPriceBeliefs.upperLimit + sellerAgentPriceBeliefs.lowerLimit)/2;

                        
                        DealMatching: if (quantity >= 1) {
                            let sellerOldInventory = sellerAgent.inventory[goodKey];
                            buyer.quantity -= quantity;
                            seller.quantity -= quantity;
                            buyerAgent.inventory[goodKey] += quantity;
                            sellerAgent.inventory[goodKey] -= quantity;
                            buyerAgent.wallet -= totalPrice;
                            sellerAgent.wallet += totalPrice;
                            sellerAgent.lastTurnProfit += totalPrice;

                            if (sellerAgent.inventory[goodKey] < 0) console.log(`Agent ${sellerAgent.name} inventory of ${goodKey} became negative during Market Phase while being a seller! Was ${sellerOldInventory}, became ${sellerAgent.inventory[goodKey]}. Sold quantity was ${quantity}`);
    
                            currentTurnMeanPriceForGood.push(clearingPrice);
                            //console.log(currentTurnMeanPriceForGood);
    
                            app.marketEconSimModule.market.currentDeals.push({
                                turn: app.marketEconSimModule.market.currentTurn,
                                good: goodKey,
                                buyer: buyerAgent.name,
                                seller: sellerAgent.name,
                                quantity: quantity,
                                clearingPrice: clearingPrice,
                                totalPrice: totalPrice
                            });
                        };

                        PriceBeliefsAdjustment: {
                            if (buyer.quantity/2 >= quantity) {
                                buyerAgentPriceBeliefs.lowerLimit += round(buyerAgentPriceBeliefs.upperLimit/10, 2);
                                buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round(buyerAgentPriceBeliefs.upperLimit/10, 2), buyerAgentPriceBeliefs.lowerLimit);
                            } else {
                                buyerAgentPriceBeliefs.upperLimit += round(buyerAgentPriceBeliefs.upperLimit/10, 2);
                            };
        
                            if (buyerMarketShare < 1) {
                                //console.log('Buyer ' + buyerAgent.name + ' had no full Market Share, upping beliefs for ' + goodKey + ' by ' + round(buyerDisplacement, 2));
                                buyerAgentPriceBeliefs.lowerLimit += round(buyerDisplacement, 2);
                                buyerAgentPriceBeliefs.upperLimit += round(buyerDisplacement, 2);
                            } else if (seller.price > clearingPrice) {
                                //console.log('Seller ' + sellerAgent.name + ' price was higher than clearing pice, lowering buyer' + buyerAgent.name + ' beliefs for ' + goodKey + ' by ' + round((seller.price - clearingPrice)*1.1, 2));
                                buyerAgentPriceBeliefs.lowerLimit = Math.max(buyerAgentPriceBeliefs.lowerLimit - round((seller.price - clearingPrice)*1.1, 2), 1);
                                buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round((seller.price - clearingPrice)*1.1, 2), 1);
                            } else if (supply > demand && seller.price > app.marketEconSimModule.market.goodHistoricalMeans[goodKey]) {
                                //console.log('Supply was higher than demand and seller ' + seller.price + ' price was higher than current historical mean' + app.marketEconSimModule.market.goodHistoricalMeans[goodKey] + ', lowering buyer ' + buyerAgent.name + ' beliefs for ' + goodKey + ' by ' + round((seller.price - app.marketEconSimModule.market.goodHistoricalMeans[goodKey])*1.1, 2));
                                buyerAgentPriceBeliefs.lowerLimit = Math.max(buyerAgentPriceBeliefs.lowerLimit - round((seller.price - app.marketEconSimModule.market.goodHistoricalMeans[goodKey])*1.1, 2), 1);
                                buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round((seller.price - app.marketEconSimModule.market.goodHistoricalMeans[goodKey])*1.1, 2), 1);
                            } else if (demand > supply) {
                                //console.log('Demand was higher than supply, upping buyer ' + buyerAgent.name + ' beliefs for ' + goodKey + ' by ' + round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2));
                                buyerAgentPriceBeliefs.lowerLimit += round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2);
                                buyerAgentPriceBeliefs.upperLimit += round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2);
                            } else {
                                //console.log('No conditions were met, lowering buyer ' + buyerAgent.name + ' beliefs for ' + goodKey + ' by ' + round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2));
                                buyerAgentPriceBeliefs.lowerLimit = Math.max(buyerAgentPriceBeliefs.lowerLimit - round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2), 1);
                                buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2), 1);
                            };
        
                            //seller price adjustment
                            //if at least 50% of offer filled
                            if (quantity == 0) {
                                //console.log('Seller ' + sellerAgent.name + ' couldnt sell anything, lowering beliefs for ' + goodKey + ' by ' + round(sellerDisplacment/6, 2));
                                sellerAgentPriceBeliefs.lowerLimit = Math.max(sellerAgentPriceBeliefs.lowerLimit - round(sellerDisplacment/6, 2), 1);
                                sellerAgentPriceBeliefs.upperLimit = Math.max(sellerAgentPriceBeliefs.upperLimit - round(sellerDisplacment/6, 2), 1);
                            } else if (sellerMarketShare < 0.75*supply) {
                                //console.log('Seller ' + sellerAgent.name + ' market share is less than 75% of the ' + goodKey + ' market, lowering beliefs for ' + goodKey + ' by ' + round(sellerDisplacment/7, 2));
                                sellerAgentPriceBeliefs.lowerLimit = Math.max(sellerAgentPriceBeliefs.lowerLimit - round(sellerDisplacment/7, 2), 1);
                                sellerAgentPriceBeliefs.upperLimit = Math.max(sellerAgentPriceBeliefs.upperLimit - round(sellerDisplacment/7, 2), 1);
                            } else if (seller.price < clearingPrice) {
                                //console.log('Seller ' + sellerAgent.name + ' price was lower than a clearing price, upping beliefs for ' + goodKey + ' by ' + round(sellerWeight*(clearingPrice - seller.price)*1.2, 2));
                                sellerAgentPriceBeliefs.lowerLimit += round(sellerWeight*(clearingPrice - seller.price)*1.2, 2);
                                sellerAgentPriceBeliefs.upperLimit += round(sellerWeight*(clearingPrice - seller.price)*1.2, 2);
                            } else if (demand > supply) {
                                //console.log('Demand was higher than supply, upping seller ' + sellerAgent.name + ' beliefs for ' + goodKey + ' by ' + round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2));
                                buyerAgentPriceBeliefs.lowerLimit += round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2);
                                buyerAgentPriceBeliefs.upperLimit += round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2);
                            } else {
                                //console.log('No conditions were met, lowering seller ' + sellerAgent.name + ' beliefs for ' + goodKey + ' by ' + round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2));
                                buyerAgentPriceBeliefs.lowerLimit = Math.max(buyerAgentPriceBeliefs.lowerLimit - round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2), 1);
                                buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2), 1);
                            };

                        };

                        console.log(`Good is ${goodKey}, seller # ${i}/${sortedLots.length - 1}, buyer # ${j}/${sortedAsks.length - 1}`);
                        if (seller.quantity > 0) iterateDeals(i, j + 1)
                        else if (buyer.quantity > 0) iterateDeals(i + 1, j)
                        else return;
                    };
                };

                //console.log(`Lots for ${goodKey}`);
                //console.log(sortedLots);
                //console.log(`Asks for ${goodKey}`);
                //console.log(sortedAsks);
                //console.log(`${goodKey} supply is ${supply}`);
                //console.log(`${goodKey} demand is ${demand}`);
                
                await iterateDeals(0, 0);
                if (currentTurnMeanPriceForGood.length > 0) app.marketEconSimModule.market.goodHistoricalMeans[goodKey] = round(currentTurnMeanPriceForGood.reduce((a, b) => a + b)/currentTurnMeanPriceForGood.length, 2);
                goodsDemand.push({
                    good: goodKey,
                    demand: demand,
                });
                return 
            };

            await gatherListings();
            for await (let goodKey of Object.keys(app.marketEconSimModule.goods)) {
                await matchGood(goodKey);
            };
            goodsDemand = goodsDemand.sort((a, b) => (a.demand > b.demand) ? -1 : 1);
            app.marketEconSimModule.market.topGoodType = goodsDemand[0].good;
            //console.log('Demand for this turn');
            //console.log(goodsDemand);
            //console.log('Top good this turn ' + app.marketEconSimModule.market.topGoodType);
        };
        let changeAgentTypes = async () => {
            let changeAgentType = async (agent) => {
                if (agent.turnsWithoutProfit > 2) {
                    //if the agent haven't been making any profit for more than 3 turns, they will try to switch their type with different production rules
                    //the switch will be based upon the biggest inventory available to the agent to produce from with 25% chance it will instead be to produce the most profitable good
                    let oldType = agent.type;
                    let highestInventoryItem = Object.keys(agent.inventory).sort((a, b) => (agent.inventory[a] > agent.inventory[b]) ? -1 : 1)[0];
                    let itemAmount = agent.inventory[highestInventoryItem];
                    let newRandomType = Object.keys(app.marketEconSimModule.productionRuleSets).filter(x => app.marketEconSimModule.productionRuleSets[x].rules.filter(y => y.components.filter(z => z.key == highestInventoryItem).length > 0).length > 0);
                    let mostLucrativeTypes = Object.keys(app.marketEconSimModule.productionRuleSets).filter(x => app.marketEconSimModule.productionRuleSets[x].rules.filter(y => y.outputs.filter(z => z.key == app.marketEconSimModule.market.topGoodType).length > 0).length > 0);

                    //console.log(`${agent.name} new types based on highest inventory (${itemAmount} of ${highestInventoryItem}) are ${newRandomType}`);
                    //console.log(`Meanwhile most lucrative types are: ${mostLucrativeTypes.join(', ')}`);
                    agent.type = (Math.random() < 0.75 ? newRandomType[Math.floor(newRandomType.length*Math.random())] : mostLucrativeTypes[Math.floor(mostLucrativeTypes.length*Math.random())]);
                    //console.log(`${agent.name} changed their type from ${oldType} to ${agent.type}`);
                };
            };
            let changeAgents = async () => {
                for await (let agent of app.marketEconSimModule.market.currentAgents) {
                    await changeAgentType(agent);
                };
            };

            await matchListings();
            await changeAgentType(changeAgents());
        };
        await changeAgentTypes();
    }

    app.productionSimulation = () => {
        return new Promise ((resolve) => {
            let agentProductionPromises = [];
            for (let agent of app.marketEconSimModule.market.currentAgents) {
                let agentProduction = new Promise (resolve => {
                    let goodProductionPromises = [];
                    let sortedGoods = Object.keys(agent.inventory).sort((a, b) => (agent.inventory[a] - agent.upkeepRules.filter(x => x.good == a).reduce((x, z) => x + z.quantity, 0)*10 > agent.inventory[b] - agent.upkeepRules.filter(x => x.good == b).reduce((x, z) => x + z.quantity, 0)*10) ? 1 : -1);
                    let totalProduction = 0;
                    //console.log('Priority of production for ' + agent.name);
                    //console.log(sortedGoods.join(', '));
                    for (let goodKey of sortedGoods) {
                        let goodProduction = new Promise (resolve => {
                            let shuffledRules = shuffle(app.marketEconSimModule.productionRuleSets[agent.type].rules.filter(x => x.outputs.filter(y => y.key == goodKey).length > 0));
                            let upkeepAmount = agent.upkeepRules.filter(x => x.good == goodKey).reduce((a, b) => a + b.quantity, 0);
                            for (let rule of shuffledRules) {
                                let possibleProduction = [];
                                for (let component of rule.components) {
                                    if (agent.inventory[component.key] - upkeepAmount*10 + component.quantity > 0) possibleProduction.push((agent.inventory[component.key] - upkeepAmount*10)/component.quantity);
                                };
                                //if the agent does not have enough components to make anything, skip the money limit, otherwise put it in the list of possible production numbers. Also limit production so that the agent has no more than 2K of inventory
                                if (possibleProduction.length > 0) {
                                    //possibleProduction.push(round(agent.wallet/app.marketEconSimModule.goods[goodKey].baseCost, 0));
                                    possibleProduction.push(Math.max(0, 1000 - agent.inventory[goodKey], 0));
                                };
                                //console.log('Possible production numbers for ' + goodKey + ' are ' + [...possibleProduction]);
                                let productionNumber = (possibleProduction.length > 0 ? Math.floor(Math.min(...possibleProduction)) : 0);
                                //console.log(agent.name + ' is trying to make ' + productionNumber + ' of ' + goodKey);
                                for (let component of rule.components) {
                                    agent.inventory[component.key] -= productionNumber*component.quantity;
                                    agent.wallet -= productionNumber*app.marketEconSimModule.goods[goodKey].baseCost;
                                };
                                for (let output of rule.outputs) {
                                    agent.inventory[output.key] += productionNumber*output.quantity;
                                    totalProduction += productionNumber*output.quantity;
                                };
                                if (totalProduction == 0) agent.wallet -= round(agent.wallet*0.05, 2);
                            };
                            resolve();
                            /*let iterateOnProductionRule = (ruleIndex = 0, i = 1) => {
                                if (shuffledRules[ruleIndex].outputs.filter(x => x.key == goodKey).length > 0) {
                                    let haveEnough = true;

                                    for (let component of shuffledRules[ruleIndex].components) {
                                        if (agent.inventory[component.key] - upkeepAmount*10 < i*component.quantity) haveEnough = false;
                                    };
                    
                                    if (haveEnough) {
                                        setTimeout(function() { iterateOnProductionRule(ruleIndex, i + 1) }, 10)
                                    } else {
                                        //console.log(agent.name + ' is trying to make ' + (i - 1) + ' of ' + goodKey);
                                        for (let component of shuffledRules[ruleIndex].components) {
                                            agent.inventory[component.key] -= (i - 1)*component.quantity;
                                        };
                
                                        for (let output of shuffledRules[ruleIndex].outputs) {
                                            agent.inventory[output.key] += (i - 1)*output.quantity;
                                            totalProduction += (i - 1)*output.quantity;
                                        };
                                        if (ruleIndex + 1 < shuffledRules.length) {
                                            setTimeout(function() { iterateOnProductionRule(ruleIndex + 1, 1) }, 10)
                                        } else {
                                            if (totalProduction == 0) agent.wallet -= round(agent.wallet*0.05, 2);
                                        };
                                    };
                                };
                            };
                
                            if (shuffledRules.length > 0) iterateOnProductionRule();*/
                        });
                        if (agent.inventory[goodKey] < 0) console.log('Agent ' + agent.name + ' inventory of ' + goodKey + ' became negative during Production Phase!');
                        goodProductionPromises.push(goodProduction);
                    };
                    Promise.all(goodProductionPromises).then(() => resolve());
                    //console.log('Total production for agent ' + agent.name + ' is ' + totalProduction);
                });
                agentProductionPromises.push(agentProduction);
            };
            Promise.all(agentProductionPromises).then(() => {
                resolve('Production for Turn #' + app.marketEconSimModule.market.currentTurn + ' is finished');
            });
        });
    };

    app.upkeepSimulation = () => {
        return new Promise ((resolve) => {
            let agentUpkeepPromises = [];
            for (let [i, agent] of app.marketEconSimModule.market.currentAgents.entries()) {
                let agentUpkeep = new Promise (resolve => {
                    let upkeepGoodsPromises = [];
                    for (let upkeep of agent.upkeepRules) {
                        let upkeepGood = new Promise (resolve => {
                            if (agent.inventory[upkeep.good] - upkeep.quantity < 0) {
                                agent.inventory[upkeep.good] = 0;
                                agent.durability -= 5;
                                //console.log(agent.name + ' could not fulfill their ' + upkeep.good + ' upkeep, losing 5 durability. Current durability is ' + agent.durability);
                            } else {
                                agent.inventory[upkeep.good] -= upkeep.quantity;
                                //console.log(agent.name + ' could fulfilled their ' + upkeep.good + ' upkeep, gaining 1 durability. Current durability is ' + agent.durability);
                                agent.durability++;
                            };
                            resolve();
                        });
                        if (agent.inventory[upkeep.good] < 0) console.log('Agent ' + agent.name + ' inventory of ' + upkeep.good + ' became negative during Upkeep Phase!');
                        upkeepGoodsPromises.push(upkeepGood);
                    };
                    Promise.all(upkeepGoodsPromises).then(() => resolve());
                });
                agentUpkeepPromises.push(agentUpkeep);
            };
            Promise.all(agentUpkeepPromises).then(() => resolve('Upkeep for Turn #' + app.marketEconSimModule.market.currentTurn + ' is finished'));
        });
    };

    app.bailAndRetiretAgents = () => {
        return new Promise ((resolve) => {
            let agentBailPromises = [];
            for (let [i, agent] of app.marketEconSimModule.market.currentAgents.entries()) {
                let bailCheck = new Promise (resolve => {
                    //Bail-out mechanism, that buys all the materials from the agent at 1/2 of a historical mean price in order to let them participate in the market again
                    let bailGoodBuyOutPromises = [];
                    if (agent.durability <= 0 && agent.bailOutChance) {
                        console.log('Agent ' + agent.name + ' is being bailed-out');
                        for (let goodKey of Object.keys(agent.inventory)) {
                            let goodBuyOut = new Promise (resolve => {
                                let bailOutVolume = agent.inventory[goodKey];
                                let bailOutPay = bailOutVolume*app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/2;
            
                                app.marketEconSimModule.market.bailOutAgent.wallet -= bailOutPay;
                                agent.wallet += bailOutPay;
            
                                app.marketEconSimModule.market.bailOutAgent.inventory[goodKey] += bailOutVolume;
                                agent.inventory[goodKey] = 0;
                                agent.bailOutChance = false;
                                resolve();
                            });
                            bailGoodBuyOutPromises.push(goodBuyOut);
                        };
                    //Retire mechanism, that buys all the materials from the agent at 1/10 of a historical mean price and retires the agent
                    } else if (agent.durability <= 0 && !agent.bailOutChance) {
                        console.log('Agent ' + agent.name + ' is being retired');
                        for (let goodKey of Object.keys(agent.inventory)) {
                            let goodBuyOut = new Promise (resolve => {
                                let bankruptVolume = agent.inventory[goodKey];
                                let bankruptPay = bankruptVolume*app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/10;
            
                                app.marketEconSimModule.market.bailOutAgent.wallet -= bankruptPay;
            
                                app.marketEconSimModule.market.bailOutAgent.inventory[goodKey] += bankruptVolume;
                                resolve();
                            });
                            bailGoodBuyOutPromises.push(goodBuyOut);
                        };
                        app.marketEconSimModule.market.currentAgents.splice(i, 1);
                        //replace retired agent with a new one
                        app.fabricateNewEconAgent();
                    };
                    Promise.all(bailGoodBuyOutPromises).then(() => resolve());
                });
                agentBailPromises.push(bailCheck);
            };
            Promise.all(agentBailPromises).then(() => resolve());
        });
    };

    app.econNextTurn = () => {
        /*app.marketEconSimModule.market.currentTurn++;
        app.marketEconSimModule.market.currentAsks = [];
        app.marketEconSimModule.market.currentLots = [];

        console.log('Turn #' + app.marketEconSimModule.market.currentTurn);
        app.upkeepSimulation();
        app.productionSimulation();
        app.marketTurnSimulation();
        app.bailAndRetiretAgents();
        console.log('Turn #' + app.marketEconSimModule.market.currentTurn + ' calculation is finished!');
        app.refreshMarketModule();
        $(app.components.spinner).hide();*/

        let turnCalculation = new Promise((resolve) => {
            app.marketEconSimModule.market.currentTurn++;
            app.marketEconSimModule.market.currentAsks = [];
            app.marketEconSimModule.market.currentLots = [];

            console.log('Turn #' + app.marketEconSimModule.market.currentTurn);
            app.upkeepSimulation().then((result) => {
                console.log(result);
                resolve();
            });
        }).then(() => {
            return app.productionSimulation();
        }).then((result) => {
            console.log(result);
            return app.bailAndRetiretAgents();
        }).then(() => {
            return app.marketTurnSimulation2();
        }).then(() => {
            console.log('Turn #' + app.marketEconSimModule.market.currentTurn + ' calculation is finished!');
            //console.log('Agents at the end of the turn');
            //console.log(app.marketEconSimModule.market.currentAgents);
            app.refreshMarketModule();
        });
        
        return turnCalculation;
    };

    app.refreshMarketModule = () => {
        let gizmo = document.querySelector('.gizmo.market-econ-sim');

        let billboardContainer = gizmo.querySelector('.market-billboard-container');
        let billboardTemplate = billboardContainer.querySelector('.market-billboard.template');
        let billboardItemTempalte = billboardTemplate.querySelector('.billboard-item.template');

        let agentCardTemplate = gizmo.querySelector('.agent-card.template');
        let agentGoodItemTemplate = agentCardTemplate.querySelector('.agent-good.template');
        let agentContainer = gizmo.querySelector('.agent-card-container');

        let generatedDOMs = gizmo.querySelectorAll('.generated');

        gizmo.querySelector('.turn-counter').innerHTML = app.marketEconSimModule.market.currentTurn;
        for (let dom of generatedDOMs) dom.parentElement.removeChild(dom);

        //agent cards
        for (let agent of app.marketEconSimModule.market.currentAgents) {
            let newAgentCard = agentCardTemplate.cloneNode(true);

            newAgentCard.classList.add('generated');
            newAgentCard.classList.remove ('template');

            newAgentCard.querySelector('.agent-name').innerHTML = agent.name;
            newAgentCard.querySelector('.agent-type > .value').innerHTML = app.marketEconSimModule.productionRuleSets[agent.type].name;
            newAgentCard.querySelector('.agent-durability > .value').innerHTML = agent.durability;
            newAgentCard.querySelector('.agent-wallet > .value').innerHTML = round(agent.wallet, 2);

            for (let goodKey of Object.keys(agent.inventory)) {
                let newGoodField = agentGoodItemTemplate.cloneNode(true);

                newGoodField.classList.add('generated');
                newGoodField.classList.remove ('template');

                newGoodField.querySelector('.label').innerHTML = app.marketEconSimModule.goods[goodKey].name;
                newGoodField.querySelector('.label').title = 'Потребление агента — ' + agent.upkeepRules.filter(x => x.good == goodKey).reduce((a, b) => a + b.quantity, 0) +
                                                            '\n Нижний порог цены — ' + round(agent.priceBeliefs[goodKey].lowerLimit, 2) + '\n Верхний порог цены — ' + round(agent.priceBeliefs[goodKey].upperLimit, 2);
                newGoodField.querySelector('.value').innerHTML = agent.inventory[goodKey];

                newAgentCard.appendChild(newGoodField);
            }

            agentContainer.appendChild(newAgentCard);
        };
        //mean prices billboard
        let meanPriceBillboard = billboardTemplate.cloneNode(true);

        meanPriceBillboard.classList.add('generated');
        meanPriceBillboard.classList.remove ('template');

        meanPriceBillboard.querySelector('.title').innerHTML = 'Средние рыночные цены на товары';

        for (let goodKey of Object.keys(app.marketEconSimModule.market.goodHistoricalMeans)) {
            let newBillboardItem = billboardItemTempalte.cloneNode(true);

            newBillboardItem.classList.add('generated');
            newBillboardItem.classList.remove ('template');

            newBillboardItem.querySelector('.label').innerHTML = app.marketEconSimModule.goods[goodKey].name;
            newBillboardItem.querySelector('.value').innerHTML = round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey], 2);

            meanPriceBillboard.appendChild(newBillboardItem);
        };

        billboardContainer.appendChild(meanPriceBillboard);

        //bail out billboard
        let bailoutBillboard = billboardTemplate.cloneNode(true);

        bailoutBillboard.classList.add('generated');
        bailoutBillboard.classList.remove ('template');

        bailoutBillboard.querySelector('.title').innerHTML = 'Инвентарь банка';

        let bailoutWallet = billboardItemTempalte.cloneNode(true);

        bailoutWallet.classList.add('generated');
        bailoutWallet.classList.remove ('template');

        bailoutWallet.querySelector('.label').innerHTML = 'Баланс';
        bailoutWallet.querySelector('.value').innerHTML = round(app.marketEconSimModule.market.bailOutAgent.wallet, 2);

        bailoutBillboard.appendChild(bailoutWallet);

        for (let goodKey of Object.keys(app.marketEconSimModule.market.bailOutAgent.inventory)) {
            let newBillboardItem = billboardItemTempalte.cloneNode(true);

            newBillboardItem.classList.add('generated');
            newBillboardItem.classList.remove ('template');

            newBillboardItem.querySelector('.label').innerHTML = app.marketEconSimModule.goods[goodKey].name;
            newBillboardItem.querySelector('.value').innerHTML = round(app.marketEconSimModule.market.bailOutAgent.inventory[goodKey], 2);

            bailoutBillboard.appendChild(newBillboardItem);
        };

        billboardContainer.appendChild(bailoutBillboard);       
    };


    $(function() {
        app.containers.btnPanel = document.querySelector('.gizmos-panel');
        app.containers.treasureKnobsPanel = document.querySelector('.gen-tweaking-panel');

        app.components.spinner = document.querySelector('.spinner-container');
        app.components.btnClose = document.querySelector('.close-btn');
        app.components.btnTemplate = document.querySelector('.btn.template');
        app.components.switchTemplate = document.querySelector('.switch-btn.template');
        app.components.gizmoTemplate = document.querySelector('.gizmo.template');

        Object.keys(app.btnPatterns).forEach(key => {
            app.fabricateButton(app.btnPatterns[key]);
        });

        app.fabricateSwitch(app.containers.treasureKnobsPanel, 'Sword & Wizardry множитель [1d3+1]:', 'sw-base-multiplier', true, 'Итоговое значение энкаунтера умножается на случайное число от 2-ух до 4-ех. В базовой версии S&W имеется опция ОГРОМНОГО сокровища, в этом генераторе ее нет.');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, '5000gp обмен:', 'sw-5000-tradeout', true, 'Обмен производиться по правилам Swords & Wizardry Complete Rules');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, '1000gp обмен:', 'sw-1000-tradeout', true, 'Обмен производиться по правилам Swords & Wizardry Complete Rules');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, '100gp обмен:', 'sw-100-tradeout', true, 'Обмен производиться по правилам Swords & Wizardry Complete Rules');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, '*Антикварный обмен:', 'sw-antique-tradeout', false, 'Заменяет часть золота на антикварные продукты, которую правдоподобно могу быть обнаружены в руинах и проданы экспедициям и т.п.');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, '*Ремесленный обмен:', 'sw-artisan-goods-tradeout', false, 'Заменяет часть золота на ремесляную продукцию, которую правдоподобно могли носить с собой разумные существа.');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, '*Охотничье-промысловый обмен:', 'sw-bio-goods-tradeout', false, 'Заменяет все оставшиеся после обменов золотые монеты на продукты промысловой охоты, которые могут быть проданы. Их точное описание остается на усмотрение рассказчика.');

        app.fabricatePoliticalAgent();
        app.drawPoliticCanvas();

        for (let i of [...Array(10).keys()]) {
            app.fabricateNewEconAgent();
        };
        app.refreshMarketModule();
        
        $(app.components.spinner).hide();
        $(app.components.btnClose).hide();
        $(app.components.btnClose).removeClass('active');
        $('.gizmo').hide();
        $('.gizmo').removeClass('active');    

        $('.logo').on('click', () => {
            window.location.href="/";
        });

        $(app.components.btnClose).on('click', () => {
            $(app.components.btnClose).removeClass('active');
            $('.gizmo').removeClass('active');
            $('.main-content-block').removeClass('blurred');
            $('body').removeClass('locked');
            setTimeout(() => {
                $('.gizmo').hide();
                $(app.components.btnClose).hide();
            }, app.parameters.animationDelay);
        });

        $('.gen-treasure.btn').on('click', () => {
            app.treasureTradeouts();
        });

        $('.gen-open-tweak.btn').on('click', () => {
            ($('.gen-tweaking-panel').hasClass('active') ? $('.gen-tweaking-panel').removeClass('active') : $('.gen-tweaking-panel').addClass('active'));
            ($('.gen-tweaking-panel').hasClass('active') ? $('.gen-open-tweak.btn').html('Скрыть настройки') : $('.gen-open-tweak.btn').html('Показать настройки'));
        });

        $('.politic-gen-add-new.btn').on('click', () => {
            app.fabricatePoliticalAgent()
        });

        $('.market-econ-sim-next-round.btn').on('click', () => {
            app.econNextTurn();
        });

        $('.market-econ-sim-100-rounds.btn').on('click', () => {
            let promise = new Promise(resolve => {
                let loopClick = i => {
                    setTimeout(() => {
                        $('.market-econ-sim-next-round.btn')[0].click();
                        i++;
                        (i > 99 ? resolve() : loopClick(i));
                    }, 1000);
                };
                loopClick(0);
            });
            promise.then(() => console.log('Done clicking!'));
        });

        
    });

    function round(value, decimals = 0) {
        let returnNum = Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        return returnNum ? returnNum : 0;
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

})();