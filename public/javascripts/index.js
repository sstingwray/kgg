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
            nuAvalon: {
                title: '[WIP] Экономика Ню-Авалона',
                type: 'link',
                destination: './nu-avalon'
            },
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
                wallet: 1000,
                upkeepRules: [
                    {
                        good: 'food',
                        quantity: 10
                    },
                    {
                        good: 'goods',
                        quantity: 10
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
                        upperLimit: 10,
                        lowerLimit: 1
                    },
                    fuel: {
                        upperLimit: 10,
                        lowerLimit: 1
                    },
                    food: {
                        upperLimit: 10,
                        lowerLimit: 1
                    },
                    alloys: {
                        upperLimit: 10,
                        lowerLimit: 1
                    },
                    goods: {
                        upperLimit: 10,
                        lowerLimit: 1
                    },
                }
            },
            market: {
                currentAgents: [],
                currentAsks: [],
                currentLots: [],
                currentDeals: [],
                goodHistoricalMeans: {
                    manpower: null,
                    fuel: null,
                    food: null,
                    alloys: null,
                    goods: null,
                },
                topAgentType: 'manpower',
            },
            goods: {
                manpower: {
                    name: 'Рабочие',
                    baseCost: 0,
                    productionRules: [
                        {
                            name: 'training',
                            components: [
                                {
                                    key: 'food',
                                    quantity: 1
                                },
                                {
                                    key: 'goods',
                                    quantity: 1
                                },
                            ],
                            output: 2
                        }
                    ]
                },
                fuel: {
                    name: 'Топливо',
                    baseCost: 0,
                    productionRules: [
                        {
                            name: 'refining',
                            components: [
                                {
                                    key: 'manpower',
                                    quantity: 1
                                }
                            ],
                            output: 1
                        }
                    ]
                },
                food: {
                    name: 'Пища',
                    baseCost: 0,
                    productionRules: [
                        {
                            name: 'farming',
                            components: [
                                {
                                    key: 'manpower',
                                    quantity: 1
                                },
                                {
                                    key: 'fuel',
                                    quantity: 1
                                }
                            ],
                            output: 2
                        }
                    ]
                },
                alloys: {
                    name: 'Сплавы',
                    baseCost: 0,
                    productionRules: [
                        {
                            name: 'smelting',
                            components: [
                                {
                                    key: 'manpower',
                                    quantity: 1
                                },
                                {
                                    key: 'fuel',
                                    quantity: 1
                                }
                            ],
                            output: 2
                        }
                    ]
                },
                goods: {
                    name: 'Товары',
                    baseCost: 0,
                    productionRules: [
                        {
                            name: 'manufacturing',
                            components: [
                                {
                                    key: 'manpower',
                                    quantity: 1
                                },
                                {
                                    key: 'alloys',
                                    quantity: 1
                                },
                                {
                                    key: 'fuel',
                                    quantity: 1
                                }
                            ],
                            output: 4
                        }
                    ]
                },
            },
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

        Object.keys(newAgent.inventory).forEach(key => {
            newAgent.inventory[key] = round(Math.random()*10*10 + 100, 0);
        });

        app.marketEconSimModule.market.currentAgents.push(newAgent);
    };

    app.createAgentListings = () => {
        let gatherListings = new Promise ((resolve) => {
            for (let agent of app.marketEconSimModule.market.currentAgents) {
                for (let key of Object.keys(agent.inventory)) {
                    let upkeepAmount = agent.upkeepRules.filter(x => x.good == key).reduce((a, b) => a + b.quantity, 0);
                    let transactionType = (agent.inventory[key] > upkeepAmount*3 ? 'lot' : 'ask');
                    let transactionAmount = agent.inventory[key] - upkeepAmount*3;
                    console.log(agent.name + ' wants to ' + transactionType + ' ' + transactionAmount + ' of ' + key);

                    switch (transactionType) {
                        case 'lot':
                            {
                                let mean = app.marketEconSimModule.market.goodHistoricalMeans[key];
                                let upperPriceLimit = agent.priceBeliefs[key].upperLimit;
                                let lowerPriceLimit = agent.priceBeliefs[key].lowerPrice;
                                let favorability = (mean > upperPriceLimit ? 1 : (mean < lowerPriceLimit ? 0.2 : Math.max(0.2, findNumberPosition(mean, lowerPriceLimit, upperPriceLimit))));
                                let amount = round(favorability*transactionAmount, 0);

                                if (amount > 0) {
                                    console.log('Due to favorability of ' + round(favorability, 2) + ', the amount will instead be ' + amount);
                                    app.marketEconSimModule.market.currentLots.push({
                                        buyerName: agent.name,
                                        good: key,
                                        quantity: Math.abs(amount),
                                        price: upperPriceLimit,
                                    });
                                };
                            };
                            break;
                        case 'ask':
                            {
                                let mean = app.marketEconSimModule.market.goodHistoricalMeans[key];
                                let upperPriceLimit = agent.priceBeliefs[key].upperLimit;
                                let lowerPriceLimit = agent.priceBeliefs[key].lowerPrice;
                                let favorability = (mean > upperPriceLimit ? 0.2 : (mean < lowerPriceLimit ? 1 : Math.max(0.2, 1 - findNumberPosition(mean, lowerPriceLimit, upperPriceLimit))));
                                let amount = round(favorability*transactionAmount, 0);

                                if (amount > 0) {
                                    console.log('Due to favorability of ' + round(favorability, 2) + ', the amount will instead be ' + amount);
                                    app.marketEconSimModule.market.currentAsks.push({
                                        sellerName: agent.name,
                                        good: key,
                                        quantity: Math.abs(Math.min(amount, agent.wallet/upperPriceLimit)),
                                        price: lowerPriceLimit,
                                    });
                                };
                            };
                            break;
                    };
                };
            };
            resolve();
        });
        gatherListings.then(() => {
            for (let goodKey of Object.keys(app.marketEconSimModule.goods)) {
                let shuffledLots = shuffle(app.marketEconSimModule.market.currentLots.filter(x => x.good == goodKey));
                let shuffledAsks = shuffle(app.marketEconSimModule.market.currentAsks.filter(x => x.good == goodKey));
                let sortedLots = shuffledLots.sort((a, b) => (a.price > b.price) ? 1 : -1);
                let sortedAsks = shuffledAsks.sort((a, b) => (a.price < b.price) ? 1 : -1);
                let supply = sortedLots.reduce((a, b) => a + b.price*b.quantity, 0);
                let demand = sortedAsks.reduce((a, b) => a + b.price*b.quantity, 0);
                let historicalMean = app.marketEconSimModule.market.goodHistoricalMeans[goodKey];
                let currentTurnMeanPriceForGood = [];

                console.log('Lots for ' + goodKey);
                console.log(sortedLots);
                console.log('Asks for ' + goodKey);
                console.log(sortedAsks);

                console.log(goodKey + ' supply is ' + supply);
                console.log(goodKey + ' demand is ' + demand);

                let matchDeals = i => {
                    let buyer = sortedAsks[0];
                    let seller = sortedLots[0];

                    let quantity = Math.min(buyer.quantity, seller.quantity);
                    let clearingPrice = (buyer.price + seller.price)/2;

                    let buyerAgent = app.marketEconSimModule.currentAgents.filter(x => x.name == buyer.buyerName)[0];
                    let buyerAgentPriceBeliefs = buyerAgent.priceBeliefs[goodKey];
                    let buyerMarketShare = sortedLots.filter(x => x.name == buyer.buyerName).reduce((a, b) => a + b.price*b.quantity, 0);
                    let buyerDisplacement = (Math.abs((buyerAgentPriceBeliefs.upperLimit + buyerAgentPriceBeliefs.lowerLimit)/2 - clearingPrice))/((buyerAgentPriceBeliefs.upperLimit + buyerAgentPriceBeliefs.lowerLimit)/2);
                    
                    let sellerAgent = app.marketEconSimModule.currentAgents.filter(x => x.name == seller.sellerName)[0];
                    let sellerAgentPriceBeliefs = sellerAgent.priceBeliefs[goodKey];
                    let sellerMarketShare = sortedLots.filter(x => x.name == seller.sellerName).reduce((a, b) => a + b.price*b.quantity, 0);
                    let sellerWeight = seller.quantity/(seller.quantity + quantity);
                    let sellerDisplacment = sellerWeight*(sellerAgentPriceBeliefs.upperLimit + sellerAgentPriceBeliefs.lowerLimit)/2;
                    
                }
            }

        });
    };

    app.simulateEconTurn = () => {
        app.createAgentListings();
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
        console.log(app.marketEconSimModule.market.currentAgents);
        
        $(app.components.spinner).hide();
        $(app.components.btnClose).hide();
        $(app.components.btnClose).removeClass('active');
        $('.gizmo').hide();
        $('.gizmo').removeClass('active');
        $('.nu-avalon.btn').hide();        

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
            app.simulateEconTurn();
        });
    });

    function round(value, decimals = 0) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
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