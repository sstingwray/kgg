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
                class: 'treasure-gen',
                btnPanel: '.treasure-btn-panel',
                knobPanel: '.treasure-knob-panel',
            },
            politicGen: {
                title:'Генератор политического компаса',
                class: 'politic-gen',
                btnPanel: '.politic-btn-panel',
                knobPanel: '',
            },
            econMarketSim: {
                title: 'Симулятор Рыночной Экономики',
                class: 'econ-sim',
                btnPanel: '.econ-btn-panel',
                knobPanel: '',
            },
            wodCombatHouserule: {
                title: 'Калькулятор боевки для WoD 20th KGG™ Edition',
                class: 'wod-combat-houserule',
                btnPanel: '.combat-btn-panel',
                knobPanel: '.combat-knob-panel',
            }
        },
        components: {
            spinner: {},
            btnClose: {},
            btnTemplate: {},
            switchTemplate: {},
            gizmoTemplate: {},
            separatorTemplate: {},
        },
        containers: {
            gizmoBtnPanel: {}
        },
        marketEconSimModule: {
            defaultAgent: {
                name: 'Брокер',
                nameTag: 0,
                wallet: 5000,
                durability: 10,
                bailOutChance: true,
                protected: false,
                type: 'trader',
                lastTurnProfit: 0,
                turnsWithoutProfit: 0,
                age: 0,
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
                currentTurn: 1,
                agentCounter: 0,
                currentAgents: [],
                currentAsks: [],
                currentLots: [],
                currentDeals: [],
                currentPlayerMessages: [],
                goodHistoricalMeans: {
                    manpower: 1,
                    fuel: 1,
                    food: 1,
                    alloys: 1,
                    goods: 1,
                },
                goodHistoricalDemand: {
                    manpower: 0,
                    fuel: 0,
                    food: 0,
                    alloys: 0,
                    goods: 0,
                },
                goodHistoricalSupply: {
                    manpower: 0,
                    fuel: 0,
                    food: 0,
                    alloys: 0,
                    goods: 0,
                },
                topGoodType: 'manpower',
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
        },
        wodCombatCharacters: {
            defaultCharacter: {
                name: 'Персонаж',
                attack: 0,
                difficulty: 6,
                damage: 1,
                defence: 0,
                soak: 0,
                dodge: 0,
                block: 0,
            },
            currentCharacters: []
        },
    };

    app.fabricateButton = (contrainer, labelText, type, target, btnClass, hintText = '') => {
        let newBtn = app.components.btnTemplate.cloneNode(true);

        newBtn.classList.add('generated');
        newBtn.classList.add(btnClass);
        newBtn.classList.add('btn');
        newBtn.classList.remove ('template');

        newBtn.innerHTML = labelText;
        newBtn.title = hintText;

        switch (type) {
            case 'gizmo':
                $(newBtn).on('click', () => {
                    $(`.gizmo.${target}`).show();
                    $(`.gizmo.${target}`).addClass('active');
                    $(`.landing-page-content`).addClass('hidden');
                    $(app.components.btnClose).show();
                    $(app.components.btnClose).addClass('active');
                    $('.landing-page-content').addClass('blurred');
                    $('body').addClass('locked');
                });
                break;
            case 'link':
                $(newBtn).on('click', () => {
                    window.open(btnPattern.target, '_blank');
                });
                break;
            default:

                break;
        }
        contrainer.appendChild(newBtn);
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

    app.addSeparator = (container) => {
        let newSeparator = app.components.separatorTemplate.cloneNode(true);

        newSeparator.classList.add('generated');
        newSeparator.classList.remove ('template');

        container.prepend(newSeparator);
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
    app.fabricateNewEconAgent = (type = 'agent') => {
        let newAgent = JSON.parse(JSON.stringify(app.marketEconSimModule.defaultAgent));

        newAgent.nameTag += app.marketEconSimModule.market.agentCounter;
        app.marketEconSimModule.market.agentCounter++;

        switch (type) {
            case 'bank':
                newAgent.name = 'Банк';
                newAgent.type = 'trader';
                newAgent.protected = true;
                for (let goodKey of Object.keys(newAgent.inventory)) {
                    newAgent.inventory[goodKey] = 0;
                };

                break;
            case 'player':
                newAgent.name = 'Игрок';
                newAgent.type = 'trader';
                newAgent.protected = true;
                newAgent.wallet = 0;
                for (let goodKey of Object.keys(newAgent.inventory)) {
                    newAgent.inventory[goodKey] = 0;
                };
                break;
        
            default:
                newAgent.name += ' #' + newAgent.nameTag;
                newAgent.type = Object.keys(app.marketEconSimModule.productionRuleSets)[Math.floor(Object.keys(app.marketEconSimModule.productionRuleSets).length*Math.random())];

                for (let goodKey of Object.keys(newAgent.inventory)) {
                    newAgent.inventory[goodKey] = round(Math.random()*100 + 100, 0);
                };
                break;
        };

        app.marketEconSimModule.market.currentAgents.push(newAgent);
    };

    app.marketTurnSimulation = async () => {
        let gatherListings = async () => {
            let playerBillboard = document.querySelector('.player-billboard');
            let createGoodListing = async (agent, goodKey) => {
                //Desired amount is 10 turns of upkeep + 500 of all agent components to enable production + 100 of everything just in case. If an agent is the bank, they always want to sell and never buy. If its a player, the amounts are taken from the player request panel
                let playerRequestAmount = playerBillboard.querySelector(`.${goodKey}-field > .amount`).value;
                let upkeepAmount = agent.upkeepRules.filter(x => x.good == goodKey).reduce((a, b) => a + b.quantity, 0);
                let productionAmount = (app.marketEconSimModule.productionRuleSets[agent.type].rules.filter(x => x.outputs.filter(y => y.key== goodKey).length > 0).length > 0 ? - 500 : 0);
                let transactionAmount = 0;
                
                if (agent.protected) {
                    switch (agent.name) {
                        case 'Банк':
                            transactionAmount = agent.inventory[goodKey];
                            break;
                    
                        case 'Игрок':
                            transactionAmount = playerRequestAmount;
                            break;
                    }
                } else  transactionAmount = agent.inventory[goodKey] - upkeepAmount*10 - productionAmount - 100;

                let transactionType = (agent.name == 'Банк' ? 'lot' : (agent.name == 'Игрок' ? playerBillboard.querySelector(`.${goodKey}-field > .transaction-type`).value : (transactionAmount > 0 ? 'lot' : 'ask')));

                transactionAmount = Math.abs(transactionAmount);

                switch (transactionType) {
                    case 'lot':
                        {
                            let mean = app.marketEconSimModule.market.goodHistoricalMeans[goodKey];
                            let upperPriceLimit = (!agent.protected ? agent.priceBeliefs[goodKey].upperLimit : playerBillboard.querySelector(`.${goodKey}-field > .max-price`).value);
                            let lowerPriceLimit = (!agent.protected ? agent.priceBeliefs[goodKey].lowerLimit : playerBillboard.querySelector(`.${goodKey}-field > .min-price`).value);
                            let favorability = (agent.protected ? 1 : (mean > upperPriceLimit ? 1 : (mean < lowerPriceLimit ? 0.2 : Math.max(0.2, findNumberPosition(mean, lowerPriceLimit, upperPriceLimit)))));
                            let amount = round(favorability*transactionAmount, 0);

                            if (amount > 0) {
                                //console.log(`${agent.name} wants to ${transactionType} ${transactionAmount} of ${goodKey}`);
                                //console.log(`Favorability is ${round(favorability, 2)}, the amount will instead be ${amount}`);
                                app.marketEconSimModule.market.currentLots.push({
                                    sellerName: agent.name,
                                    good: goodKey,
                                    quantity: amount,
                                    price: upperPriceLimit,
                                });
                                if (agent.name == 'Игрок') app.marketEconSimModule.market.currentPlayerMessages.push({ turn: app.marketEconSimModule.market.currentTurn, text: `Игрок разместил предложение о продаже ${amount} [${app.marketEconSimModule.goods[goodKey].name}], искомая цена — ${upperPriceLimit}`});
                            };
                        };
                        break;
                    case 'ask':
                        { 
                            let mean = app.marketEconSimModule.market.goodHistoricalMeans[goodKey];
                            let upperPriceLimit = agent.priceBeliefs[goodKey].upperLimit;
                            let lowerPriceLimit = agent.priceBeliefs[goodKey].lowerLimit;
                            let favorability = (agent.protected ? 1 : (mean > upperPriceLimit ? 0.2 : (mean < lowerPriceLimit ? 1 : Math.max(0.2, 1 - findNumberPosition(mean, lowerPriceLimit, upperPriceLimit)))));
                            let amount = round(Math.min(favorability*transactionAmount, agent.wallet/upperPriceLimit), 0);

                            if (amount > 0) {
                                //console.log(`${agent.name} wants to ${transactionType} ${transactionAmount} of ${goodKey}`);
                                //console.log(`Favorability is ${round(favorability, 2)}, has money to buy only ${round(agent.wallet / upperPriceLimit, 0)}, the amount will instead be ${amount}`);
                                app.marketEconSimModule.market.currentAsks.push({
                                    buyerName: agent.name,
                                    good: goodKey,
                                    quantity: amount,
                                    price: lowerPriceLimit,
                                });
                                if (agent.name == 'Игрок') app.marketEconSimModule.market.currentPlayerMessages.push({ turn: app.marketEconSimModule.market.currentTurn, text: `Игрок разместил запрос на покупку ${amount} [${app.marketEconSimModule.goods[goodKey].name}], искомая цена — ${lowerPriceLimit}`});
                            };
                        };
                        break;
                };
            };
            let createGoodListingsForAgent = async (agent) => { 
                for await (let goodKey of Object.keys(agent.inventory)) {
                    await createGoodListing(agent, goodKey);
                    //console.log(`Done making ${goodKey} listings for agent ${agent.name}`);
                };
            };

            for await (let agent of app.marketEconSimModule.market.currentAgents) {
                await createGoodListingsForAgent(agent);
            };

            //console.log(`Done making good listings for turn #${app.marketEconSimModule.market.currentTurn}`);
        };
        let matchListings = async () => {
            let goodsDemand = [];
            let matchGood = async (goodKey) => {
                let shuffledLots = shuffle(app.marketEconSimModule.market.currentLots.filter(x => x.good == goodKey));
                let shuffledAsks = shuffle(app.marketEconSimModule.market.currentAsks.filter(x => x.good == goodKey));
                let sortedLots = shuffledLots.sort((a, b) => (a.price > b.price) ? 1 : -1);
                let sortedAsks = shuffledAsks.sort((a, b) => (a.price < b.price) ? 1 : -1);
                let playerLotPosition = sortedLots.map((x, index) => { if (x.sellerName == 'Игрок') return { index: index, good: goodKey } }).filter(x => x != null);
                let playerAskPosition = sortedAsks.map((x, index) => { if (x.buyerName == 'Игрок') return { index: index, good: goodKey } }).filter(x => x != null);
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
                        let quantity = Math.min(buyer.quantity, seller.quantity, sellerAgent.inventory[goodKey]);
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

                            if (sellerAgent.name == 'Игрок') app.marketEconSimModule.market.currentPlayerMessages.push({ turn: app.marketEconSimModule.market.currentTurn, text: `Игрок смог продать ${quantity} [${app.marketEconSimModule.goods[goodKey].name}] за ${clearingPrice*quantity}(${clearingPrice} шт.), покупатель - ${buyerAgent.name}`});
                            if (buyerAgent.name == 'Игрок') app.marketEconSimModule.market.currentPlayerMessages.push({ turn: app.marketEconSimModule.market.currentTurn, text: `Игрок смог купить ${quantity} [${app.marketEconSimModule.goods[goodKey].name}] за ${clearingPrice*quantity}(${clearingPrice} шт.), продавец - ${sellerAgent.name}`});
                        };

                        PriceBeliefsAdjustment: {
                            if (!buyerAgent.protected) {
                                
                                if (buyer.quantity/2 >= quantity) {
                                    //console.log(`Buyer ${buyerAgent.name} could buy half or more of their ask, closing the price belief gap for ${goodKey} by ${round(buyerAgentPriceBeliefs.upperLimit/10, 2)}`);
                                    buyerAgentPriceBeliefs.lowerLimit += round(buyerAgentPriceBeliefs.upperLimit/10, 2);
                                    buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round(buyerAgentPriceBeliefs.upperLimit/10, 2), buyerAgentPriceBeliefs.lowerLimit);
                                } else {
                                    //console.log(`Buyer ${buyerAgent.name} could only buy half of less of their ask, upping the upper price belief gap for ${goodKey} by ${round(buyerAgentPriceBeliefs.upperLimit/10, 2)}`);
                                    buyerAgentPriceBeliefs.upperLimit += round(buyerAgentPriceBeliefs.upperLimit/10, 2);
                                };
            
                                if (buyerMarketShare < 1) {
                                    //console.log(`Buyer ${buyerAgent.name} had no full Market Share, upping beliefs for ${goodKey} by ${round(buyerDisplacement, 2)}`);
                                    buyerAgentPriceBeliefs.lowerLimit += round(buyerDisplacement, 2);
                                    buyerAgentPriceBeliefs.upperLimit += round(buyerDisplacement, 2);
                                } else if (seller.price > clearingPrice) {
                                    //console.log(`Seller ${sellerAgent.name} price was higher than clearing pice, lowering buyer${buyerAgent.name} beliefs for ${goodKey} by ${round((seller.price - clearingPrice) * 1.1, 2)}`);
                                    buyerAgentPriceBeliefs.lowerLimit = Math.max(buyerAgentPriceBeliefs.lowerLimit - round((seller.price - clearingPrice)*1.1, 2), 1);
                                    buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round((seller.price - clearingPrice)*1.1, 2), 1);
                                } else if (supply > demand && seller.price > app.marketEconSimModule.market.goodHistoricalMeans[goodKey]) {
                                    //console.log(`Supply was higher than demand and seller ${seller.price} price was higher than current historical mean${app.marketEconSimModule.market.goodHistoricalMeans[goodKey]}, lowering buyer ${buyerAgent.name} beliefs for ${goodKey} by ${round((seller.price - app.marketEconSimModule.market.goodHistoricalMeans[goodKey]) * 1.1, 2)}`);
                                    buyerAgentPriceBeliefs.lowerLimit = Math.max(buyerAgentPriceBeliefs.lowerLimit - round((seller.price - app.marketEconSimModule.market.goodHistoricalMeans[goodKey])*1.1, 2), 1);
                                    buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round((seller.price - app.marketEconSimModule.market.goodHistoricalMeans[goodKey])*1.1, 2), 1);
                                } else if (demand > supply) {
                                    //console.log(`Demand was higher than supply, upping buyer ${buyerAgent.name} beliefs for ${goodKey} by ${round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey] / 5, 2)}`);
                                    buyerAgentPriceBeliefs.lowerLimit += round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2);
                                    buyerAgentPriceBeliefs.upperLimit += round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2);
                                } else {
                                    //console.log(`No conditions were met, lowering buyer ${buyerAgent.name} beliefs for ${goodKey} by ${round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey] / 5, 2)}`);
                                    buyerAgentPriceBeliefs.lowerLimit = Math.max(buyerAgentPriceBeliefs.lowerLimit - round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2), 1);
                                    buyerAgentPriceBeliefs.upperLimit = Math.max(buyerAgentPriceBeliefs.upperLimit - round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey]/5, 2), 1);
                                };
                            };
                           
                            if (!sellerAgent.protected) {
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

                        };

                        //console.log(`Good is ${goodKey}, seller # ${i}/${sortedLots.length - 1}, buyer # ${j}/${sortedAsks.length - 1}`);
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
                if (playerLotPosition.length > 0) app.marketEconSimModule.market.currentPlayerMessages.push({ turn: app.marketEconSimModule.market.currentTurn, text: `Позиция запроса игрока на продажу [${app.marketEconSimModule.goods[playerLotPosition[0].good].name}] - ${playerLotPosition[0].index}`});
                if (playerAskPosition.length > 0) app.marketEconSimModule.market.currentPlayerMessages.push({ turn: app.marketEconSimModule.market.currentTurn, text: `Позиция запроса игрока на покупку [${app.marketEconSimModule.goods[playerAskPosition[0].good].name}] - ${playerAskPosition[0].index}`});
                
                await iterateDeals(0, 0);
                if (currentTurnMeanPriceForGood.length > 0) app.marketEconSimModule.market.goodHistoricalMeans[goodKey] = (app.marketEconSimModule.market.goodHistoricalMeans[goodKey] + round(currentTurnMeanPriceForGood.reduce((a, b) => a + b)/currentTurnMeanPriceForGood.length, 2))/2;
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
            let changeAgent = async (agent) => {
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

            await matchListings();

            for await (let agent of app.marketEconSimModule.market.currentAgents) {
                await changeAgent(agent);
            };
        };
        let updateProtectedAgentsPriceBeliefs = async () => {
            await changeAgentTypes();
            for (let agent of app.marketEconSimModule.market.currentAgents) {
                if (agent.name == 'Банк') {
                    for (let goodKey of Object.keys(agent.priceBeliefs)) {
                        agent.priceBeliefs[goodKey].lowerLimit = round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey], 2);
                        agent.priceBeliefs[goodKey].upperLimit = round(app.marketEconSimModule.market.goodHistoricalMeans[goodKey], 2);
                    };
                };
            };
        };

        await updateProtectedAgentsPriceBeliefs();
    }

    app.productionSimulation = async () => {
        let goodProductionByRule = async (agent, goodKey, rule, totalProduction) => {
            let upkeepAmount = agent.upkeepRules.filter(x => x.good == goodKey).reduce((a, b) => a + b.quantity, 0);
            let possibleProduction = [];
            for (let component of rule.components) {
                if (agent.inventory[component.key] - upkeepAmount*10 + component.quantity > 0) possibleProduction.push((agent.inventory[component.key] - upkeepAmount*10)/component.quantity);
            };
            //if the agent does not have enough components to make anything, skip the money limit, otherwise put it in the list of possible production numbers. Also limit production so that the agent has no more than 2K of inventory
            if (possibleProduction.length > 0) {
                //possibleProduction.push(round(agent.wallet/app.marketEconSimModule.goods[goodKey].baseCost, 0));
                possibleProduction.push(Math.max(0, 1000 - agent.inventory[goodKey], 0));
            };
            //console.log(`Possible production numbers for ${goodKey} are ${[...possibleProduction]}`);
            let productionNumber = (possibleProduction.length > 0 ? Math.floor(Math.min(...possibleProduction)) : 0);
            //console.log(`${agent.name} is trying to make ${productionNumber} of ${goodKey}`);
            for (let component of rule.components) {
                agent.inventory[component.key] -= productionNumber*component.quantity;
                agent.wallet -= productionNumber*app.marketEconSimModule.goods[goodKey].baseCost;
            };
            for (let output of rule.outputs) {
                agent.inventory[output.key] += productionNumber*output.quantity;
                totalProduction += productionNumber*output.quantity;
            };
            if (totalProduction == 0) agent.wallet -= round(agent.wallet*0.05 + 5, 2);
        };
        let agentGoodProductions = async (agent, goodKey, totalProduction) => {
            let shuffledRules = shuffle(app.marketEconSimModule.productionRuleSets[agent.type].rules.filter(x => x.outputs.filter(y => y.key == goodKey).length > 0));
            for await (let rule of shuffledRules) {
                await goodProductionByRule(agent, goodKey, rule, totalProduction);
                if (agent.inventory[goodKey] < 0) console.log('Agent ' + agent.name + ' inventory of ' + goodKey + ' became negative during Production Phase!');
            };
        };
        let agentProduction = async (agent) => {
            let sortedGoods = Object.keys(agent.inventory).sort((a, b) => (agent.inventory[a] - agent.upkeepRules.filter(x => x.good == a).reduce((x, z) => x + z.quantity, 0)*10 > agent.inventory[b] - agent.upkeepRules.filter(x => x.good == b).reduce((x, z) => x + z.quantity, 0)*10) ? 1 : -1);
            let totalProduction = 0;
            //console.log('Priority of production for ' + agent.name);
            //console.log(sortedGoods.join(', '));
            for (let goodKey of sortedGoods) {
                await agentGoodProductions(agent, goodKey, totalProduction);                
            };
        };

        for await(let agent of app.marketEconSimModule.market.currentAgents) {
            if (!agent.protected) await agentProduction(agent);
        };

        //console.log(`Production for Turn #${app.marketEconSimModule.market.currentTurn} is finished`);
    };

    app.upkeepSimulation = async () => {
        let checkAgentUpkeepGood = async (agent, upkeep) => {
            if (agent.inventory[upkeep.good] - upkeep.quantity < 0) {
                agent.inventory[upkeep.good] = 0;
                agent.durability -= 5;
                //console.log(`${agent.name} could not fulfill their ${upkeep.good} upkeep, losing 5 durability. Current durability is ${agent.durability}`);
            } else {
                agent.inventory[upkeep.good] -= upkeep.quantity;
                //console.log(`${agent.name} could fulfilled their ${upkeep.good} upkeep, gaining 1 durability. Current durability is ${agent.durability}`);
                //agent.durability++;
            };
        };

        let agentUpkeep = async (agent) => {
            for await (let upkeep of agent.upkeepRules) {
                await checkAgentUpkeepGood(agent, upkeep)
                //if (agent.inventory[upkeep.good] < 0) console.log(`Agent ${agent.name} inventory of ${upkeep.good} became negative during Upkeep Phase!`);
            };
        };

        for await (let agent of app.marketEconSimModule.market.currentAgents) {
            if (!agent.protected) await agentUpkeep(agent)
            else if (agent.name == 'Банк') agent.wallet = 0;
            agent.age++;
        };

        //console.log(`Upkeep for Turn #${app.marketEconSimModule.market.currentTurn} is finished`);
    };

    app.bailAndRetiretAgents = async () => {
        let bankAgent = app.marketEconSimModule.market.currentAgents.filter(x => x.name == 'Банк')[0];
        let buyOutGood = async (agent, goodKey, payPercent) => {
            let bailOutVolume = agent.inventory[goodKey];
            let bailOutPay = bailOutVolume*app.marketEconSimModule.market.goodHistoricalMeans[goodKey]*payPercent;

            bankAgent.wallet -= bailOutPay;
            agent.wallet += bailOutPay;

            bankAgent.inventory[goodKey] += bailOutVolume;
            agent.inventory[goodKey] = 0;
            agent.bailOutChance = false;
        };
        let bailOutAgent = async (agent, i) => {
            //Bail-out mechanism, that buys all the materials from the agent at a historical mean price in order to let them participate in the market again
            if ((agent.durability <= 0 || agent.wallet <= 0) && agent.bailOutChance) {
                //console.log(`Agent ${agent.name} is being bailed-out`);
                for await (let goodKey of Object.keys(agent.inventory)) {
                    await buyOutGood(agent, goodKey, 1);
                };
            //Retire mechanism, that buys all the materials from the agent at a historical mean price and retires the agent
            } else if ((agent.durability <= 0 || agent.wallet <= 0) && !agent.bailOutChance) {
                //console.log(`Agent ${agent.name} is being retired`);
                for await (let goodKey of Object.keys(agent.inventory)) {
                    await buyOutGood(agent, goodKey, 1);
                };
                app.marketEconSimModule.market.currentAgents.splice(i, 1);
                //replace retired agent with a new one
                app.fabricateNewEconAgent();
            };
        };

        for await (let [i, agent] of app.marketEconSimModule.market.currentAgents.entries()) {
            if (!agent.protected) await bailOutAgent(agent, i);
        };
    };

    app.refreshMarketModule = () => {
        let gizmo = document.querySelector('.gizmo.econ-sim');

        let billboardContainer = gizmo.querySelector('.market-billboard-container');
        let billboardTemplate = billboardContainer.querySelector('.market-billboard.template');
        let billboardItemTempalte = billboardTemplate.querySelector('.billboard-item.template');

        let agentCardTemplate = gizmo.querySelector('.agent-card.template');
        let agentGoodItemTemplate = agentCardTemplate.querySelector('.agent-good.template');
        let agentContainer = gizmo.querySelector('.agent-card-container');

        let generatedAgentDOMs = agentContainer.querySelectorAll('.generated');
        let generatedBillboardDOMs = billboardContainer.querySelectorAll('.generated');

        gizmo.querySelector('.turn-counter').innerHTML = `Раунд ${app.marketEconSimModule.market.currentTurn}`;
        for (let dom of generatedAgentDOMs) dom.parentElement.removeChild(dom);
        for (let dom of generatedBillboardDOMs) dom.parentElement.removeChild(dom);

        agentCards: {
            for (let agent of app.marketEconSimModule.market.currentAgents) {
                if (!agent.protected) {
                    let newAgentCard = agentCardTemplate.cloneNode(true);

                    newAgentCard.classList.add('generated');
                    newAgentCard.classList.remove ('template');

                    newAgentCard.querySelector('.agent-name').innerHTML = agent.name;
                    newAgentCard.querySelector('.agent-type > .value').innerHTML = app.marketEconSimModule.productionRuleSets[agent.type].name;
                    newAgentCard.querySelector('.agent-durability > .value').innerHTML = agent.durability;
                    newAgentCard.querySelector('.agent-age > .value').innerHTML = agent.age;
                    newAgentCard.querySelector('.agent-wallet > .value').innerHTML = round(agent.wallet, 2);

                    for (let goodKey of Object.keys(agent.inventory)) {
                        let newGoodField = agentGoodItemTemplate.cloneNode(true);

                        newGoodField.classList.add('generated', `${goodKey}-field`);
                        newGoodField.classList.remove ('template');

                        newGoodField.querySelector('.label').innerHTML = app.marketEconSimModule.goods[goodKey].name;
                        newGoodField.querySelector('.label').title = 'Потребление агента — ' + agent.upkeepRules.filter(x => x.good == goodKey).reduce((a, b) => a + b.quantity, 0) +
                                                                    '\n Нижний порог цены — ' + round(agent.priceBeliefs[goodKey].lowerLimit, 2) + '\n Верхний порог цены — ' + round(agent.priceBeliefs[goodKey].upperLimit, 2);
                        newGoodField.querySelector('.value').innerHTML = agent.inventory[goodKey];

                        newAgentCard.appendChild(newGoodField);
                    };

                    agentContainer.appendChild(newAgentCard);
                };
            };
        };

        meanPricesBillboard: {
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
        };

        bailOutBillboard: {
            let bailoutBillboard = billboardTemplate.cloneNode(true);
            let bankAgent = app.marketEconSimModule.market.currentAgents.filter(x => x.name == 'Банк')[0];

            bailoutBillboard.classList.add('generated');
            bailoutBillboard.classList.remove ('template');

            bailoutBillboard.querySelector('.title').innerHTML = 'Инвентарь банка';

            /*let bailoutWallet = billboardItemTempalte.cloneNode(true);

            bailoutWallet.classList.add('generated');
            bailoutWallet.classList.remove ('template');

            bailoutWallet.querySelector('.label').innerHTML = 'Баланс';
            bailoutWallet.querySelector('.value').innerHTML = round(bankAgent.wallet, 2);

            bailoutBillboard.appendChild(bailoutWallet);*/

            for (let goodKey of Object.keys(bankAgent.inventory)) {
                let newBillboardItem = billboardItemTempalte.cloneNode(true);

                newBillboardItem.classList.add('generated');
                newBillboardItem.classList.remove ('template');

                newBillboardItem.querySelector('.label').innerHTML = app.marketEconSimModule.goods[goodKey].name;
                newBillboardItem.querySelector('.label').title = `${bankAgent.priceBeliefs[goodKey].lowerLimit} - ${bankAgent.priceBeliefs[goodKey].upperLimit}`;
                newBillboardItem.querySelector('.value').innerHTML = round(bankAgent.inventory[goodKey], 2);

                bailoutBillboard.appendChild(newBillboardItem);
            };

            billboardContainer.appendChild(bailoutBillboard);   
        };

        playerAskLotBillboard: {
            let playerBillboard = billboardTemplate.cloneNode(true);
            let playerAgent = app.marketEconSimModule.market.currentAgents.filter(x => x.name == 'Игрок')[0];

            playerBillboard.classList.add('generated', 'player-billboard');
            playerBillboard.classList.remove ('template');

            playerBillboard.querySelector('.title').innerHTML = 'Игрок';

            for (let goodKey of Object.keys(app.marketEconSimModule.market.goodHistoricalMeans)) {
                let newBillboardItem = billboardItemTempalte.cloneNode(true);

                newBillboardItem.classList.add('generated', 'jc-end', `${goodKey}-field`);
                newBillboardItem.classList.remove ('template', 'jc-space-betw');

                newBillboardItem.querySelector('.label').innerHTML = app.marketEconSimModule.goods[goodKey].name;
                newBillboardItem.querySelector('.label').title = `${playerAgent.priceBeliefs[goodKey].lowerLimit} - ${playerAgent.priceBeliefs[goodKey].upperLimit}`;
                newBillboardItem.querySelector('.value').innerHTML = round(playerAgent.inventory[goodKey], 2);
                newBillboardItem.querySelector('.amount').style.display = 'block';
                newBillboardItem.querySelector('.transaction-type').style.display = 'block';
                newBillboardItem.querySelector('.min-price').style.display = 'block';
                newBillboardItem.querySelector('.min-price').value = playerAgent.priceBeliefs[goodKey].lowerLimit;
                newBillboardItem.querySelector('.max-price').style.display = 'block';
                newBillboardItem.querySelector('.max-price').value = playerAgent.priceBeliefs[goodKey].upperLimit;

                $(newBillboardItem.querySelector('.min-price')).on('change', () => {
                    playerAgent.priceBeliefs[goodKey].lowerLimit = newBillboardItem.querySelector('.min-price').value;
                });

                $(newBillboardItem.querySelector('.max-price')).on('change', () => {
                    playerAgent.priceBeliefs[goodKey].upperLimit = newBillboardItem.querySelector('.max-price').value;
                });


                playerBillboard.appendChild(newBillboardItem);
            };

            let playerBillboardWallet = billboardItemTempalte.cloneNode(true);

            playerBillboardWallet.classList.add('generated', 'jc-start');
            playerBillboardWallet.classList.remove ('template', 'jc-space-betw');

            playerBillboardWallet.querySelector('.label').innerHTML = 'Кошелек для торговли';
            playerBillboardWallet.querySelector('.value').style.display = 'none';
            playerBillboardWallet.querySelector('.amount').style.display = 'block';
            playerBillboardWallet.querySelector('.amount').classList.add('short');
            playerBillboardWallet.querySelector('.amount').value = round(playerAgent.wallet, 2);
            playerBillboardWallet.querySelector('.reset-player-input.btn').style.display = 'block';
            playerBillboardWallet.querySelector('.reset-player-input.btn').title = 'Сбросить инвентарь, очистить поля и обнулить кошелек';

            $(playerBillboardWallet.querySelector('.amount')).on('change', () => {
                playerAgent.wallet = playerBillboardWallet.querySelector('.amount').value;
            });
            $(playerBillboardWallet.querySelector('.reset-player-input.btn')).on('click', () => {
                playerAgent.wallet = 0;
                for (let goodKey of Object.keys(playerAgent.inventory)) playerAgent.inventory[goodKey] = 0;
                app.refreshMarketModule();
            });

            playerBillboard.appendChild(playerBillboardWallet);

            billboardContainer.appendChild(playerBillboard);
        };
        
        if (app.marketEconSimModule.market.currentPlayerMessages.length > 0) $('.market-econ-sim-player-log').html(app.marketEconSimModule.market.currentPlayerMessages.map(x => x.text).join('<br>'));

    };

    app.econNextTurn = async () => {
        app.marketEconSimModule.market.currentTurn++;
        app.marketEconSimModule.market.currentAsks = [];
        app.marketEconSimModule.market.currentLots = [];

        //console.log(`Turn #${app.marketEconSimModule.market.currentTurn}`);
        await app.upkeepSimulation();
        await app.productionSimulation();
        await app.bailAndRetiretAgents();
        await app.marketTurnSimulation();
        //console.log('Turn #' + app.marketEconSimModule.market.currentTurn + ' calculation is finished!');
        //console.log('Agents at the end of the turn');
        //console.log(app.marketEconSimModule.market.currentAgents);
        if (app.marketEconSimModule.market.currentPlayerMessages.filter(x => x.turn == app.marketEconSimModule.market.currentTurn).length > 0) {
            let turnIndex = app.marketEconSimModule.market.currentPlayerMessages.findIndex(x => x.turn == app.marketEconSimModule.market.currentTurn);
            app.marketEconSimModule.market.currentPlayerMessages.splice(turnIndex, 0, { turn: app.marketEconSimModule.market.currentTurn, text: `Раунд #${app.marketEconSimModule.market.currentTurn - 1}`});
            app.marketEconSimModule.market.currentPlayerMessages.push({ turn: app.marketEconSimModule.market.currentTurn, text: ``});
        };
        app.refreshMarketModule();
    };

    //WOD-COMBAT
    app.calculateAttack = () => {
        let gizmo = document.querySelector('.gizmo.wod-combat-houserule');
        let resultTemplate = gizmo.querySelector('.combat-item.template');
        let resultContainer = gizmo.querySelector('.combat-results');
        let attackDicePool = +gizmo.querySelector('#combat-attack-input').value;
        let difficulty = +gizmo.querySelector('#combat-attack-diff-input').value;
        let damage = +gizmo.querySelector('#combat-attack-dmg-input').value;
        let defence = +gizmo.querySelector('#combat-defence-input').value;
        let soak = +gizmo.querySelector('#combat-soak-input').value;
        let defenderAction = gizmo.querySelector('#combat-defender-action').value;
        let defenderPool = +gizmo.querySelector('#combat-defender-pool-input').value;
        let description = gizmo.querySelector('#combat-attack-descr-input').value;

        let timestamp = new Date();

        let isAttackSpec = gizmo.querySelector('.combat-atk-spec > input').checked;
        let isDodgeSpec = gizmo.querySelector('.combat-dodge-spec > input').checked;
        let isBlockSpec = gizmo.querySelector('.combat-block-spec > input').checked;
        let isBotch = gizmo.querySelector('.combat-botch > input').checked;

        let defenderDice = [...Array(defenderPool).keys()].map(x => x = Math.round(Math.random()*9) + 1);
        let defenderSucc = defenderDice.map(x => (x == 10 && (defenderAction == 'dodge' ? isDodgeSpec : 0) ? 2 : x >= 6 ? 1 : x == 1 && isBotch ? -1 : 0)).reduce((a, b) => a + b, 0);
        if (defenderAction == 'dodge') {
            defenderSucc = defenderDice.map(x => (x == 10 && isDodgeSpec ? 2 : x >= 6 ? 1 : x == 1 && isBotch ? -1 : 0)).reduce((a, b) => a + b, 0);
        } else if (defenderAction == 'block') {
            defenderSucc = defenderDice.map(x => (x == 10 && isBlockSpec ? 2 : x >= 6 ? 1 : x == 1 && isBotch ? -1 : 0)).reduce((a, b) => a + b, 0);
        };
        let attackDice = [...Array(attackDicePool - defence).keys()].map(x => x = Math.round(Math.random()*9) + 1);
        let attackSucc = attackDice.map(x => (x == 10 && isAttackSpec ? 2 : x >= difficulty ? 1 : x == 1 && isBotch ? -1 : 0)).reduce((a, b) => a + b, 0);
        let totalAttackSucc = Math.max(attackSucc - (defenderAction == 'dodge' ? defenderSucc : 0) - 1, 0);
        let isMiss = attackSucc - (defenderAction == 'dodge' ? defenderSucc : 0) <= 0;
        let result = ``;

        let newResultItem = resultTemplate.cloneNode(true);
        newResultItem.classList.add('generated');
        newResultItem.classList.remove ('template');

        newResultItem.querySelector('.item-timestamp').innerHTML += `<span class="mrg-01em">${timestamp.toLocaleTimeString()}</span>`;

        newResultItem.querySelector('.item-descr').innerHTML = `<span class="mrg-01em">${description}</span>`;

        //РЕЗУЛЬТАТ
        newResultItem.querySelector('.item-result > .label').title += `${attackSucc} успехов в атаке, ${(defenderAction == 'dodge' ? defenderSucc : 0)} успехов в уклонении. ${damage} базового урона, ${totalAttackSucc} урона за попадание, ${soak} пассивного поглощения, ${(defenderAction == 'block' ? defenderSucc : 0)} поглощения за блок`;
        if (attackSucc > 0 ) {
            if (attackSucc - (defenderAction == 'dodge' ? defenderSucc : 0) <= 0) {
                result = `Защитник увернулся`;
            } else {
                if (damage + Math.max(attackSucc - 1, 0) - soak - (defenderAction == 'block' ? defenderSucc : 0) <= 0) {
                    result = `Защитник блокировал удар`;
                } else {
                    result = `Атакующий попал и нанес ${damage + (totalAttackSucc) - soak - (defenderAction == 'block' ? defenderSucc : 0)} урона`;
                }
            }
        } else {
            result = `Атакующий промазал`;
        }
        newResultItem.querySelector('.item-result').innerHTML += `<span class="mrg-01em">${result}</span>`;

        //ДЕТАЛИ ПОПАДАНИЯ АТАКИ
        if (attackDicePool == 0 || attackDicePool - defence <= 0) $(newResultItem.querySelector('.item-attack')).remove()
        else {
            newResultItem.querySelector('.item-attack > .label').title += `дайспул ${attackDicePool - defence} (${attackDicePool} атаки - ${defence} защиты)`;
            for (let die of attackDice) newResultItem.querySelector('.item-attack').innerHTML += `<span class="mrg-01em ${(die >= difficulty ? `color-green` : `color-red`)}">${die}</span>`
        };

        //ДЕТАЛИ ЗАЩИТЫ
        if (defenderAction != 'dodge' || defenderDice <= 0) $(newResultItem.querySelector('.item-defence')).remove()
        else {
            newResultItem.querySelector('.item-defence > .label').title += `дайспул ${defenderPool}`;
            for (let die of defenderDice) newResultItem.querySelector('.item-defence').innerHTML += `<span class="mrg-01em ${(die >= 6 ? `color-green` : `color-red`)}">${die}</span>`
        };

        //ДЕТАЛИ УРОНА
        if (isMiss) $(newResultItem.querySelector('.item-damage')).remove()
        else {
            newResultItem.querySelector('.item-damage > .label').title += `${totalAttackSucc} урона за попадание + ${damage} базового урона - ${soak} пассивного поглощения)`;
            newResultItem.querySelector('.item-damage').innerHTML += `<span class="mrg-01em">${damage + totalAttackSucc - soak}</span>`;
        };

        //ДЕТАЛИ ПОГЛОЩЕНИЯ
        if (defenderAction != 'block' || defenderDice <= 0) $(newResultItem.querySelector('.item-soak')).remove()
        else {
            newResultItem.querySelector('.item-soak > .label').title += `дайспул ${defenderPool}`;
            for (let die of defenderDice) newResultItem.querySelector('.item-soak').innerHTML += `<span class="mrg-01em ${(die >= 6 ? `color-green` : `color-red`)}">${die}</span>`
        };

        resultContainer.prepend(newResultItem);
    };

    app.calculateInitiative = () => {
        let gizmo = document.querySelector('.gizmo.wod-combat-houserule');
        let resultTemplate = gizmo.querySelector('.combat-item.template');
        let resultContainer = gizmo.querySelector('.combat-results');
        let name = gizmo.querySelector('#combat-name-input').value;
        let initBonus = gizmo.querySelector('#combat-init-input').value;

        let timestamp = new Date();

        let initRoll = [...Array(1).keys()].map(x => x = Math.round(Math.random()*10) + 1);
        let initResult = initRoll.reduce((a,b) => a + b) + parseInt(initBonus);

        let newResultItem = resultTemplate.cloneNode(true);

        newResultItem.classList.add('generated');
        newResultItem.classList.remove ('template');
        newResultItem.querySelector('.item-timestamp').innerHTML += `<span class="mrg-01em">${timestamp.toLocaleTimeString()}</span>`;
        newResultItem.querySelector('.item-result > .label').title += `${initRoll.join(` + `)} + ${initBonus}`;
        newResultItem.querySelector('.item-result').innerHTML += `<span class="mrg-01em">Инициатива ${name} — ${initResult}</span>`;

        $(newResultItem.querySelector('.item-attack')).remove();
        $(newResultItem.querySelector('.item-defence')).remove();
        $(newResultItem.querySelector('.item-damage')).remove();
        $(newResultItem.querySelector('.item-soak')).remove();
        $(newResultItem.querySelector('.item-descr')).remove();

        resultContainer.prepend(newResultItem);
    };

    app.getCharacterFormData = async () => {
        let form = document.querySelector('.add-new-character-form');
        let newCharacterData = JSON.parse(JSON.stringify(app.wodCombatCharacters.defaultCharacter));

        newCharacterData.name = form.querySelector('#new-char-name-input').value;
        newCharacterData.attack = form.querySelector('#new-char-attack-input').innerHTML;
        newCharacterData.difficulty = form.querySelector('#new-char-diff-input').innerHTML;
        newCharacterData.damage = form.querySelector('#new-char-dmg-input').innerHTML;
        newCharacterData.defence = form.querySelector('#new-char-def-input').innerHTML;
        newCharacterData.soak = form.querySelector('#new-char-soak-input').innerHTML;
        newCharacterData.dodge = form.querySelector('#new-char-dodge-input').innerHTML;
        newCharacterData.block = form.querySelector('#new-char-block-input').innerHTML;

        app.wodCombatCharacters.currentCharacters.push(newCharacterData);
    };

    app.refreshCombatModule = () => {
        let gizmo = document.querySelector('.gizmo.wod-combat-houserule');

        let characterCardContainer = gizmo.querySelector('.character-card-container');
        let characterCardTemplate = gizmo.querySelector('.combat-char-card.template');

        for (let char of app.wodCombatCharacters.currentCharacters) {
            
            let newCharacterCard = characterCardTemplate.cloneNode(true);

            newCharacterCard.classList.add('generated');
            newCharacterCard.classList.remove ('template');

            newCharacterCard.querySelector('.char-name > .value').innerHTML = char.name;
            newCharacterCard.querySelector('.char-attack > .value').innerHTML = char.attack;
            newCharacterCard.querySelector('.char-diff > .value').innerHTML = char.diff;
            newCharacterCard.querySelector('.char-dmg > .value').innerHTML = char.dmg;
            newCharacterCard.querySelector('.char-def > .value').innerHTML = char.def;
            newCharacterCard.querySelector('.char-soak > .value').innerHTML = char.soak;
            newCharacterCard.querySelector('.char-dodge > .value').innerHTML = char.dodge;
            newCharacterCard.querySelector('.char-block > .value').innerHTML = char.block;

            $(newCharacterCard.querySelector('.edit.btn')).on('click', () => {

            });

            $(newCharacterCard.querySelector('.edit.btn')).on('click', () => {
                
            });

        };

    };

    $(function() {
        app.containers.btnPanel = document.querySelector('.gizmos-panel');

        app.components.spinner = document.querySelector('.spinner-container');
        app.components.btnClose = document.querySelector('.close-btn');
        app.components.btnTemplate = document.querySelector('.btn.template');
        app.components.switchTemplate = document.querySelector('.switch-btn.template');
        app.components.gizmoTemplate = document.querySelector('.gizmo.template');
        app.components.separatorTemplate = document.querySelector('.separator.template');

        Object.keys(app.gizmoPatterns).forEach(key => {
            app.fabricateButton(app.containers.btnPanel, app.gizmoPatterns[key].title, 'gizmo', app.gizmoPatterns[key].class, `${app.gizmoPatterns[key].class}-btn`);
        });


        {
            let container = document.querySelector(app.gizmoPatterns.treasureGen.btnPanel);

            app.fabricateButton(container, 'Сгенерировать сокровища', '', '', 'gen-treasure');
            app.fabricateButton(container, 'Показать настройки', '', '', 'gen-open-tweak');
        };
        {
            let container = document.querySelector(app.gizmoPatterns.treasureGen.knobPanel);
            app.fabricateSwitch(container, 'Sword & Wizardry множитель [1d3+1]:', 'sw-base-multiplier', true, 'Итоговое значение энкаунтера умножается на случайное число от 2-ух до 4-ех. В базовой версии S&W имеется опция ОГРОМНОГО сокровища, в этом генераторе ее нет.');
            app.fabricateSwitch(container, '5000gp обмен:', 'sw-5000-tradeout', true, 'Обмен производиться по правилам Swords & Wizardry Complete Rules');
            app.fabricateSwitch(container, '1000gp обмен:', 'sw-1000-tradeout', true, 'Обмен производиться по правилам Swords & Wizardry Complete Rules');
            app.fabricateSwitch(container, '100gp обмен:', 'sw-100-tradeout', true, 'Обмен производиться по правилам Swords & Wizardry Complete Rules');
            app.fabricateSwitch(container, '*Антикварный обмен:', 'sw-antique-tradeout', false, 'Заменяет часть золота на антикварные продукты, которую правдоподобно могу быть обнаружены в руинах и проданы экспедициям и т.п.');
            app.fabricateSwitch(container, '*Ремесленный обмен:', 'sw-artisan-goods-tradeout', false, 'Заменяет часть золота на ремесляную продукцию, которую правдоподобно могли носить с собой разумные существа.');
            app.fabricateSwitch(container, '*Охотничье-промысловый обмен:', 'sw-bio-goods-tradeout', false, 'Заменяет все оставшиеся после обменов золотые монеты на продукты промысловой охоты, которые могут быть проданы. Их точное описание остается на усмотрение рассказчика.');
        };

        {
            let container = document.querySelector(app.gizmoPatterns.politicGen.btnPanel);
            app.fabricateButton(container, 'Добавить Агента', '', '', 'politic-gen-add-new');
        };

        {
            let container = document.querySelector(app.gizmoPatterns.econMarketSim.btnPanel);
            app.fabricateButton(container, 'Следующий раунд', '', '', 'econ-sim-next-round');
            app.fabricateButton(container, 'Симулировать 100 раундов', '', '', 'econ-sim-100-rounds');
            app.fabricateButton(container, 'Показать историю действий игрока', '', '', 'econ-sim-toggle-player-log');
        };

        {
            let container = document.querySelector(app.gizmoPatterns.wodCombatHouserule.btnPanel);
            app.fabricateButton(container, 'Посчитать инициативу', '', '', 'combat-calc-init');
            app.fabricateButton(container, 'Посчитать атаку', '', '', 'combat-calc-attack');
            app.fabricateButton(container, 'Отделить раунд', '', '', 'combat-add-separator');
            app.fabricateButton(container, 'Показать настройки', '', '', 'combat-open-tweak');
        };
        {
            let container = document.querySelector(app.gizmoPatterns.wodCombatHouserule.knobPanel);
            app.fabricateSwitch(container, 'Специализация в атаке', 'combat-atk-spec', true, '10-ки на броске атаки считаются за два успеха');
            app.fabricateSwitch(container, 'Специализация в защите', 'combat-dodge-spec', true, '10-ки на броске защиты считаются за два успеха');
            app.fabricateSwitch(container, 'Специализация в блоке', 'combat-block-spec', true, '10-ки на броске блока считаются за два успеха');
            app.fabricateSwitch(container, '1-цы отнимают успехи', 'combat-botch', true, '1-цы на бросках вычитают один успех из броска');
        };
        
        app.fabricatePoliticalAgent();
        app.drawPoliticCanvas();

        app.fabricateNewEconAgent('bank');
        app.fabricateNewEconAgent('player');
        for (let i of [...Array(100).keys()]) {
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
            $('.landing-page-content').removeClass('blurred');
            $(`.landing-page-content`).removeClass('hidden');
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
            ($('.treasure-knob-panel').hasClass('active') ? $('.treasure-knob-panel').removeClass('active') : $('.treasure-knob-panel').addClass('active'));
            ($('.treasure-knob-panel').hasClass('active') ? $('.gen-open-tweak.btn').html('Скрыть настройки') : $('.gen-open-tweak.btn').html('Показать настройки'));
        });

        $('.politic-gen-add-new.btn').on('click', () => {
            app.fabricatePoliticalAgent();
        });

        $('.econ-sim-next-round.btn').on('click', () => {
            app.econNextTurn();
        });

        $('.econ-sim-100-rounds.btn').on('click', () => {
            let promise = new Promise(resolve => {
                let loopClick = i => {
                    setTimeout(() => {
                        $('.econ-sim-next-round.btn')[0].click();
                        i++;
                        (i > 99 ? resolve() : loopClick(i));
                    }, 300);
                };
                loopClick(0);
            });
            promise.then(() => console.log('Done clicking!'));
        });

        $('.econ-sim-toggle-player-log.btn').on('click', () => {
            ($('.econ-sim-player-log').hasClass('active') ? $('.econ-sim-player-log').removeClass('active') : $('.econ-sim-player-log').addClass('active'));
            ($('.econ-sim-player-log').hasClass('active') ? $('.econ-sim-toggle-player-log.btn').html('Скрыть историю действий игрока') : $('.econ-sim-toggle-player-log.btn').html('Показать историю действий игрока'));
        });

        $('.combat-calc-init.btn').on('click', () => {
            app.calculateInitiative();
        });

        $('.add-new-character.btn').on('click', () => {
            $('.popup').addClass('active');
            $('.form').hide();
            $('.add-new-character-form').show();
            $('.gizmo').addClass('blurred');
        });

        $('.close-add-new-form.close-popup-btn').on('click', () => {
            $('.popup').removeClass('active');
            $('.form').hide();
            $('.gizmo').removeClass('blurred');
        });

        $('.combat-calc-attack.btn').on('click', () => {
            app.calculateAttack();
        });

        $('.combat-add-separator.btn').on('click', () => {
            app.addSeparator(document.querySelector('.combat-results'));
        });

        $('.combat-open-tweak.btn').on('click', () => {
            ($('.combat-knob-panel').hasClass('active') ? $('.combat-knob-panel').removeClass('active') : $('.combat-knob-panel').addClass('active'));
            ($('.combat-knob-panel').hasClass('active') ? $('.combat-open-tweak.btn').html('Скрыть настройки') : $('.combat-open-tweak.btn').html('Показать настройки'));
        });

        $('#combat-defender-action').on('change', (event) => {
            event.currentTarget.value = $("option:selected", event.currentTarget).val();
            if (event.currentTarget.value =='none') $('#combat-defender-pool-input').prop("disabled", true)
            else $('#combat-defender-pool-input').prop("disabled", false);
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