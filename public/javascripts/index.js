(function() {
    'use strict';

    let app = {
        gizmoPatterns: {
            calculatorTreasureSW: {
                title:'Fantasy Treasure Generator (Sword & Wizardry -based)',
                btnCaller: 'treasureGen',
                class: 'treasure-gen'
            }
        },
        btnPatterns: {
            treasureGen: {
                title: 'Fantasy Treasure Generator',
                type: 'gizmo',
                destination: 'calculatorTreasureSW',
                tabindex: 2
            },
            nuAvalon: {
                title: 'Nu-Avalon Dashboard',
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
                    $(app.components.btnClose).show();
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

    app.fabricateSwitch = (container, labelText, checkboxClass) => {
        let newSwitch = app.components.switchTemplate.cloneNode(true);
        
        newSwitch.classList.add('generated');
        newSwitch.classList.remove ('template');
        newSwitch.querySelector('.label').innerHTML = labelText;
        newSwitch.querySelector('.switch').classList.add(checkboxClass);

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
        let isGoodsTradeout = gizmo.querySelector('.sw-goods-tradeout > input').checked;

        let basePool = gizmo.querySelector('.input-value').value;
        let timestamp = new Date();

        let newResultLine = resultTemplate.cloneNode(true);

        newResultLine.classList.add('generated');
        newResultLine.classList.remove ('template');

        let fnPrependNewItem = (description, gpValue, weight = null) => {
            let newResultItem = resultItemTemplate.cloneNode(true);
            newResultItem.classList.add('generated');
            newResultItem.classList.remove ('template');
            newResultItem.querySelector('.item-description > .label').innerHTML = description;
            newResultItem.querySelector('.item-description > .value').innerHTML = gpValue;
            newResultItem.querySelector('.item-weight > .label').innerHTML = (weight != null ? 'Weigths, lbs' : '');
            newResultItem.querySelector('.item-weight > .value').innerHTML = weight;

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
                let resultsMajorMagicItemTypes = resultsTypes.filter(x => x === 20).map(x => x = Math.round(Math.random()*3) + 1);
                let resultsMajorMagicItemTypeOne = resultsMajorMagicItemTypes.filter(x => x === 1).map(x => x = Math.round(Math.random()*99) + 1 + ', ' + Math.round(Math.random()*99) + 1 + ', ' + Math.round(Math.random()*99) + 1 + ', ' + Math.round(Math.random()*99) + 1 + ', ' + Math.round(Math.random()*99) + 1 + ', ' + Math.round(Math.random()*99) + 1 + ', ' + Math.round(Math.random()*99) + 1);
                let resultsMajorMagicItemTypeTwo = resultsMajorMagicItemTypes.filter(x => x === 2).map(x => x = Math.round(Math.random()*5) + 1 + 12);
                let resultsMajorMagicItemTypeThree = resultsMajorMagicItemTypes.filter(x => x === 3).map(x => x = Math.round(Math.random()*5) + 1 + 12);
                let resultsMajorMagicItemTypeFour = resultsMajorMagicItemTypes.filter(x => x === 4).map(x => x = Math.round(Math.random()*19) + 1 + 40);

                console.log('Total gold pool for [' + timestamp.toLocaleTimeString() + ']: ' + gold);

                if (resultsInit > 0) {
                    gold -= resultsInit*5000;
                    console.log('5000 Trade-Out #: ' + resultsInit);
                    console.log('Gold after 5000 Trade Out: ' + gold);

                    if (resultsMajorMagicItemTypeOne.length > 0) {
                        fnPrependNewItem('Potions (Table 85): ', resultsMajorMagicItemTypeOne.join(', '));
                    };
                    if (resultsMajorMagicItemTypeTwo.length > 0) {
                        fnPrependNewItem('Scrolls (Table 86): ', resultsMajorMagicItemTypeTwo.join(', '));
                    };
                    if (resultsMajorMagicItemTypeThree.length > 0) {
                        fnPrependNewItem('Magic Armor & Weapons (Table 89): ', resultsMajorMagicItemTypeThree.join(', '));
                    };
                    if (resultsMajorMagicItemTypeFour.length > 0) {
                        fnPrependNewItem('Magic Armor & Weapons (Table 98): ', resultsMinorMagicItemTypeFour.join(', '));
                    };
                    if (resultsMajorGemsTypes.length > 0) {
                        fnPrependNewItem('Major Gems & Jewelry, gp: ', resultsMajorGemsTypeOne.concat(resultsMajorGemsTypeTwo).concat(resultsMajorGemsTypeThree).concat(resultsMajorGemsTypeFour).join(', '));
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
                let resultsMediumMagicItemTypes = resultsTypes.filter(x => x === 20).map(x => x = Math.round(Math.random()*3) + 1);
                let resultsMediumMagicItemTypeOne = resultsMediumMagicItemTypes.filter(x => x === 1).map(x => x = Math.round(Math.random()*99) + 1 + ', ' + Math.round(Math.random()*99) + 1 + ', ' + Math.round(Math.random()*99) + 1);
                let resultsMediumMagicItemTypeTwo = resultsMediumMagicItemTypes.filter(x => x === 2).map(x => x = Math.round(Math.random()*5) + 1 + 6);
                let resultsMediumMagicItemTypeThree = resultsMediumMagicItemTypes.filter(x => x === 3).map(x => x = Math.round(Math.random()*5) + 1 + 6);
                let resultsMediumMagicItemTypeFour = resultsMediumMagicItemTypes.filter(x => x === 4).map(x => x = Math.round(Math.random()*19) + 1 + 20);

                if (resultsInit > 0) {
                    gold -= resultsInit*1000;
                    console.log('1000 Trade-Out #: ' + resultsInit);
                    console.log('Gold after 1000 Trade Out: ' + gold);

                    if (resultsMediumMagicItemTypeOne.length > 0) {
                        fnPrependNewItem('Potions (Table 85): ', resultsMediumMagicItemTypeOne.join(', '));
                    };
                    if (resultsMediumMagicItemTypeTwo.length > 0) {
                        fnPrependNewItem('Scrolls (Table 86): ', resultsMediumMagicItemTypeTwo.join(', '));
                    };
                    if (resultsMediumMagicItemTypeThree.length > 0) {
                        fnPrependNewItem('Magic Armor & Weapons (Table 89): ', resultsMediumMagicItemTypeThree.join(', '));
                    };
                    if (resultsMediumMagicItemTypeFour.length > 0) {
                        fnPrependNewItem('Magic Armor & Weapons (Table 98): ', resultsMinorMagicItemTypeFour.join(', '));
                    };
                    if (resultsMediumGemsTypes.length > 0) {
                        fnPrependNewItem('Medium Gems & Jewelry, gp: ', resultsMediumGemsTypeOne.concat(resultsMediumGemsTypeTwo).concat(resultsMediumGemsTypeThree).concat(resultsMediumGemsTypeFour).join(', '));
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
                let resultsMinorMagicItemTypes = resultsTypes.filter(x => x === 20).map(x => x = Math.round(Math.random()*3) + 1);
                let resultsMinorMagicItemTypeOne = resultsMinorMagicItemTypes.filter(x => x === 1).map(x => x = Math.round(Math.random()*99) + 1);
                let resultsMinorMagicItemTypeTwo = resultsMinorMagicItemTypes.filter(x => x === 2).map(x => x = Math.round(Math.random()*5) + 1);
                let resultsMinorMagicItemTypeThree = resultsMinorMagicItemTypes.filter(x => x === 3).map(x => x = Math.round(Math.random()*5) + 1);
                let resultsMinorMagicItemTypeFour = resultsMinorMagicItemTypes.filter(x => x === 4).map(x => x = Math.round(Math.random()*19) + 1);

                if (resultsInit > 0) {
                    gold -= resultsInit*100;
                    console.log('100 Trade-Out #: ' + resultsInit);
                    console.log('Gold after 100 Trade Out: ' + gold);

                    if (resultsMinorMagicItemTypeOne.length > 0) {
                        fnPrependNewItem('Potions (Table 85): ', resultsMinorMagicItemTypeOne.join(', '));
                    };
                    if (resultsMinorMagicItemTypeTwo.length > 0) {
                        fnPrependNewItem('Scrolls (Table 86): ', resultsMinorMagicItemTypeTwo.join(', '));
                    };
                    if (resultsMinorMagicItemTypeThree.length > 0) {
                        fnPrependNewItem('Magic Armor & Weapons (Table 89): ', resultsMinorMagicItemTypeThree.join(', '));
                    };
                    if (resultsMinorMagicItemTypeFour.length > 0) {
                        fnPrependNewItem('Magic Armor & Weapons (Table 98): ', resultsMinorMagicItemTypeFour.join(', '));
                    };
                    if (resultsMinorGemsTypes.length > 0) {
                        fnPrependNewItem('Minor Gems & Jewelry, gp: ', resultsMinorGemsTypeOne.concat(resultsMinorGemsTypeTwo).concat(resultsMinorGemsTypeThree).concat(resultsMinorGemsTypeFour).join(', '));
                    };
                };
            };

            return gold
        }).then((gold) => {
            if (isAntiqueTradeout) {
                let tradeoutAmount = Math.round(gold*Math.random());
                let tradeoutNumber = Math.round(Math.random()*3) + 1;
                let tradeoutsAntique = Math.floor(tradeoutAmount/tradeoutNumber);
                let resultsTypes = [...Array(tradeoutNumber).keys()].map(x => x = Math.round(Math.random()*19) + 1);
                let resultsAntiqueTypeOne = resultsTypes.filter(x => x <= 10).map(x => x = Math.round((Math.random() + 0.5)*tradeoutsAntique*1));
                let resultsAntiqueTypeOneWeights = resultsTypes.filter(x => x <= 10).map(x => x = Math.round(Math.random()*9) + 1);
                let resultsAntiqueTypeTwo = resultsTypes.filter(x => x > 10 && x <= 15).map(x => x = Math.round((Math.random() + 0.75)*tradeoutsAntique*1));
                let resultsAntiqueTypeTwoWeights = resultsTypes.filter(x => x > 10 && x <= 15).map(x => x = Math.round(Math.random()*19) + 1);
                let resultsAntiqueTypeThree = resultsTypes.filter(x => x > 15 && x <= 18).map(x => x = Math.round((Math.random() + 1)*tradeoutsAntique*1));
                let resultsAntiqueTypeThreeWeights = resultsTypes.filter(x => x > 15 && x <= 18).map(x => x = Math.round(Math.random()*6) + 1);
                let resultsAntiqueTypeFour = resultsTypes.filter(x => x > 18).map(x => x = Math.round((Math.random() + 2)*tradeoutsAntique*1));
                let resultsAntiqueTypeFourWeights = resultsTypes.filter(x => x > 18).map(x => x = Math.round(Math.random()*6) + 1);

                if (tradeoutAmount > 50) {
                    gold -= tradeoutAmount;
                    console.log('Antique Trade-Out #: ' + tradeoutNumber);
                    console.log('Gold after antique Trade Out: ' + (gold));
        
                    if (resultsAntiqueTypeOne.length > 0) {
                        fnPrependNewItem('Common Items, gp: ', resultsAntiqueTypeOne.join(', '), resultsAntiqueTypeOneWeights.join(', '));
                    };
                    if (resultsAntiqueTypeTwo.length > 0) {
                        fnPrependNewItem('Depictions, gp: ', resultsAntiqueTypeTwo.join(', '), resultsAntiqueTypeTwoWeights.join(', '));
                    };
                    if (resultsAntiqueTypeThree.length > 0) {
                        fnPrependNewItem('Writings, gp: ', resultsAntiqueTypeThree.join(', '), resultsAntiqueTypeThreeWeights.join(', '));
                    };
                    if (resultsAntiqueTypeFour.length > 0) {
                        fnPrependNewItem('Artifacts, gp: ', resultsAntiqueTypeFour.join(', '), resultsAntiqueTypeFourWeights.join(', '));
                    };
                };
            };

            return gold
        }).then((gold) => {
            if (isGoodsTradeout) {
                let tradeoutNumber = Math.round(Math.random()*5) + 1;
                let tradeoutsGoods = Math.floor(gold/tradeoutNumber);
                let resultsTypes = [...Array(tradeoutNumber).keys()].map(x => x = Math.round(Math.random()*19) + 1);
                let resultsGoodsTypeOne = resultsTypes.filter(x => x <= 5).map(x => x = Math.round((Math.random() + 0.5)*tradeoutsGoods*1));
                let resultsGoodsTypeOneWeights = resultsTypes.filter(x => x <= 5).map(x => x = Math.round(Math.random()*19) + 1);
                let resultsGoodsTypeTwo = resultsTypes.filter(x => x > 5 && x <= 10).map(x => x = Math.round((Math.random() + 1)*tradeoutsGoods*1));
                let resultsGoodsTypeTwoWeights = resultsTypes.filter(x => x > 5 && x <= 10).map(x => x = Math.round(Math.random()*19) + 1);
                let resultsGoodsTypeThree = resultsTypes.filter(x => x > 10 && x <= 15).map(x => x = Math.round((Math.random() + 1)*tradeoutsGoods*1));
                let resultsGoodsTypeThreeWeights = resultsTypes.filter(x => x > 10 && x <= 15).map(x => x = Math.round(Math.random()*19) + 1);
                let resultsGoodsTypeFour = resultsTypes.filter(x => x > 15).map(x => x = Math.round((Math.random() + 1.5)*tradeoutsGoods*1));
                let resultsGoodsTypeFourWeights = resultsTypes.filter(x => x > 15).map(x => x = Math.round(Math.random()*19) + 1);

                gold = 0;
                console.log('Goods Trade-Out #: ' + tradeoutNumber);
    
                if (resultsGoodsTypeOne.length > 0) {
                    fnPrependNewItem('Meats, gp: ', resultsGoodsTypeOne.join(', '), resultsGoodsTypeOneWeights.join(', '));
                };
                if (resultsGoodsTypeTwo.length > 0) {
                    fnPrependNewItem('Bones, gp: ', resultsGoodsTypeTwo.join(', '), resultsGoodsTypeTwoWeights.join(', '));
                };
                if (resultsGoodsTypeThree.length > 0) {
                    fnPrependNewItem('Skins, gp: ', resultsGoodsTypeThree.join(', '), resultsGoodsTypeThreeWeights.join(', '));
                };
                if (resultsGoodsTypeFour.length > 0) {
                    fnPrependNewItem('Exotic Parts, gp: ', resultsGoodsTypeFour.join(', '), resultsGoodsTypeFourWeights.join(', '));
                };
            };

            return gold
        }).then((gold) => {
            (gold > 0 ? fnPrependNewItem('Gold coins: ' + gold) : '');
        });

        calculation.then(() => {
            fnPrependNewItem('[' + timestamp.toLocaleTimeString() + ']', '');
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
        app.fabricateSwitch(app.containers.treasureKnobsPanel, 'Sword & Wizardry [1d3+1] Multiplier:', 'sw-base-multiplier');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, '5000gp Trade Out:', 'sw-5000-tradeout');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, '1000gp Trade Out:', 'sw-1000-tradeout');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, '100gp Trade Out:', 'sw-100-tradeout');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, 'Antique Trade Out:', 'sw-antique-tradeout');
        app.fabricateSwitch(app.containers.treasureKnobsPanel, 'Goods Trade Out:', 'sw-goods-tradeout');

        $(app.components.spinner).hide();
        $(app.components.btnClose).hide();
        $('.gizmo').hide();
        $('.nu-avalon.btn').hide();        

        $('.logo').on('click', () => {
            console.log('Redirecting to index...');
            window.location.href="/";
        });

        $(app.components.btnClose).on('click', () => {
            $('.gizmo').hide();
            $('.main-content-block').removeClass('blurred');
            $('body').removeClass('locked');
            $(app.components.btnClose).hide();
        });

        $('.gen-treasure.btn').on('click', () => {
            app.treasureTradeouts();
        });

        $('.gen-open-tweak.btn').on('click', () => {
            ($('.gen-tweaking-panel').hasClass('active') ? $('.gen-tweaking-panel').removeClass('active') : $('.gen-tweaking-panel').addClass('active'));
            ($('.gen-tweaking-panel').hasClass('active') ? $('.gen-open-tweak.btn').html('Hide additional settings') : $('.gen-open-tweak.btn').html('Show additional settings'));
        });
    })

})();