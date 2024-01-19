(function() {
    'use strict';

    let app = {
        parameters: {
            animationDelay: 300,
            logging: true,
            extendedLogging: true,
        },
        data: {
            tileTypes: [
                {
                    id: 0,
                    name: `Town`,
                    style: `town`,
                },
                {
                    id: 1,
                    name: `Plain`,
                    style: `plain`,
                },
                {
                    id: 2,
                    name: `Field`,
                    style: `field`,
                },
                {
                    id: 3,
                    name: `Mountain`,
                    style: `mountain`,
                },
                {
                    id: 4,
                    name: `Lake`,
                    style: `lake`,
                },
                {
                    id: 5,
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
                    id: 0,
                    name: `Ruler`,
                    description: `Dignified and regal, this vampire loves to play by the book and leverage his reputation. Crush him with brute force before he turns the entire city against you.`,
                    wounds: [
                        {
                            id: 0,
                            req: [{ resourceID: 2, baseAmount: 3 }]
                        },
                        {
                            id: 1,
                            req: [{ resourceID: 2, baseAmount: 4 }]
                        },
                        {
                            id: 2,
                            req: [{ resourceID: 2, baseAmount: 5 }]
                        }
                    ],
                    exhaustResourceID: 3,
                },
                {
                    id: 1,
                    name: `Fiend`,
                    description: `Fearsome and brutal, this vampire's ambition is war. Uncover his secrets and stick a stake in-between them before he can raise an entire army.`,
                    wounds: [
                        {
                            id: 0,
                            req: [{ resourceID: 1, baseAmount: 5 }]
                        },
                        {
                            id: 1,
                            req: [{ resourceID: 1, baseAmount: 5 }]
                        },
                        {
                            id: 2,
                            req: [{ resourceID: 1, baseAmount: 5 }]
                        }
                    ],
                    exhaustResourceID: 2,
                },
                {
                    id: 2,
                    name: `Merchant`,
                    description: `Cunning and resourceful, this vampire knows how to grease the wheels of humanity (and profit from it). Use the humans against them in an ironic twist of fate or become another business casualty.`,
                    wounds: [
                        {
                            id: 0,
                            req: [{ resourceID: 3, baseAmount: 5 }]
                        },
                        {
                            id: 1,
                            req: [{ resourceID: 3, baseAmount: 5 }]
                        },
                        {
                            id: 2,
                            req: [{ resourceID: 3, baseAmount: 5 }]
                        }
                    ],
                    exhaustResourceID: 0,
                },
                {
                    id: 3,
                    name: `Witch`,
                    description: `Dark whispers and unknowable misteries are the domain of this vampire. Teach them a lesson in humility, make the shadows devour them least the same fate awaits you.`,
                    wounds: [
                        {
                            id: 0,
                            req: [{ resourceID: 4, baseAmount: 5 }]
                        },
                        {
                            id: 1,
                            req: [{ resourceID: 4, baseAmount: 5 }]
                        },
                        {
                            id: 2,
                            req: [{ resourceID: 4, baseAmount: 5 }]
                        }
                    ],
                    exhaustResourceID: 1,
                },
                {
                    id: 4,
                    name: `Beast`,
                    description: `Untamed and fierce, this vampire is an apex predator. Make them remember what happens with wild beasts when they clash with civilization or become yet another prey in their path.`,
                    wounds: [
                        {
                            id: 0,
                            req: [{ resourceID: 0, baseAmount: 5 }]
                        },
                        {
                            id: 1,
                            req: [{ resourceID: 0, baseAmount: 5 }]
                        },
                        {
                            id: 2,
                            req: [{ resourceID: 0, baseAmount: 5 }]
                        }
                    ],
                    exhaustResourceID: 4,
                }
            ],
            resourceTypes: [
                {
                    id: 0,
                    name: `Money`,
                    icon: `<i class="fa-solid fa-money-bill-wave icon"></i>`,
                    description: ``
                },
                {
                    id: 1,
                    name: `Secrets`,
                    icon: `<i class="fa-solid fa-magnifying-glass icon"></i>`,
                    description: ``
                },
                {
                    id: 2,
                    name: `Thugs`,
                    icon: `<i class="fa-solid fa-user-secret icon"></i>`,
                    description: ``
                },
                {
                    id: 3,
                    name: `Connections`,
                    icon: `<i class="fa-solid fa-handshake icon"></i>`,
                    description: ``
                },
                {
                    id: 4,
                    name: `Supernatural`,
                    icon: `<i class="fa-solid fa-hand-sparkles icon"></i>`,
                    description: ``
                }
                
            ],
            playerBackgrounds: [
                {
                    id: 0,
                    name: `The Forgotten`,
                    description: `They might've forgotten you, but you still remember them. It is you who holds the keys. Remind them why they decided to conspire against you, return the fear back into their minds and shriveled hearts. It is time to play with your food.`,
                    bonusID: 1,
                },
                {
                    id: 1,
                    name: `The Pious`,
                    description: `Ever since your disappearance the parish has been broken, in pieces. The faithful deserve better and yearn for salvation only you can bring. By thy grace they shall receive it… and so much more.`,
                    bonusID: 3,
                },
                {
                    id: 2,
                    name: `The Anarchist`,
                    description: `It's been a while since the last shake up of the status quo and you're here to rectify this mistake. Blood shall be spilled, fires shall rise, chains shall be broken. Show the mortals and the undead what true freedom means, and this time make this lesson stick for good.`,
                    bonusID: 2,
                },
                {
                    id: 3,
                    name: `The Scholar`,
                    description: `You've seen the signs long before the knives appeared from the darkness. You knew your trip into the darkness would not be the end. You embraced the opportunity, and now you've returned with gifts that were never meant for this world.`,
                    bonusID: 4,
                },
                {
                    id: 4,
                    name: `The Director`,
                    description: `In their hubris they ignored your pawns and servants. They've mistaken for panic the intricate web of contingencies you've set up in case something happened to you. Now when the stage is set for your return, it's time to bring the inevitable finale.`,
                    bonusID: 0,
                },
                
            ],
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
            map: {},
            player: {},
            opponents: [],
        }
    };

    class Player {

        constructor(background) {
            this.background = background;
            this.resources = [];
        };

        touchSilo(resourceID, operation, value = 0) {
            try {
                let silo = this.resources.filter(x => x.id == resourceID)[0];
                let oldValue = `${silo.value}`;

                switch (operation) {
                    case `add`:
                        silo.value += value;

                        (app.parameters.logging ? console.log(`Silo for ${app.data.resourceTypes.filter(x => x.id == silo.id)[0].name} is increased by ${value}, from ${oldValue} to ${silo.value}`) : null);
                        (app.parameters.extendedLogging ? console.log(this.resources.filter(x => x.id == resourceID)[0]) : null);
                        break;
                    case `substract`:
                        silo.value -= value;

                        (app.parameters.logging ? console.log(`Silo for ${app.data.resourceTypes.filter(x => x.id == silo.id)[0].name} is decreased by ${value}, from ${oldValue} to ${silo.value}`) : null);
                        (app.parameters.extendedLogging ? console.log(this.resources.filter(x => x.id == resourceID)[0]) : null);
                        break;
                    case `set`:
                        silo.value -= value;

                        (app.parameters.logging ? console.log(`Silo for ${app.data.resourceTypes.filter(x => x.id == silo.id)[0].name} is set from ${oldValue} to ${silo.value}`) : null);
                        (app.parameters.extendedLogging ? console.log(this.resources.filter(x => x.id == resourceID)[0]) : null);
                        break;
                }
            } catch (error) {
                (app.parameters.extendedLogging ? console.log(error) : null);
                if (!this.resources.filter(x => x.id == resourceID)[0]) {
                    (app.parameters.logging ? console.log(`Silo for ${app.data.resourceTypes.filter(x => x.id == resourceID)[0].name} does not exist, setting up...`) : null);
                    this.resources.push({id: resourceID, value: value});

                    (app.parameters.logging ? console.log(`Silo for ${app.data.resourceTypes.filter(x => x.id == resourceID)[0].name} is set`) : null);
                    (app.parameters.extendedLogging ? console.log(this.resources.filter(x => x.id == resourceID)[0]) : null);
                } else {
                    (app.parameters.logging ? console.log(`Error touching silo for ${app.data.resourceTypes.filter(x => x.id == resourceID)[0].name} with operation "${operation}" and value of ${value}!`) : null);
                };
            };
        };

        getBackground() {
            return this.background;
        }

    };

    class Opponent {

        constructor(id, startingTileID, suggestedTypeID = null) {
            this.id = id;
            this.startingTileID = startingTileID;
            this.suggestedTypeID = suggestedTypeID;
            this.pickName();
            this.pickType();
            this.wounds = [];
            
            for (let i = 0; i < 3; i++) {
                this.touchWounds(i, `set`);
                this.touchWounds(i, `set`);
            };
        };

        pickName() {
            let randName = round(Math.random()*(app.data.opponentNames.length - 1), 0);
            let name = app.data.opponentNames[randName];

            this.name = name;
            (app.parameters.logging ? console.log(`Opponent ${this.getID()} will be called "${this.getName()}"`) : null);
        };

        pickType() {
            let typeID;

            if (this.suggestedTypeID == null) {
                typeID = round(Math.random()*(app.data.opponentTypes.length - 1), 0);
            } else {
                try {
                    let type = app.data.opponentTypes.filter(x => x.id == this.suggestedTypeID)[0];
                    typeID = type.id;
                } catch {
                    typeID = 0;
                    (app.parameters.logging ? console.log(`Suggested type ID of ${this.suggestedTypeID} for ${this.getName()}, ${this.getID()} was not correct, defaulting to 0.`) : null);
                };
            }

            this.typeID = typeID;
            (app.parameters.logging ? console.log(`${this.getName()}, ${this.getID()} will be of type "${this.getType().name}"`) : null);
        };

        touchWounds(woundID, operation) {
            try {
                let wound = this.wounds.filter(x => x.id == woundID)[0];

                switch (operation) {
                    case `get`:
                        return wound;
                        break;
                    case `set`:
                        wound.isDealt = false;

                        (app.parameters.logging ? console.log(`Wound ${woundID} for ${this.getName()}, ${this.getID()} is set as not dealt`) : null);
                        (app.parameters.extendedLogging ? console.log(wound) : null);
                        break;
                    case `dealt`:
                        wound.isDealt = true;

                        (app.parameters.logging ? console.log(`Wound ${woundID} for ${this.getName()}, ${this.getID()} is set as dealt`) : null);
                        (app.parameters.extendedLogging ? console.log(wound) : null);
                        break;
                }
            } catch (error) {
                (app.parameters.extendedLogging ? console.log(error) : null);
                if (!this.wounds.filter(x => x.id == woundID)[0]) {
                    (app.parameters.logging ? console.log(`Wound ${woundID} for ${this.getName()}, ${this.getID()} does not exist, setting up...`) : null);
                    this.wounds.push(app.data.opponentTypes.filter(x => x.id == this.getType().id)[0].wounds.filter(x => x.id == woundID)[0]);

                    (app.parameters.logging ? console.log(`Wound ${woundID} for ${this.getName()}, ${this.getID()} is set`) : null);
                    (app.parameters.extendedLogging ? console.log(this.wounds) : null);
                } else {
                    (app.parameters.logging ? console.log(`Error touching wound ${woundID} for ${this.getName()}, ${this.getID()} with operation "${operation}"!`) : null);
                };
            };
        };

        getID() {
            return this.id;
        };

        getName() {
            return this.name;
        };
        
        getType() {
            return app.data.opponentTypes.filter(x => x.id == this.typeID)[0];
        };
    };

    class Map {
        constructor(id, startingTileID) {
            this.id = id;
            this.startingTileID = startingTileID;
        };
        
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

        newResourceSilo.classList.add('generated', `resource-${resource.id}`);
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
            let resource = app.data.resourceTypes.filter(x => x.id == type.wounds[w].req[0].resourceID)[0];
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
            let siloValue = parseInt(document.querySelector(`.resource-silo.resource-${reqResource.id} > .resource-value`).innerHTML);

            if (reqValue <= siloValue) {
                woundButtons[i].classList.remove('color-red');
                woundButtons[i].classList.add('color-green');
            };
        };
    };

    // Mechanics ==================================================

    app.editResourceSilo = (id, operation, amount) => {
        let silo = document.querySelector(`.resource-silo.resource-${id}`);

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

        //setting up the player

        (app.parameters.logging ? console.log('Setting up the player...') : null);
        let randomBackground = round(Math.random()*(app.data.playerBackgrounds.length - 1), 0);
        let background = app.data.playerBackgrounds[randomBackground];
        app.gameState.player = new Player(background);

        (app.parameters.logging ? console.log(`Background is ${app.gameState.player.getBackground().name} - ${app.gameState.player.getBackground().description}`) : null);
        
        for (let i = 0; i < app.data.resourceTypes.length; i++) {
            // Setting up a silo for a given resource, adding background bonus is applicable
            let resource = app.data.resourceTypes[i];
            let hasBackgroundBonus = app.gameState.player.getBackground().bonusID == resource.id;

            app.gameState.player.touchSilo(resource.id, 'setup');
            if (hasBackgroundBonus) {
                (app.parameters.logging ? console.log(`Setting up background bonus for ${resource.name}...`) : null);
                app.gameState.player.touchSilo(resource.id, 'add', 2);
            };
        }; 

        //setting up the opponents
        (app.parameters.logging ? console.log(`Setting up ${app.config.opponentCount} opponent[s]...`) : null);
        let opponentTypeListShuffled = shuffle(app.data.opponentTypes.map(x => x.id));
        //creating a list of type IDs to pass to the opponent constructor
        if (app.config.opponentCount < app.data.opponentTypes.length) {
            opponentTypeListShuffled = opponentTypeListShuffled.slice(0, app.config.opponentCount);
        } else if (app.config.opponentCount > app.data.opponentTypes.length) {
            for (let i = 0; i < app.config.opponentCount - app.data.opponentTypes.length; i++) {
                let rand = round(Math.random()*(app.data.opponentTypes.length - 1), 0);
                opponentTypeListShuffled.push(app.data.opponentTypes[rand].id);
            };
        };

        for (let i = 0; i < opponentTypeListShuffled.length; i++) {
            app.gameState.opponents.push(new Opponent(i, null, opponentTypeListShuffled[i]));

            (app.parameters.logging ? console.log(`Made an Opponent ${app.gameState.opponents[i].getID()}`) : null);
        };

        (app.parameters.extendedLogging ? console.log(app.gameState.opponents) : null);
        

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