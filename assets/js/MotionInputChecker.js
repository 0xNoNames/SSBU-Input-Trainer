import { DIRECTION_STRING, FRAME_LENGHT } from "./constants";

export class MotionInputChecker {
    constructor(buffer, inputsOrder) {
        this.buffer = buffer;
        this.inputsOrder = inputsOrder;
    }

    isValidThreeMotion = () => {
        let indexThird = bufferCopy.findIndex((element) => inputsOrder[2].includes(element.direction));
        let indexSecond = bufferCopy.findIndex((element) => inputsOrder[1].includes(element.direction));
        let indexFirst = bufferCopy.slice(indexSecond).findIndex((element) => inputsOrder[0].includes(element.direction));
        let indexAttack = bufferCopy.slice(indexSecond).findIndex((element) => inputsOrder[0].includes(element.direction));

        // sliced(indexSecond) changed the order of the buffer
        indexFirst += indexSecond;

        if (indexThird == -1 || indexSecond == -1 || (indexFirst - indexSecond) == -1 || indexThird > indexSecond || indexSecond > indexFirst || indexThird > indexFirst) {
            console.log(` `);
            console.log(`-------------------------------------`);
            console.log(`-------------------------------------`);
            console.log(bufferCopy);
            console.log(`indexFirst : ${indexFirst}`);
            console.log(`indexSecond : ${indexSecond}`);
            console.log(`indexThird : ${indexThird}`);


            let msg = "Failed : You must input";

            for (let i = 0; i < inputsOrder.length; i++) {
                let subArray = inputsOrder[i];
                for (let j = 0; j < subArray.length; j++) {
                    msg += ` ${DIRECTION_STRING.get(parseInt(subArray[j]) - 1)} `;
                    if (j + 1 < subArray.length)
                        msg += "or";
                }
                if (i + 1 < inputsOrder.length)
                    msg += "->";
            }
            console.log(msg);
            // console.log(`Failed : You must input ${DIRECTION_STRING[inputsOrder[0] - 1]} -> ${DIRECTION_STRING[inputsOrder[1] - 1]} -> ${DIRECTION_STRING[inputsOrder[2] - 1]}`);
            return false;
        }

        if ((bufferCopy[indexThird].time - bufferCopy[indexSecond].time) > (10 * FRAME_LENGHT)) {
            console.log(` `);
            console.log(`-------------------------------------`);
            console.log(`-------------------------------------`);
            console.log(bufferCopy);
            console.log(`indexFirst : ${indexFirst}`);
            console.log(`indexSecond : ${indexSecond}`);
            console.log(`indexThird : ${indexThird}`);

            console.log(`Failed : Too much time on ${DIRECTION_STRING.get(inputsOrder[1] - 1)}`);
            console.log(bufferCopy[indexThird].time - bufferCopy[indexSecond].time);
            console.log((10 * FRAME_LENGHT));
            return false;
        } else if ((bufferCopy[0].time - bufferCopy[indexThird].time) > (11 * FRAME_LENGHT)) {
            console.log(` `);
            console.log(`-------------------------------------`);
            console.log(`-------------------------------------`);
            console.log(bufferCopy);
            console.log(`indexFirst : ${indexFirst}`);
            console.log(`indexSecond : ${indexSecond}`);
            console.log(`indexThird : ${indexThird}`);

            console.log("Failed : Pressed attack button too late");
            console.log(bufferCopy[0].time - bufferCopy[indexSecond].time);
            console.log((11 * FRAME_LENGHT));
            return false;
        }

        // Add how much time A pressed

        return true;
    };
};