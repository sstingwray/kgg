(function() {
    'use strict';

    let app = {
        parameters: {
            animationDelay: 300
        },
        data: {
            fieldParams: {
                sizeX: 3,
                sizeY: 3,
            }
        },
        components: {
            spinner: {},
            btnTemplate: {},
            switchTemplate: {},
            separatorTemplate: {},
            notificationTemplate: {},
        },
        containers: {
            pageContent: {},
            notificationPanel: {},
        },
    };

    app.fabricateButton = (btnClass, labelText, type, toDoFunction, container, hintText = '') => {
        let newBtn = app.components.btnTemplate.cloneNode(true);

        newBtn.classList.add('generated');
        newBtn.classList.add(btnClass);
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

    app.drawHexagon = (x, y, a, r) => {
        let context = app.components.fieldCanvas.getContext('2d');

        context.strokeStyle = colorFromCSSClass('canvas-stroke-style');

        context.beginPath();
        for (var i = 0; i < 6; i++) {
            context.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
        }
        context.closePath();
        context.stroke();
    };

    app.drawGrid = (a, r, width, height) => {
        for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
            for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
                app.drawHexagon(x, y, a, r);
            };
        };
    };

    $(function() {
        app.containers.pageContent = document.querySelector('.page-content');
        app.containers.notificationPanel = document.querySelector('.notification-panel');

        app.components.spinner = document.querySelector('.spinner-container');
        app.components.btnTemplate = document.querySelector('.btn.template');
        app.components.switchTemplate = document.querySelector('.switch-btn.template');
        app.components.separatorTemplate = document.querySelector('.separator.template');
        app.components.notificationTemplate = document.querySelector('.notification.template');
        app.components.fieldCanvas = document.querySelector('.field-canvas');
        
        console.log(app.containers.pageContent);

        setTimeout(() => {
            app.components.fieldCanvas.height = app.containers.pageContent.clientHeight;
            app.components.fieldCanvas.width = app.containers.pageContent.clientWidth;
            //app.components.fieldCanvas.width = app.components.fieldCanvas.height * (app.components.fieldCanvas.clientWidth / app.components.fieldCanvas.clientHeight);
            let a = 2 * Math.PI / 6;
            let r = 96;

            app.drawGrid(a, r, app.components.fieldCanvas.width, app.components.fieldCanvas.height);
            $(app.components.spinner).hide();

        }, 500);

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

})();