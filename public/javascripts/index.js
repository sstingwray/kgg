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
                destination: '/nu-avalon'
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
        let resultTemplate = document.querySelector('.sw-gen-line.template');
        let resultContainer = document.querySelector('.sw-gen-results');

        let encounterXP = document.querySelector('.sw-input-value').value;
        let totalGold = (Math.floor(Math.random()*3) + 1)*encounterXP;

        //$('.sw-gen-line.generated').remove();

        let newResultLine = resultTemplate.cloneNode(true);
        newResultLine.classList.add('generated', 'top-brd-dash');
        newResultLine.classList.remove ('template');
        newResultLine.innerHTML = '[' + new Date().toLocaleTimeString() + ']' + 'Total gold: ' + totalGold;

        resultContainer.appendChild(newResultLine);

        let calculation = new Promise ((resolve) => {
            let tradeouts5000 = Math.floor(totalGold/5000);
            let resultsInit = [...Array(tradeouts5000).keys()].map(x => x = Math.floor(Math.random()*9 + 1)).filter(x => x === 1).length;
            let resultsTypes = [...Array(resultsInit).keys()].map(x => x = Math.floor(Math.random()*19 + 1));
            let resultsMajorMagicItems = resultsTypes.filter(x => x === 20);
            let resultsMajorGems = resultsTypes.filter(x => x < 20).map(x => x = Math.floor);

            if (resultsInit > 0) {
                let newResultLine = resultTemplate.cloneNode(true);
                newResultLine.classList.add('generated');
                newResultLine.classList.remove ('template');
                newResultLine.innerHTML = '5000 Trade-Out #: ' + resultsInit;

                resultContainer.appendChild(newResultLine);

                if (resultsMajorMagicItems.length > 0) {
                    newResultLine = resultTemplate.cloneNode(true);
                    newResultLine.classList.add('generated');
                    newResultLine.classList.remove ('template');
                    newResultLine.innerHTML = 'Major Magic Items: ' + resultsMajorMagicItems;
    
                    resultContainer.appendChild(newResultLine);
                };
                
                newResultLine = resultTemplate.cloneNode(true);
                newResultLine.classList.add('generated');
                newResultLine.classList.remove ('template');
                newResultLine.innerHTML = 'Major Gems & Jewelry: ' + resultsMajorGems;

                resultContainer.appendChild(newResultLine);
            };

            resolve();
        }).then(() => {
            let tradeouts1000 = Math.floor(totalGold/1000);
            let resultsInit = [...Array(tradeouts1000).keys()].map(x => x = Math.floor(Math.random()*9 + 1)).filter(x => x === 1).length;
            let resultsTypes = [...Array(resultsInit).keys()].map(x => x = Math.floor(Math.random()*19 + 1));
            let resultsMediumMagicItems = resultsTypes.filter(x => x === 20);
            let resultsMediumGems = resultsTypes.filter(x => x < 20);

            if (resultsInit > 0) {
                let newResultLine = resultTemplate.cloneNode(true);
                newResultLine.classList.add('generated');
                newResultLine.classList.remove ('template');
                newResultLine.innerHTML = '1000 Trade-Out #: ' + resultsInit;

                resultContainer.appendChild(newResultLine);
                
                if (resultsMediumMagicItems.length > 0) {
                    newResultLine = resultTemplate.cloneNode(true);
                    newResultLine.classList.add('generated');
                    newResultLine.classList.remove ('template');
                    newResultLine.innerHTML = 'Medium Magic Items: ' + resultsMediumMagicItems;
    
                    resultContainer.appendChild(newResultLine);
                };
            
                newResultLine = resultTemplate.cloneNode(true);
                newResultLine.classList.add('generated');
                newResultLine.classList.remove ('template');
                newResultLine.innerHTML = 'Medium Gems & Jewelry: ' + resultsMediumGems;

                resultContainer.appendChild(newResultLine);
            }
            
        }).then(() => {
            let tradeouts100 = Math.floor(totalGold/100);
            let resultsInit = [...Array(tradeouts100).keys()].map(x => x = Math.floor(Math.random()*9 + 1)).filter(x => x === 1).length;
            let resultsTypes = [...Array(resultsInit).keys()].map(x => x = Math.floor(Math.random()*19 + 1));
            let resultsMinorMagicItems = resultsTypes.filter(x => x === 20);
            let resultsMinorGemsTypes = resultsTypes.filter(x => x < 20).map(x => x = Math.floor(Math.random()*3 + 1));
            let resultsMinorGemsTypeOne = resultsMinorGemsTypes.filter(x => x === 1).map(x => x = Math.floor(Math.random()*5 + 1));
            let resultsMinorGemsTypeTwo = resultsMinorGemsTypes.filter(x => x === 2).map(x => x = Math.floor(Math.random()*99 + 1 + 25));
            let resultsMinorGemsTypeThree = resultsMinorGemsTypes.filter(x => x === 2).map(x => x = Math.floor(Math.random()*99 + 1 + 75));
            let resultsMinorGemsTypeFour = resultsMinorGemsTypes.filter(x => x === 2).map(x => x = Math.floor(Math.random()*99 + 1)*10);

            if (resultsInit > 0) {
                let newResultLine = resultTemplate.cloneNode(true);
                newResultLine.classList.add('generated');
                newResultLine.classList.remove ('template');
                newResultLine.innerHTML = '100 Trade-Out #: ' + resultsInit;

                resultContainer.appendChild(newResultLine);

                if (resultsMinorMagicItems.length > 0) {
                    newResultLine = resultTemplate.cloneNode(true);
                    newResultLine.classList.add('generated');
                    newResultLine.classList.remove ('template');
                    newResultLine.innerHTML = 'Minor Magic Items: ' + resultsMinorMagicItems;
    
                    resultContainer.appendChild(newResultLine);
                };

                newResultLine = resultTemplate.cloneNode(true);
                newResultLine.classList.add('generated');
                newResultLine.classList.remove ('template');
                newResultLine.innerHTML = 'Minor Gems & Jewelry: ' + resultsMinorGemsTypeOne.concat(resultsMinorGemsTypeTwo).concat(resultsMinorGemsTypeThree).concat(resultsMinorGemsTypeFour).join(', ');

                resultContainer.appendChild(newResultLine);
            };
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