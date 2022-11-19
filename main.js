"use strict";

let gamepadInfo = document.getElementById("gamepad-info");
let stick = document.getElementById("left-stick");
let leftVis = document.getElementById("left-vis");
let angleInfo = document.getElementById("angle-info");
let frameInfo = document.getElementById("frame-info");
const deadZone = 10;
const activeInputZone = 22.5;
const frameTime = 1000 / 60;
const hadoken = new Audio("assets/sounds/hadoken.mp3");
// const frameAverage = 50;
let released = true;
let used = false;
let rAF;
// let cpt = 0;
// let msAverage;
let buffer = new Array();
buffer.push = function () {
    if (this.length >= 200) {
        this.shift();
    }
    return Array.prototype.push.apply(this, arguments);
};

window.window.requestAnimationFrame = function () {
    return window.window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function (f) {
            window.setTimeout(f, 1e3 / 60);
        };
}();

window.addEventListener("gamepadconnected", function () {
    // var gp = navigator.getGamepads()[0];
    // gamepadInfo.innerHTML = "Gamepad connected at index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes";
    gamepadInfo.style.display = "none";
    stick.style.display = "block";
    angleInfo.style.display = "block";
    inputLoop();
});

window.addEventListener("gamepaddisconnected", function () {
    stick.style.display = "none";
    angleInfo.style.display = "none";
    gamepadInfo.style.display = "block";
    gamepadInfo.innerHTML = "Waiting for gamepad";
    window.cancelAnimationFrame(rAF);
});

// if (!('GamepadEvent' in window)) {
//     // No gamepad events available, poll instead.;
//     var interval = setInterval(pollGamepads, 500);
// }
// function pollGamepads() {
//     let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
//     for (let i = 0; i < gamepads.length; i++) {
//         var gp = gamepads[i];
//         if (gp) {
//             gamepadInfo.innerHTML = "Gamepad connected at index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes";
//             inputLoop();
//             clearInterval(interval);
//         }
//     }
// }

const checkHadoken = (buffer) => {
    if (buffer[1].direction != 6) {
        return false;
    }

    let indexLastR = 1;
    // console.log("indexLastR : " + indexLastR + " - " + buffer[indexLastR].direction + ", " + buffer[indexLastR].time);

    let indexLastDR = buffer.slice(indexLastR).findIndex((element) => element.direction == 3) + 1;
    if (indexLastDR == -1) {
        console.log("FAILED indexLastDR");
        return false;
    }
    // console.log("indexLastDR : " + indexLastDR + " - " + buffer[indexLastDR].direction + ", " + buffer[indexLastDR].time);

    let indexLastD = buffer.slice(indexLastDR).findIndex((element) => element.direction == 2) + indexLastDR;
    if (indexLastD == -1) {
        console.log("FAILED indexLastD");
        return false;
    }
    // console.log("indexLastD : " + indexLastD + " - " + buffer[indexLastD].direction + ", " + buffer[indexLastD].time);

    if ((buffer[indexLastDR].time - buffer[indexLastD].time) > (frameTime * 10)) {
        console.log("Too much time on 3");
        return false;
    } else if ((buffer[indexLastR].time - buffer[indexLastDR].time) > (frameTime * 10)) {
        console.log("Too much time on 6");
        return false;
    } else if ((buffer[0] - buffer[indexLastD].time) > (frameTime * 21)) {
        console.log("Pressing A too late");
        return false;
    }

    return true;
};

const getAngle = (x, y) => {
    var radians = Math.atan2(-y, x);
    if (radians < 0) {
        radians += 2 * Math.PI;
    }
    var degrees = Math.abs(radians) * (180 / Math.PI);
    return (Math.round(degrees * 100) / 100);
};

let lastFrame = window.performance.now();

const inputLoop = () => {
    let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    if (!gamepads)
        return;

    let gp = gamepads[0];

    // Buffer "A" button push, [1] for GCC
    if (gp.buttons[0].pressed == true) {
        buffer.push({ direction: 0, time: window.performance.now() });
        if (released == true && checkHadoken(buffer.slice().reverse())) {
            console.log("HADOKEEEEEN");
            hadoken.play();
            gp.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 100,
                weakMagnitude: 0.2,
                strongMagnitude: 0.2,
            });
        }
        document.body.style.backgroundColor = "#333333";
        used = true;
        released = false;
    } else {
        document.body.style.backgroundColor = "black";
        released = true;
    }

    // Buffer analog stick
    if ((Math.abs(gp.axes[0]) * 100) > deadZone || (Math.abs(gp.axes[1]) * 100) > deadZone) {
        used = true;

        leftVis.style.left = 50 + (gp.axes[0] * 100) / 2 + "%";
        leftVis.style.top = 50 + (gp.axes[1] * 100) / 2 + "%";

        let leftAngle = getAngle(gp.axes[0], gp.axes[1]);
        let leftPower = (Math.sqrt((Math.abs(gp.axes[0]) ** 2 + Math.abs(-gp.axes[1]) ** 2)) * 100).toFixed(2);
        angleInfo.innerHTML = leftAngle + "°" + "<br>" + leftPower + "%";

        if (leftAngle < (0 + activeInputZone) || leftAngle > (360 - activeInputZone)) {
            // stick.style.backgroundColor = "#cc0001";
            buffer.push({ direction: 6, time: window.performance.now() });
        }
        else if (leftAngle < (45 + activeInputZone) && leftAngle > (45 - activeInputZone)) {
            // stick.style.backgroundColor = "#fb940b";
            buffer.push({ direction: 9, time: window.performance.now() });
        }
        else if (leftAngle < (90 + activeInputZone) && leftAngle > (90 - activeInputZone)) {
            // stick.style.backgroundColor = "#ffff01";
            buffer.push({ direction: 8, time: window.performance.now() });
        }
        else if (leftAngle < (135 + activeInputZone) && leftAngle > (135 - activeInputZone)) {
            // stick.style.backgroundColor = "#01cc00";
            buffer.push({ direction: 7, time: window.performance.now() });
        }
        else if (leftAngle < (180 + activeInputZone) && leftAngle > (180 - activeInputZone)) {
            // stick.style.backgroundColor = "#03c0c6";
            buffer.push({ direction: 4, time: window.performance.now() });
        }
        else if (leftAngle < (225 + activeInputZone) && leftAngle > (225 - activeInputZone)) {
            // stick.style.backgroundColor = "#0000fe";
            buffer.push({ direction: 1, time: window.performance.now() });
        }
        else if (leftAngle < (270 + activeInputZone) && leftAngle > (270 - activeInputZone)) {
            // stick.style.backgroundColor = "#762ca7";
            buffer.push({ direction: 2, time: window.performance.now() });
        }
        else if (leftAngle < (315 + activeInputZone) && leftAngle > (315 - activeInputZone)) {
            // stick.style.backgroundColor = "#fe98bf";
            buffer.push({ direction: 3, time: window.performance.now() });
        }
        else {
            stick.style.backgroundColor = "black";
        }

    } else {
        used = false;
        leftVis.style.left = "50%";
        leftVis.style.top = "50%";
        angleInfo.innerHTML = "0.00°<br>0.00%";
        stick.style.backgroundColor = "black";
    }

    console.log(buffer);

    // Adding empty input into the buffer
    if (!used && (window.performance.now() - lastFrame) >= frameTime) {
        buffer.push({ direction: -1, time: window.performance.now() });
        lastFrame = window.performance.now();
    }

    rAF = requestAnimationFrame(inputLoop);
};