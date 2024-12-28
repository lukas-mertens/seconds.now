import { P5CanvasInstance } from "@p5-wrapper/react";
import p5, { Color } from 'p5';

export function binarySearchClock(p5: P5CanvasInstance) {
    let state_fresh = true;


    let bg = (p5: P5CanvasInstance): [number, number, number] => {
        const speed = 0.005; // Speed of color change
        const base = 122; // Minimum RGB value
        const range = 133; // Range to ensure max value is 255 (base + range)

        // Use sine waves to generate RGB values
        const r = base + range * Math.abs(Math.sin(p5.frameCount * speed));
        const g = base + range * Math.abs(Math.sin((p5.frameCount * speed) + Math.PI / 3)); // Phase shift
        const b = base + range * Math.abs(Math.sin((p5.frameCount * speed) + (2 * Math.PI) / 3)); // Another phase shift

        return [r, g, b];
    }

    let timeInput :  p5.Element;
    let msg = "";

    const compareTime = (s: String) => {
        if (s.length==0) {
            state_fresh = true;
            return true;
        }
        const currentTime = new Date();
        const [inputHours, inputMinutes, inputSeconds] = s.split(':').map(Number);

        if (
            isNaN(inputHours) || isNaN(inputMinutes) || isNaN(inputSeconds) ||
            inputHours < 0 || inputHours > 23 ||
            inputMinutes < 0 || inputMinutes > 59 ||
            inputSeconds < 0 || inputSeconds > 59
        ) {
            msg = 'Invalid time format. Please enter a valid time in HH:MM:SS format.';
            return false;
        }

        const inputDate = new Date();
        inputDate.setHours(inputHours, inputMinutes, inputSeconds, 0);

        // Ignore milliseconds for comparison
        currentTime.setMilliseconds(0);

        if (currentTime < inputDate) {
            msg = 'The current time is sooner than the given time.';
            return false;
        } else if (currentTime > inputDate) {
            msg = 'The current time is later than the given time.';
            return false;
        } else {
            msg = 'The current time is exactly the given time.';
            return true;
        }
    };

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.angleMode(p5.RADIANS);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(16);

        timeInput = p5.createInput("");
    };

    p5.draw = () => {
        p5.background(bg(p5));
        // Move origin to center
        p5.translate(p5.width / 2, p5.height / 2);

        p5.textSize(40);
        
        // Prompt
        p5.fill(0);
        p5.text("Guess what time it is", 0, -p5.height * 0.4);

        // Input box
        const INPUT_WIDTH = 95;
        timeInput.size(INPUT_WIDTH, 40);
        timeInput.style('font-size', '24px');
        timeInput.position(p5.width / 2 - INPUT_WIDTH/2, p5.height * 0.20);

        if (compareTime(timeInput.value().toString())) {
            if (!state_fresh) {
                p5.fill(0,255,0);
                p5.text("Correct", 0, 0);
            }
        } else {
            // Hints
            p5.fill(255,0,0);
            p5.text("Wrong", 0, 0);
            p5.textSize(p5.textSize() * 0.4);
            p5.text(msg, 0, 40);
        }

    };

    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        p5.textSize(Math.min(16, p5.windowWidth / 40));
    }

}
