const gamePads = new Map();

const handleGamepadConnected = (event) => {
    const { gamepad: { index, axes, buttons } } = event;

    gamePads.set(index, { axes, buttons });
};

const handleGamepadDisconnected = (event) => {
    const { gamepad: { index } } = event;

    gamePads.delete(index);
};

export const registerGamepadEvents = () => {
    window.addEventListener("gamepadconnected", handleGamepadConnected);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);
};

export const pollGamepads = () => {
    for (const gamePad of navigator.getGamepads()) {
        if (!gamePad) continue;

        if (gamePads.has(gamePad.index)) {
            const { index, axes, buttons } = gamePad;

            gamePads.set(index, { axes, buttons });
        }
    }
};


export const isButtonDown = (padId, button) => gamePads.get(padId)?.buttons[button].pressed;
export const isButtonUp = (padId, button) => !gamePads.get(padId)?.buttons[button].pressed;

export const isAxeGreater = (padId, axeId, value) => gamePads.get(padId)?.axes[axeId] >= value;
export const isAxeLower = (padId, axeId, value) => gamePads.get(padId)?.axes[axeId] <= value;