"use strict";

export const FRAME_LENGHT = 1e3 / 60;

export const BUFFER_SIFE = 100;

export const SOUNDS = {
    "hado_l": "assets/sounds/sf_hadoken.mp3",
    "hado_r": "assets/sounds/ryu_hadoken.wav",
    "shoryu_l": "assets/sounds/sf_shoryuken.mp3",
    "shoryu_r": "assets/sounds/ken_shoryuken.wav"
};

export const INPUTS_ORDER = {
    "hado_l": [[7], [6], [5]],
    "hado_r": [[7], [8], [1]],
    "shoryu_l": [[5, 6], [7], [5, 6]],
    "shoryu_r": [[1, 8], [7], [1, 8]],
    "shaku_l": [[8], [7], [6], [5]],
    "shaku_r": [[6], [7], [8], [1]]
};

export const DIRECTION_STRING = {
    "1": "RIGHT",
    "2": "UP-RIGHT",
    "3": "UP",
    "4": "UP-LEFT",
    "5": "LEFT",
    "6": "DOWN-LEFT",
    "7": "DOWN",
    "8": "DOWN-RIGHT"
};

// export const GamepadLeftStick = {
//     DEADZONE: "deadZone",
//     HORIZONTAL_AXE_ID: "horizontalAxeId",
//     VERTICAL_AXE_ID: "verticalAxeId",
// };

// export const GamepadRightStick = {
//     DEADZONE: "deadZone",
//     HORIZONTAL_AXE_ID: "horizontalAxeId",
//     VERTICAL_AXE_ID: "verticalAxeId",
// };

// export const CONTROLS = {
//     gamePad: {
//         [GamepadLeftStick.DEADZONE]: 15,
//         [GamepadLeftStick.HORIZONTAL_AXE_ID]: 0,
//         [GamepadLeftStick.VERTICAL_AXE_ID]: 1,

//         [GamepadRightStick.DEADZONE]: 15,
//         [GamepadRightStick.HORIZONTAL_AXE_ID]: 2,
//         [GamepadRightStick.VERTICAL_AXE_ID]: 3,
//     }
// };
