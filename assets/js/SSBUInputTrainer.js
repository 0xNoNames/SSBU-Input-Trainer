import { pollGamepads, registerGamepadEvents, gamePads } from "./inputHandler.js";

export class SSBUInputTrainer {
    constructor() {
        this.context = this.getContext();
        // this.frameTime = {
        //     previous: 0,
        //     secondsPassed = 0,
        // };
    }


    getContext = () => {
        return {
            inputSelect: document.getElementsByClassName("select-input"),
            inputImage: document.getElementById("input-img"),
            inputText: document.getElementById("input-p"),
            gamepadInfo: document.getElementById("gamepad-info"),
            stickLeft: document.getElementById("left-stick"),
            leftVis: document.getElementById("left-vis"),
            leftDeadZone: document.getElementById("left-dz"),
            angleInfo: document.getElementById("angle-info"),
        };
    };

    getAngle = (x, y) => {
        var radians = Math.atan2(-y, x);
        if (radians < 0) {
            radians += 2 * Math.PI;
        }
        var degrees = Math.abs(radians) * (180 / Math.PI);
        return (Math.round(degrees * 100) / 100);
    };


    update = (timeStamp) => {
        if (!gamePads)
            return;

        let gp = gamepads[0];
        let leftAngle = this.getAngle(gp.axes[controllerSettings.L_stick[0]], gp.axes[controllerSettings.L_stick[2]]);
        let leftDistance = (Math.sqrt((gp.axes[controllerSettings.L_stick[0]] ** 2 + gp.axes[controllerSettings.L_stick[2]] ** 2)) * 100).toFixed(2);

        // Show left analog stick and deadzone
        leftDeadZone.style.width = leftDeadZone.style.height = `${controllerSettings.Deadzone}%`;
        leftVis.style.left = 50 + (gp.axes[controllerSettings.L_stick[0]] * 100) / 2 + "%";
        leftVis.style.top = 50 + (gp.axes[controllerSettings.L_stick[2]] * 100) / 2 + "%";

        // Buffer "A" button push
        if (gp.buttons[controllerSettings.A].pressed == true) {
            buffer.push({ direction: -1, time: timeStamp });
            used = true;
            isReleasedAfterPressed = true;
        } else {
            if (isReleasedAfterPressed) {
                buffer.push({ direction: -2, time: timeStamp });
                inputChecker.buffer = buffer.slice().reverse();
                inputChecker.inputsOrder = INPUTS_ORDER[chosenInput];
                if (inputChecker.isValidThreeMotion()) {
                    console.log("GOOD INPUT");
                    audioManager.playSound();

                    // gp.vibrationActuator.playEffect("dual-rumble", {
                    //     startDelay: 0,
                    //     duration: 100,
                    //     weakMagnitude: 0.2,
                    //     strongMagnitude: 0.2,
                    // });
                    document.body.style.backgroundColor = "#001100";
                } else {
                    document.body.style.backgroundColor = "#110000";
                }
                // Clear the buffer 
                buffer.fill({ direction: 0, time: window.performance.now() });
                used = false;
                isReleasedAfterPressed = false;
            }
            document.body.style.backgroundColor = "black";
        }

        // Buffer left analog stick
        if (leftDistance > controllerSettings.Deadzone) {
            used = true;
            angleInfo.innerHTML = leftAngle + "°" + "<br>" + leftDistance + "%";
            let numDirection = 1 + (Math.round(leftAngle / 45) % 8);
            if (buffer.at(-1).direction != numDirection)
                buffer.push({ direction: numDirection, time: timeStamp });
        } else {
            used = false;
            angleInfo.innerHTML = "0.00°<br>0.00%";
        }

        // Adding empty input if no command inputted
        if (!used)
            buffer.push({ direction: 0, time: timeStamp });
    };


    frame = (timeStamp) => {
        window.requestAnimationFrame(this.frame.bind(this));
        pollGamepads();
        update(timeStamp);
        // Render here ?
    };


    start = () => {
        registerGamepadEvents();
        window.requestAnimationFrame(this.frame.bind(this));
    };
}