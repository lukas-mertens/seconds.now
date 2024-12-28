import { P5CanvasInstance } from "@p5-wrapper/react";
import p5 from 'p5';

export function binarySearchClock(p5: P5CanvasInstance) {
    const CANVAS_WIDTH = 1000;
    const CANVAS_HEIGHT = 1200;

    let timeInput :  p5.Element;
    let msg = "";

    const compareTime = (s: String) => {
        const currentTime = new Date();
        const [inputHours, inputMinutes, inputSeconds] = s.split(':').map(Number);

        if (
            isNaN(inputHours) || isNaN(inputMinutes) || isNaN(inputSeconds) ||
            inputHours < 0 || inputHours > 23 ||
            inputMinutes < 0 || inputMinutes > 59 ||
            inputSeconds < 0 || inputSeconds > 59
        ) {
            msg = 'Invalid time format. Please enter a valid time in HH:MM:SS format.';
            return;
        }

        const inputDate = new Date();
        inputDate.setHours(inputHours, inputMinutes, inputSeconds, 0);

        // Ignore milliseconds for comparison
        currentTime.setMilliseconds(0);

        if (currentTime < inputDate) {
            msg = 'The current time is sooner than the given time.';
        } else if (currentTime > inputDate) {
            msg = 'The current time is later than the given time.';
        } else {
            msg = 'The current time is exactly the given time.';
        }
    };

    p5.setup = () => {
        p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        timeInput = p5.createInput("12:00:00");
        timeInput.size(95, 40);
        timeInput.style('font-size', '24px');
        timeInput.position(250, 75);
    };

    p5.draw = () => {
        p5.background(245);
        p5.textSize(32);
        p5.fill(0);
        compareTime(timeInput.value().toString());
        p5.text(msg, 50, 50);
    };

}
