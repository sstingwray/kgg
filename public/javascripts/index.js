(function() {
    'use strict';

    let app = {
        parameters: {
            animationDelay: 300
        },
        data: {
            tileTypes: [
                {
                    name: `Town`,
                    style: `town`,
                },
                {
                    name: `Plain`,
                    style: `plain`,
                },
                {
                    name: `Field`,
                    style: `field`,
                },
                {
                    name: `Mountain`,
                    style: `mountain`,
                },
                {
                    name: `Lake`,
                    style: `lake`,
                },
                {
                    name: `Forest`,
                    style: `forest`,
                },
            ],
            opponentNames: [
                `Johnson`,
                `Hill`,
                `Thompson`,
                `White`,
                `Ward`,
                `Cooley`,
                `Joseph`,
                `Foley`,
                `Horton`,
                `Morgan`,
            ],
            opponentTypes: [
                {
                    name: `Ruler`,
                    description: `Dignified and regal, this vampire loves to play by the book and leverage his reputation. Crush him with brute force before he turns the entire city against you.`,
                    wounds: [
                        {
                            level: 1,
                            req: [
                                {
                                    resource: `thugs`,
                                    baseAmount: 2
                                }
                            ]
                        },
                        {
                            level: 2,
                            req: [
                                {
                                    resource: `thugs`,
                                    baseAmount: 3
                                }
                            ]
                        },
                        {
                            level: 3,
                            req: [
                                {
                                    resource: `thugs`,
                                    baseAmount: 4
                                }
                            ],
                        }
                    ],
                    exhaustResource: `connections`,
                },
                {
                    name: `Fiend`,
                    description: `Fearsome and brutal, this vampire's ambition is war. Uncover his secrets and stick a stake in-between them before he can raise an entire army.`,
                    wounds: [
                        {
                            level: 1,
                            req: [
                                {
                                    resource: `secrets`,
                                    baseAmount: 2
                                }
                            ]
                        },
                        {
                            level: 2,
                            req: [
                                {
                                    resource: `secrets`,
                                    baseAmount: 3
                                }
                            ]
                        },
                        {
                            level: 3,
                            req: [
                                {
                                    resource: `secrets`,
                                    baseAmount: 4
                                }
                            ],
                        }
                    ],
                    exhaustResource: `thugs`,
                },
                {
                    name: `Merchant`,
                    description: `Cunning and resourceful, this vampire knows how to grease the wheels of humanity (and profit from it). Use the humans against them in an ironic twist of fate or become another business casualty.`,
                    wounds: [
                        {
                            level: 1,
                            req: [
                                {
                                    resource: `connections`,
                                    baseAmount: 2
                                }
                            ]
                        },
                        {
                            level: 2,
                            req: [
                                {
                                    resource: `connections`,
                                    baseAmount: 3
                                }
                            ]
                        },
                        {
                            level: 3,
                            req: [
                                {
                                    resource: `connections`,
                                    baseAmount: 4
                                }
                            ],
                        }
                    ],
                    exhaustResource: `money`,
                },
                {
                    name: `Witch`,
                    description: `Dark whispers and unknowable misteries are the domain of this vampire. Teach them a lesson in humility, make the shadows devour them least the same fate awaits you.`,
                    wounds: [
                        {
                            level: 1,
                            req: [
                                {
                                    resource: `supernatural`,
                                    baseAmount: 2
                                }
                            ]
                        },
                        {
                            level: 2,
                            req: [
                                {
                                    resource: `supernatural`,
                                    baseAmount: 3
                                }
                            ]
                        },
                        {
                            level: 3,
                            req: [
                                {
                                    resource: `supernatural`,
                                    baseAmount: 4
                                }
                            ],
                        }
                    ],
                    exhaustResource: `secrets`,
                },
                {
                    name: `Beast`,
                    description: `Untamed and fierce, this vampire is an apex predator. Make them remember what happens with wild beasts when they clash with civilization or become yet another prey in their path.`,
                    wounds: [
                        {
                            level: 1,
                            req: [
                                {
                                    resource: `money`,
                                    baseAmount: 2
                                }
                            ]
                        },
                        {
                            level: 2,
                            req: [
                                {
                                    resource: `money`,
                                    baseAmount: 3
                                }
                            ]
                        },
                        {
                            level: 3,
                            req: [
                                {
                                    resource: `money`,
                                    baseAmount: 4
                                }
                            ],
                        }
                    ],
                    exhaustResource: `supernatural`,
                }
            ],
            resourceTypes: [
                {
                    id: `secrets`,
                    name: `Secrets`,
                    icon: `<i class="fa-solid fa-magnifying-glass icon"></i>`,
                    description: ``
                },
                {
                    id: `thugs`,
                    name: `Thugs`,
                    icon: `<i class="fa-solid fa-user-secret icon"></i>`,
                    description: ``
                },
                {
                    id: `money`,
                    name: `Money`,
                    icon: `<i class="fa-solid fa-money-bill-wave icon"></i>`,
                    description: ``
                },
                {
                    id: `connections`,
                    name: `Connections`,
                    icon: `<i class="fa-solid fa-handshake icon"></i>`,
                    description: ``
                },
                {
                    id: `supernatural`,
                    name: `Supernatural`,
                    icon: `<i class="fa-solid fa-hand-sparkles icon"></i>`,
                    description: ``
                }
                
            ]
        },
        config: {
            opponentCount: 3,
            mapWidth: 10,
            mapHeight: 10,
        },
        components: {
            spinner: {},
            btnTemplate: {},
            switchTemplate: {},
            separatorTemplate: {},
            notificationTemplate: {},
            resourceSilo: {},
            tile: {},
            opponentCard: {},
        },
        containers: {
            pageContent: {},
            tileContainer: {},
            notificationPanel: {},
            opponentContainer: {},
            resourceContainer: {},
        },
        gameState: {
            tiles: [],
            player: {},
            opponents: [],
        };
    };

    class Player {
        constructor(name) {
            this.name = name
        }
        
        printName() {
            console.log(this.name);
        }
    };

    class Opponent {
        constructor(name) {
            this.name = name
        }

        printName() {
            console.log(this.name);
        }
    };

    class Map {
        constructor(name) {
            this.name = name
        }
        
        printName() {
            console.log(this.name);
        }
    };

    app.fabricateButton = (btnClass, labelText, type, toDoFunction, container, hintText = '') => {
        let newBtn = app.components.btnTemplate.cloneNode(true);

        newBtn.classList.add('generated');
        newBtn.classList.add(...btnClass);
        newBtn.classList.remove ('template');

        newBtn.innerHTML = labelText;
        newBtn.title = hintText;

        switch (type) {
            case 'link':
                $(newBtn).on('click', () => {
                    window.open(btnPattern.target, '_blank');
                });
                break;
            case 'function':
                $(newBtn).on('click', () => {
                    toDoFunction();
                });
                break;
            default:

                break;
        }
        container.appendChild(newBtn);
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
    };

    app.generatePlayer = () => {

    };

    app.generateOpponent = () => {

    };

    app.generateMap = () => {

    };

    app.fabricateResourceSilo = (resource) => {
        let newResourceSilo = app.components.resourceSilo.cloneNode(true);

        newResourceSilo.classList.add('generated', resource.id);
        newResourceSilo.classList.remove ('template');
        
        newResourceSilo.querySelector('.icon-slot').innerHTML = resource.icon;
        newResourceSilo.querySelector('.resource-value').innerHTML = 0;
        newResourceSilo.title = resource.name;

        app.containers.resourceContainer.appendChild(newResourceSilo);
    }

    app.fabricateTile = (i = 1) => {
        let newTile = app.components.tile.cloneNode(true);
        let rand = round(Math.random()*(app.data.tileTypes.length - 1), 0);
        let typeClass = app.data.tileTypes[rand].style;
        let tileRow = Math.trunc(i / app.config.mapWidth);
        
        newTile.classList.add('generated', typeClass);
        newTile.classList.remove ('template');
        newTile.style.transform = `translate(${(tileRow % 2 === 0 ? '88' : '0')}px, -${(51 * tileRow)}px)`;

        app.containers.tileContainer.appendChild(newTile);
    };

    app.fabricateOpponent = (i = 1, power = 1) => {
        let newOpponent = app.components.opponentCard.cloneNode(true);
        let randType = round(Math.random()*(app.data.opponentTypes.length - 1), 0);
        let randName = round(Math.random()*(app.data.opponentNames.length - 1), 0);
        let type = app.data.opponentTypes[randType];
        let name = app.data.opponentNames[randName];

        newOpponent.classList.add('generated');
        newOpponent.classList.remove ('template');
        newOpponent.querySelector('.name').innerHTML = name;
        newOpponent.querySelector('.power > .value').innerHTML = power;
        newOpponent.querySelector('.description').innerHTML = `${type.name} — ${type.description}`;
        newOpponent.dataset.wounds = 0;

        for (let w = 0; w < 3; w++) {
            let resource = app.data.resourceTypes.filter(x => x.id == type.wounds[w].req[0].resource)[0];
            let reqValue = type.wounds[w].req[0].baseAmount;
            app.fabricateButton(
                [`opponent-${i}`, `wound-${w}`, `compact`, (w <= newOpponent.dataset.wounds ? `color-red` : `disabled`)],
                `<span class="resource-value">${reqValue}</span>${resource.icon}`,
                `function`,
                () => {
                    if (!document.querySelector(`.opponent-${i}.wound-${w}`).classList.contains(`disabled`) && document.querySelector(`.opponent-${i}.wound-${w}`).classList.contains(`color-green`)) {
                        document.querySelector(`.opponent-${i}.wound-${w}`).classList.add('disabled');
                        document.querySelector(`.opponent-${i}.wound-${w}`).classList.remove('color-green');
                        newOpponent.dataset.wounds = 1;
                        app.editResourceSilo(resource.id, 'substract', document.querySelector(`.opponent-${i}.wound-${w} > .resource-value`).innerHTML);
                        document.querySelector(`.opponent-${i}.wound-${w}`).innerHTML = `<i class="icon fa-solid fa-x"></i>`;
                        if (w < 2) {
                            document.querySelector(`.opponent-${i}.wound-${w + 1}`).classList.remove('disabled');
                            document.querySelector(`.opponent-${i}.wound-${w + 1}`).classList.add('color-red');
                        };
                        app.refreshWoundButtons();
                    }
                },
                newOpponent.querySelector('.wounds'),
                `${reqValue} ${resource.name}`
            );
        };

        app.containers.opponentContainer.appendChild(newOpponent);

    };

    app.addSeparator = (container) => {
        let newSeparator = app.components.separatorTemplate.cloneNode(true);

        newSeparator.classList.add('generated');
        newSeparator.classList.remove ('template');

        container.prepend(newSeparator);
    };

    app.showNotificationToast = (text, type = '') => {
        let newNotification = app.components.notificationTemplate.cloneNode(true);

        newNotification.classList.add('generated');
        newNotification.classList.remove ('template');

        switch (type) {
            case 'positive':
                newNotification.classList.add('positive');
                break;
            case 'negative':
                newNotification.classList.add('negative');
                break;
            default:
                break;
        };

        newNotification.querySelector('.notification-text').innerHTML = text;

        $(newNotification).on('click', () => {
            newNotification.classList.add('fading');
            setTimeout(() => {
                newNotification.remove();
                if (!app.containers.notificationPanel.firstChild) $(app.containers.notificationPanel).hide();
            }, app.parameters.animationDelay);
        });

        setTimeout(() => {
            newNotification.classList.add('fading');
            setTimeout(() => {
                newNotification.remove();
                if (!app.containers.notificationPanel.firstChild) $(app.containers.notificationPanel).hide();
            }, app.parameters.animationDelay);
        }, 10*app.parameters.animationDelay);

        $(app.containers.notificationPanel).show();

        app.containers.notificationPanel.prepend(newNotification);
    };

    // UI =========================================================

    app.refreshWoundButtons = () => {
        let woundButtons = document.querySelectorAll('.btn.generated[class*=wound]:not(.disabled)');

        for (let i = 0; i < woundButtons.length; i++) {
            let reqResource = app.data.resourceTypes.filter(x => x.icon == woundButtons[i].childNodes[1].outerHTML)[0];
            let reqValue = parseInt(woundButtons[i].querySelector('.resource-value').innerHTML);
            let siloValue = parseInt(document.querySelector(`.resource-silo.${reqResource.id} > .resource-value`).innerHTML);

            if (reqValue <= siloValue) {
                woundButtons[i].classList.remove('color-red');
                woundButtons[i].classList.add('color-green');
            };
        };
    };

    // Mechanics ==================================================

    app.editResourceSilo = (id, operation, amount) => {
        let silo = document.querySelector(`.resource-silo.${id}`);

        switch (operation) {
            case `add`:
                silo.querySelector('.resource-value').innerHTML += amount;
                break;
            case `substract`:
                silo.querySelector('.resource-value').innerHTML -= amount;
                break;
            case `set`:
                silo.querySelector('.resource-value').innerHTML = amount;
                break;
        };

        app.refreshWoundButtons();
    };

    app.generateStartParams = (resources, tiles) => {
        for (let i = 0; i < resources.length; i++) {
            app.editResourceSilo(resources[i].id, `set`, resources[i].value);
        };
        for (let i = 0; tiles.length; i++) {
            
        };
    };

    app.eliminateOpponent = () => {

    };


    // Init =======================================================

    $(function() {
        app.containers.pageContent = document.querySelector('.page-content');
        app.containers.tileContainer = document.querySelector('.tile-container');
        app.containers.notificationPanel = document.querySelector('.notification-panel');
        app.containers.opponentContainer = document.querySelector('.opponent-container');
        app.containers.resourceContainer = document.querySelector('.resource-container');

        app.components.spinner = document.querySelector('.spinner-container');
        app.components.btnTemplate = document.querySelector('.btn.template');
        app.components.switchTemplate = document.querySelector('.switch-btn.template');
        app.components.separatorTemplate = document.querySelector('.separator.template');
        app.components.notificationTemplate = document.querySelector('.notification.template');
        app.components.resourceSilo = document.querySelector('.resource-silo.template');
        app.components.tile = document.querySelector('.tile.template');
        app.components.opponentCard = document.querySelector('.opponent-card.template');
        
        app.containers.tileContainer.style.width = `calc(176px*${app.config.mapWidth} + 176px / 2)`;
        app.containers.tileContainer.style.height = `calc(204px*${app.config.mapHeight} - 204px - 204px/4)`;

        for (let i = 0; i < app.data.resourceTypes.length; i++) {app.fabricateResourceSilo(app.data.resourceTypes[i])};
        
        for (let i = 0; i < app.config.mapWidth*app.config.mapHeight; i++) {app.fabricateTile(i)};

        for (let i = 0; i < app.config.opponentCount; i++) {app.fabricateOpponent(i, 1)};

        app.generateStartParams(app.data.resourceTypes.map(x => ({id: x.id, value: 12})), []);

        delay(500).then(() => {$(app.components.spinner).hide()});

        $('.logo').on('click', () => {
            window.location.href="/";
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

    function colorFromCSSClass(className) {
        var tmp = document.createElement("div"), color;
        tmp.style.cssText = "position:fixed;left:-100px;top:-100px;width:1px;height:1px";
        tmp.className = className;
        document.body.appendChild(tmp);  // required in some browsers
        color = getComputedStyle(tmp).getPropertyValue("color");
        document.body.removeChild(tmp);
        return color
    }

      function delay(t) {
        return new Promise(resolve => setTimeout(resolve, t))
    }

})();