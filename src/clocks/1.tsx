import {P5CanvasInstance} from "@p5-wrapper/react";

export function clock1(p5: P5CanvasInstance) {
    let angles: number[] = [];
    let lastSecond = -1;
    let radius = Math.floor(Math.min(p5.windowWidth, p5.windowHeight) / 4);  // distance from center to place the numbers

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.angleMode(p5.RADIANS);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(16);

        // Initialize angles for the 60 possible positions (0 .. 59).
        // Evenly distribute them around the circle initially.
        for (let i = 0; i < 60; i++) {
            angles.push(p5.map(i, 0, 60, 0, p5.TWO_PI));
        }
    };

    p5.draw = () => {
        p5.background(220);

        // Move origin to center
        p5.translate(p5.width / 2, p5.height / 2);

        let s = p5.second();
        let m = p5.minute();
        let h = p5.hour() % 12;

        // Shuffle angles once each second
        if (s !== lastSecond) {
            p5.shuffle(angles, true);
            lastSecond = s;
        }

        // --------------------------------------
        // 1) Draw the numbers (1..60) at their shuffled positions
        // --------------------------------------
        p5.fill(0);
        p5.noStroke();
        for (let i = 0; i < 60; i++) {
            let a = angles[i] - p5.HALF_PI; // subtract HALF_PI so 0 is at 12 o'clock
            let x = radius * p5.cos(a);
            let y = radius * p5.sin(a);
            p5.text(i + 1, x, y);
        }

        // --------------------------------------
        // 2) Calculate indexes for hour, minute, second
        // --------------------------------------
        let hourIndex = h % 60;

        let minuteIndex = m % 60;
        let secondIndex = s % 60;

        // --------------------------------------
        // 3) Draw the clock hands
        // --------------------------------------
        p5.strokeWeight(4);
        p5.stroke(0);

        // Hour hand
        p5.push();
        p5.rotate(angles[hourIndex] - p5.HALF_PI);
        p5.line(0, 0, 60, 0);
        p5.pop();

        // Minute hand
        p5.strokeWeight(2);
        p5.push();
        p5.rotate(angles[minuteIndex] - p5.HALF_PI);
        p5.line(0, 0, 90, 0);
        p5.pop();

        // Second hand
        p5.stroke(255, 0, 0);
        p5.strokeWeight(1);
        p5.push();
        p5.rotate(angles[secondIndex] - p5.HALF_PI);
        p5.line(0, 0, 110, 0);
        p5.pop();

        // Draw a little dot in the center
        p5.noStroke();
        p5.fill(0);
        p5.ellipse(0, 0, 6, 6);
    }
    
    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }
}