"use strict";

import { AudioManager } from "./AudioManager.js";
import { BUFFER_SIFE, SOUNDS, INPUTS_ORDER, DIRECTION_STRING } from "./constants.js";
import { MotionInputChecker } from "./MotionInputChecker.js";

// -- -- -- -- -- -- --       -- -- -- --       -- -- -- -- -- -- -- \\
// -- -- -- -- -- -- -- CONSTANTS AND VARIABLES -- -- -- -- -- -- -- \\
// -- -- -- -- -- -- --       -- -- -- --       -- -- -- -- -- -- -- \\

// Constants
const audioManager = new AudioManager();
const MotionInputChecker = new MotionInputChecker();
const buffer = new Array(BUFFER_SIFE);
buffer.fill({ direction: 0, time: window.performance.now() });
buffer.push = function () {
    if (this.length >= BUFFER_SIFE)
        this.shift();
    return Array.prototype.push.apply(this, arguments);
};

// Variables
let controllerSettings = { "A": 0, "B": 1, "L_stick": "0,1", "R_stick": "2,3", "L_trigger": 3, "R_trigger": 4, "Deadzone": 15 };
let used = false;
let chosenInput = `${inputSelect[1].value}_${inputSelect[2].value}`;
if (INPUTS_ORDER[chosenInput] === undefined || SOUNDS[chosenInput] === undefined) {
    chosenInput = "hado_r";
    inputSelect[0].style.borderColor = "red";
    inputSelect[1].style.borderColor = "red";
    inputSelect[2].style.borderColor = "red";
} else {
    inputSelect[0].style.borderColor = "white";
    inputSelect[1].style.borderColor = "white";
    inputSelect[2].style.borderColor = "white";
}
inputImage.src = `assets/img/${chosenInput}.png`;
audioManager.selectSound(SOUNDS[chosenInput]);
let gui;
let isReleasedAfterPressed = false;


// -- -- -- -- -- -- --     -- -- --     -- -- -- -- -- -- -- \\
// -- -- -- -- -- -- -- SETUP AND EVENTS -- -- -- -- -- -- -- \\
// -- -- -- -- -- -- --     -- -- --     -- -- -- -- -- -- -- \\
// Requestion animation setup for every navigators
window.requestAnimationFrame = function (f) {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function (f) {
            window.setTimeout(f, 1e3 / 60);
        };
}();

// Gamepad connected event 
window.addEventListener("gamepadconnected", () => {
    var gp = navigator.getGamepads()[0];
    gamepadInfo.style.display = "none";
    inputImage.style.display = "block";
    inputText.style.display = "block";
    Array.from(inputSelect).forEach((select) => {
        select.style.display = "block";
    });
    stickLeft.style.display = "block";
    angleInfo.style.display = "block";

    gui = new dat.GUI({ name: "Controller settings" });
    gui.add(controllerSettings, "A", Array.from({ length: (gp.buttons.length + 1) }, (_, i) => i));
    gui.add(controllerSettings, "B", Array.from({ length: (gp.buttons.length + 1) }, (_, i) => i));
    gui.add(controllerSettings, "R_trigger", Array.from({ length: (gp.buttons.length + 1) }, (_, i) => i));
    gui.add(controllerSettings, "L_trigger", Array.from({ length: (gp.buttons.length + 1) }, (_, i) => i));
    gui.add(controllerSettings, "L_stick", Array.from({ length: (gp.axes.length + 1) / 2 }, (_, i) => [i * 2, i * 2 + 1]));
    gui.add(controllerSettings, "R_stick", Array.from({ length: (gp.axes.length + 1) / 2 }, (_, i) => [i * 2, i * 2 + 1]));
    gui.add(controllerSettings, "Deadzone", 0, 100);
});

// Gamepad disconnected event 
window.addEventListener("gamepaddisconnected", () => {
    stickLeft.style.display = "none";
    angleInfo.style.display = "none";
    inputImage.style.display = "none";
    inputText.style.display = "none";
    gamepadInfo.style.display = "block";
    gamepadInfo.innerHTML = "Waiting for gamepad";
    Array.from(inputSelect).forEach((select) => {
        select.style.display = "none";
    });
    gui.destroy();
});

// Select change event
Array.from(inputSelect).forEach((element) => {
    element.addEventListener("change", () => {
        chosenInput = `${inputSelect[1].value}_${inputSelect[2].value}`;
        if (INPUTS_ORDER[chosenInput] === undefined || SOUNDS[chosenInput] === undefined) {
            chosenInput = "hado_r";
            inputSelect[0].style.borderColor = "red";
            inputSelect[1].style.borderColor = "red";
            inputSelect[2].style.borderColor = "red";
        } else {
            inputSelect[0].style.borderColor = "white";
            inputSelect[1].style.borderColor = "white";
            inputSelect[2].style.borderColor = "white";
        }
        inputImage.src = `assets/img/${chosenInput}.png`;
    });
});
