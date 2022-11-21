"use strict";

let gamepadInfo = document.getElementById("gamepad-info");
let stick = document.getElementById("left-stick");
let leftVis = document.getElementById("left-vis");
let leftDeadZone = document.getElementById("left-dz");
let angleInfo = document.getElementById("angle-info");
let frameInfo = document.getElementById("frame-info");
const frameLength = 1e3 / 60;
const hadokenSound = new Audio("assets/sounds/hadoken.mp3");
// const frameAverage = 50;
let released = true;
let used = false;
let rAF;
let controllerSettings = { "A": 0, "B": 1, "L_stick": "0,1", "R_stick": "2,3", "L_trigger": 3, "R_trigger": 4, "Deadzone": 10 };
let gui = new dat.GUI({ name: "Controller Settings" });
// let cpt = 0;
// let msAverage;
let buffer = new Array();
buffer.push = (args) => {
    if (this.length >= 200) {
        this.shift();
    }
    return Array.prototype.push.apply(this, args);
};

window.requestAnimationFrame = function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function (f) {
            window.setTimeout(f, 1e3 / 60);
        };
}();

window.addEventListener("gamepadconnected", () => {
    var gp = navigator.getGamepads()[0];
    gamepadInfo.style.display = "none";
    stick.style.display = "block";
    angleInfo.style.display = "block";

    gui.add(controllerSettings, "A", Array.from({ length: (gp.buttons.length + 1) }, (_, i) => i));
    gui.add(controllerSettings, "B", Array.from({ length: (gp.buttons.length + 1) }, (_, i) => i));
    gui.add(controllerSettings, "R_trigger", Array.from({ length: (gp.buttons.length + 1) }, (_, i) => i));
    gui.add(controllerSettings, "L_trigger", Array.from({ length: (gp.buttons.length + 1) }, (_, i) => i));
    gui.add(controllerSettings, "L_stick", Array.from({ length: (gp.axes.length + 1) / 2 }, (_, i) => [i * 2, i * 2 + 1]));
    gui.add(controllerSettings, "R_stick", Array.from({ length: (gp.axes.length + 1) / 2 }, (_, i) => [i * 2, i * 2 + 1]));
    gui.add(controllerSettings, "Deadzone", 0, 100);

    inputLoop();
});

window.addEventListener("gamepaddisconnected", () => {
    stick.style.display = "none";
    angleInfo.style.display = "none";
    gamepadInfo.style.display = "block";
    gamepadInfo.innerHTML = "Waiting for gamepad";
    window.cancelAnimationFrame(rAF);
});

const checkHadoken = (buffer) => {
    if (buffer.length > 1 && buffer[1].direction != 1) {
        return false;
    }

    let indexLastR = 1;

    // console.log("indexLastR : " + indexLastR + " - " + buffer[indexLastR].direction + ", " + buffer[indexLastR].time);
    let indexLastDR = buffer.slice(indexLastR).findIndex((element) => element.direction == 8) + 1;
    if (indexLastDR == -1) {
        console.log("FAILED indexLastDR");
        return false;
    }

    // console.log("indexLastDR : " + indexLastDR + " - " + buffer[indexLastDR].direction + ", " + buffer[indexLastDR].time);
    let indexLastD = buffer.slice(indexLastDR).findIndex((element) => element.direction == 7) + indexLastDR;
    if (indexLastD == -1) {
        console.log("FAILED indexLastD");
        return false;
    }

    // console.log("indexLastD : " + indexLastD + " - " + buffer[indexLastD].direction + ", " + buffer[indexLastD].time);
    if ((buffer[indexLastDR].time - buffer[indexLastD].time) > (frameLength * 10)) {
        console.log("Too much time on right down");
        return false;
    } else if ((buffer[indexLastR].time - buffer[indexLastDR].time) > (frameLength * 11)) {
        console.log("Too much time on right");
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

    // Show left analog stick and deadzone
    leftDeadZone.style.width = controllerSettings.Deadzone + "%";
    leftDeadZone.style.height = controllerSettings.Deadzone + "%";
    leftVis.style.left = 50 + (gp.axes[controllerSettings.L_stick[0]] * 100) / 2 + "%";
    leftVis.style.top = 50 + (gp.axes[controllerSettings.L_stick[2]] * 100) / 2 + "%";

    // Buffer "A" button push
    if (gp.buttons[controllerSettings.A].pressed == true) {
        buffer.push({ direction: 0, time: window.performance.now() });
        if (released == true && checkHadoken(buffer.slice().reverse())) {
            console.log("HADOKEEEEEN");
            hadokenSound.play();
            // gp.vibrationActuator.playEffect("dual-rumble", {
            //     startDelay: 0,
            //     duration: 100,
            //     weakMagnitude: 0.2,
            //     strongMagnitude: 0.2,
            // });
        }
        document.body.style.backgroundColor = "#333333";
        used = true;
        released = false;
    } else {
        document.body.style.backgroundColor = "black";
        released = true;
    }

    // Buffer left analog stick
    if (((Math.abs(gp.axes[controllerSettings.L_stick[0]]) + Math.abs(gp.axes[controllerSettings.L_stick[2]])) * 100) > controllerSettings.Deadzone) {
        used = true;

        let leftAngle = getAngle(gp.axes[controllerSettings.L_stick[0]], gp.axes[controllerSettings.L_stick[2]]);
        let leftDistance = (Math.sqrt((Math.abs(gp.axes[controllerSettings.L_stick[0]]) ** 2 + Math.abs(-gp.axes[controllerSettings.L_stick[2]]) ** 2)) * 100).toFixed(2);
        angleInfo.innerHTML = leftAngle + "°" + "<br>" + leftDistance + "%";

        buffer.push({ direction: ((Math.round(leftAngle / 45) % 8) + 1), time: window.performance.now() });
    } else {
        used = false;
        angleInfo.innerHTML = "0.00°<br>0.00%";
        stick.style.backgroundColor = "black";
    }

    // Adding empty input into the buffer every frame at 60 fps
    if (!used && (window.performance.now() - lastFrame) >= frameLength) {
        buffer.push({ direction: -1, time: window.performance.now() });
        lastFrame = window.performance.now();
    }

    rAF = requestAnimationFrame(inputLoop);
};