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
            }
        },
        btnPatterns: {
            treasureGen: {
                title: 'Генератор Фэнтези Сокровищ',
                type: 'gizmo',
                destination: 'treasureGen',
                tabindex: 2
            },
            nuAvalon: {
                title: '[WIP] Экономика Ню-Авалона',
                type: 'link',
                destination: './nu-avalon',
                tabindex: 3
            }
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
        }

    }

    app.fabricateButton = (btnPattern) => {
        let newBtn = app.components.btnTemplate.cloneNode(true);

        newBtn.classList.add('generated');
        newBtn.classList.remove ('template');

        newBtn.innerHTML = btnPattern.title;
        newBtn.tabIndex = btnPattern.tabindex;

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

    $(function() {
        app.containers.btnPanel = document.querySelector('.gizmos-panel');
        app.containers.treasureKnobsPanel = document.querySelector('.gen-tweaking-panel');

        app.components.spinner = document.querySelector('.spinner-container');
        app.components.btnClose = document.querySelector('.close-btn');
        app.components.btnTemplate = document.querySelector('.btn.template');
        app.components.switchTemplate = document.querySelector('.switch-btn.template');
        app.components.gizmoTemplate = document.querySelector('.gizmo.template');

        /*Object.keys(app.gizmoPatterns).forEach(key => {
            app.fabricateGizmo(app.gizmoPatterns[key]);
        });*/

        app.fabricateButton(app.btnPatterns.treasureGen);
        app.fabricateButton(app.btnPatterns.nuAvalon);
        app.fabricateSwitch(app.containers.treasureKnobsPanel, 'Sword & Wizardry множитель [1d3+1]:', 'sw-base-multiplier', true, 'Итоговое значение энкаунтера умножается на случайное число от 2-ух до 4-ех. В базовой версии S&W имеется опция ОГРОМНОГО сокровища, в этом генераторе ее нет.');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, '5000gp обмен:', 'sw-5000-tradeout', true, 'Обмен производиться по правилам Swords & Wizardry Complete Rules');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, '1000gp обмен:', 'sw-1000-tradeout', true, 'Обмен производиться по правилам Swords & Wizardry Complete Rules');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, '100gp обмен:', 'sw-100-tradeout', true, 'Обмен производиться по правилам Swords & Wizardry Complete Rules');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, '*Антикварный обмен:', 'sw-antique-tradeout', false, 'Заменяет часть золота на антикварные продукты, которую правдоподобно могу быть обнаружены в руинах и проданы экспедициям и т.п.');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, '*Ремесленный обмен:', 'sw-artisan-goods-tradeout', false, 'Заменяет часть золота на ремесляную продукцию, которую правдоподобно могли носить с собой разумные существа.');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, '*Охотничье-промысловый обмен:', 'sw-bio-goods-tradeout', false, 'Заменяет все оставшиеся после обменов золотые монеты на продукты промысловой охоты, которые могут быть проданы. Их точное описание остается на усмотрение рассказчика.');

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
    })

})();