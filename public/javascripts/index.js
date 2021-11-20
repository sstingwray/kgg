(function() {
    'use strict';

    let app = {
        gizmoPatterns: {
            calculatorTreasureSW: {
                title:'Sword & Wizardry Treasure',
                btnCaller: 'swtreasure',
                class: 'sw-treasure'
            }
        },
        btnPatterns: {
            swtreasure: {
                title: 'Sword & Wizardry Treasure',
                type: 'gizmo',
                destination: 'calculatorTreasureSW'
            },
            nuAvalon: {
                title: 'Nu-Avalon Dashboard',
                type: 'link',
                destination: './nu-avalon'
            }
        },
        components: {
            spinner: {},
            btnClose: {},
            btnTemplate: {},
            gizmoTemplate: {}
        },
        containers: {
            btnPanel: {},

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
                    $(app.components.btnClose).show();
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

    }

    app.fabricateGizmo = (gizmoPattern) => {
        let newGizmo = app.components.gizmoTemplate.cloneNode(true);

        newGizmo.classList.add('generated ' && gizmoPattern.class);
        newGizmo.classList.remove ('template');

        newGizmo.querySelector('.title').innerHTML = gizmoPattern.title;
        app.fabricateButton(app.btnPatterns[gizmoPattern.btnCaller]);
        $(newGizmo).hide();
        document.body.appendChild(newGizmo);
    }

    app.swTreasureTradeouts = () => {
        let resultTemplate = document.querySelector('.sw-gen-container.template');
        let resultItemTemplate = document.querySelector('.sw-gen-item.template');
        let resultContainer = document.querySelector('.sw-gen-results');

        let encounterXP = document.querySelector('.sw-input-value').value;
        let totalGold = (Math.floor(Math.random()*3) + 1)*encounterXP;
        let timestamp = new Date();

        let newResultLine = resultTemplate.cloneNode(true);

        newResultLine.classList.add('generated');
        newResultLine.classList.remove ('template');

        let fnPrependNewItem = (text, weight = null) => {
            let newResultItem = resultItemTemplate.cloneNode(true);
            newResultItem.classList.add('generated');
            newResultItem.classList.remove ('template');
            newResultItem.querySelector('.item-description').innerHTML = text;
            newResultItem.querySelector('.item-weight').innerHTML = weight;

            newResultLine.prepend(newResultItem);
        };

        //$('.sw-gen-container.generated').remove();

        let calculation = new Promise ((resolve) => {
            let tradeouts5000 = Math.floor(totalGold/5000);
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

            console.log('Total gold pool for [' + timestamp.toLocaleTimeString() + ']: ' + totalGold);

            if (resultsInit > 0) {
                totalGold -= resultsInit*5000;
                console.log('5000 Trade-Out #: ' + resultsInit);
                console.log('Gold after 5000 Trade Out: ' + totalGold);

                if (resultsMajorMagicItemTypeOne.length > 0) {
                    fnPrependNewItem('Potions (Table 85): ' + resultsMajorMagicItemTypeOne.join(', '));
                };
                if (resultsMajorMagicItemTypeTwo.length > 0) {
                    fnPrependNewItem('Scrolls (Table 86): ' + resultsMajorMagicItemTypeTwo.join(', '));
                };
                if (resultsMajorMagicItemTypeThree.length > 0) {
                    fnPrependNewItem('Magic Armor & Weapons (Table 89): ' + resultsMajorMagicItemTypeThree.join(', '));
                };
                if (resultsMajorMagicItemTypeFour.length > 0) {
                    fnPrependNewItem('Magic Armor & Weapons (Table 98): ' + resultsMinorMagicItemTypeFour.join(', '));
                };
                if (resultsMajorGemsTypes.length > 0) {
                    fnPrependNewItem('Major Gems & Jewelry: ' + resultsMajorGemsTypeOne.concat(resultsMajorGemsTypeTwo).concat(resultsMajorGemsTypeThree).concat(resultsMajorGemsTypeFour).join(', '));
                };
                
            };
            resolve();
        }).then(() => {
            let tradeouts1000 = Math.floor(totalGold/1000);
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
                totalGold -= resultsInit*1000;
                console.log('1000 Trade-Out #: ' + resultsInit);
                console.log('Gold after 1000 Trade Out: ' + totalGold);

                if (resultsMediumMagicItemTypeOne.length > 0) {
                    fnPrependNewItem('Potions (Table 85): ' + resultsMediumMagicItemTypeOne.join(', '));
                };
                if (resultsMediumMagicItemTypeTwo.length > 0) {
                    fnPrependNewItem('Scrolls (Table 86): ' + resultsMediumMagicItemTypeTwo.join(', '));
                };
                if (resultsMediumMagicItemTypeThree.length > 0) {
                    fnPrependNewItem('Magic Armor & Weapons (Table 89): ' + resultsMediumMagicItemTypeThree.join(', '));
                };
                if (resultsMediumMagicItemTypeFour.length > 0) {
                    fnPrependNewItem('Magic Armor & Weapons (Table 98): ' + resultsMinorMagicItemTypeFour.join(', '));
                };
                if (resultsMediumGemsTypes.length > 0) {
                    fnPrependNewItem('Medium Gems & Jewelry: ' + resultsMediumGemsTypeOne.concat(resultsMediumGemsTypeTwo).concat(resultsMediumGemsTypeThree).concat(resultsMediumGemsTypeFour).join(', '));
                };
            };
        }).then(() => {
            let tradeouts100 = Math.floor(totalGold/100);
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
                totalGold -= resultsInit*100;
                console.log('100 Trade-Out #: ' + resultsInit);
                console.log('Gold after 100 Trade Out: ' + totalGold);

                if (resultsMinorMagicItemTypeOne.length > 0) {
                    fnPrependNewItem('Potions (Table 85): ' + resultsMinorMagicItemTypeOne.join(', '));
                };
                if (resultsMinorMagicItemTypeTwo.length > 0) {
                    fnPrependNewItem('Scrolls (Table 86): ' + resultsMinorMagicItemTypeTwo.join(', '));
                };
                if (resultsMinorMagicItemTypeThree.length > 0) {
                    fnPrependNewItem('Magic Armor & Weapons (Table 89): ' + resultsMinorMagicItemTypeThree.join(', '));
                };
                if (resultsMinorMagicItemTypeFour.length > 0) {
                    fnPrependNewItem('Magic Armor & Weapons (Table 98): ' + resultsMinorMagicItemTypeFour.join(', '));
                };
                if (resultsMinorGemsTypes.length > 0) {
                    fnPrependNewItem('Minor Gems & Jewelry: ' + resultsMinorGemsTypeOne.concat(resultsMinorGemsTypeTwo).concat(resultsMinorGemsTypeThree).concat(resultsMinorGemsTypeFour).join(', '));
                };
            };
        }).then(() => {
            let tradeoutAmount = Math.round(totalGold*Math.random());
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

            totalGold -= tradeoutAmount;
            console.log('Antique Trade-Out #: ' + tradeoutNumber);
            console.log('Gold after antique Trade Out: ' + (totalGold));

            if (resultsAntiqueTypeOne.length > 0) {
                fnPrependNewItem('Common Items: ' + resultsAntiqueTypeOne.join(', '), 'Weights, lbs: ' + resultsAntiqueTypeOneWeights.join(', '));
            };
            if (resultsAntiqueTypeTwo.length > 0) {
                fnPrependNewItem('Depictions: ' + resultsAntiqueTypeTwo.join(', '), 'Weights, lbs: ' + resultsAntiqueTypeTwoWeights.join(', '));
            };
            if (resultsAntiqueTypeThree.length > 0) {
                fnPrependNewItem('Writings: ' + resultsAntiqueTypeThree.join(', '), 'Weights, lbs: ' + resultsAntiqueTypeThreeWeights.join(', '));
            };
            if (resultsAntiqueTypeFour.length > 0) {
                fnPrependNewItem('Artifacts: ' + resultsAntiqueTypeFour.join(', '), 'Weights, lbs: ' + resultsAntiqueTypeFourWeights.join(', '));
            };
            fnPrependNewItem('Gold coins: ' + totalGold);
        });

        calculation.then(() => {
            fnPrependNewItem('[' + timestamp.toLocaleTimeString() + ']');
            resultContainer.prepend(newResultLine);
        });        
    };

    $(function() {
        app.containers.btnPanel = document.querySelector('.btn-panel');

        app.components.spinner = document.querySelector('.spinner-container');
        app.components.btnClose = document.querySelector('.close-btn');
        app.components.btnTemplate = document.querySelector('.btn.template');
        app.components.gizmoTemplate = document.querySelector('.gizmo.template');

        /*Object.keys(app.gizmoPatterns).forEach(key => {
            app.fabricateGizmo(app.gizmoPatterns[key]);
        });*/
        app.fabricateButton(app.btnPatterns.swtreasure);
        app.fabricateButton(app.btnPatterns.nuAvalon);

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
            $(app.components.btnClose).hide();
        });

        $('.sw-gen-treasure.btn').on('click', () => {
            app.swTreasureTradeouts();
        });
        
        
    })

})();