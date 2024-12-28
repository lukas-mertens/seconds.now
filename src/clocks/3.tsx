import { P5CanvasInstance } from "@p5-wrapper/react";

export function colorClockLegend(p5: P5CanvasInstance) {
    // 1) Arrays for minute (24*60=1440) and second (60) colors
    let minuteColors: p5.Color[] = [];
    let secondColors: p5.Color[] = [];

    // 2) Fixed canvas size (no resizing)
    const CANVAS_WIDTH = 1000;
    const CANVAS_HEIGHT = 1200;

    // Each grid cell is BOX_SIZE px
    const BOX_SIZE = 15;

    // Generate random colors
    function generateMinuteColors() {
        for (let i = 0; i < 24 * 60; i++) {
            minuteColors.push(p5.color(p5.random(255), p5.random(255), p5.random(255)));
        }
        p5.shuffle(minuteColors, true);
    }

    function generateSecondColors() {
        for (let i = 0; i < 60; i++) {
            secondColors.push(p5.color(p5.random(255), p5.random(255), p5.random(255)));
        }
        p5.shuffle(secondColors, true);
    }

    // Determine orientation based on browser window
    function getOrientation(): "portrait" | "landscape" {
        return p5.windowWidth < p5.windowHeight ? "portrait" : "landscape";
    }

    // ----------------------------------------------------------------
    // Draw the top "Current time:" and two rectangles (minute+second)
    // Center them horizontally
    // ----------------------------------------------------------------
    function drawClockFace() {
        const centerX = CANVAS_WIDTH / 2;
        const topY = 40;

        // "Current time:" text
        p5.textAlign(p5.CENTER, p5.TOP);
        p5.textSize(24);
        p5.fill(0);
        p5.text("Current time:", centerX, topY);

        // Two squares below
        const rectWidth = 100;
        const rectHeight = 100;
        const gap = 10;
        const clockTop = topY + 40; // gap under text

        // Current hour, minute, second
        const h = p5.hour();
        const m = p5.minute();
        const s = p5.second();

        // Index into minuteColors
        const minuteIndex = h * 60 + m;
        const minuteColor = minuteColors[minuteIndex];

        // Index into secondColors
        const secondColor = secondColors[s];

        // Center both rectangles as a pair
        const totalW = 2 * rectWidth + gap;
        const leftRectX = centerX - totalW / 2;
        const rightRectX = leftRectX + rectWidth + gap;

        // Minute color rectangle (left)
        p5.noStroke();
        p5.fill(minuteColor);
        p5.rect(leftRectX, clockTop, rectWidth, rectHeight);

        // Second color rectangle (right)
        p5.fill(secondColor);
        p5.rect(rightRectX, clockTop, rectWidth, rectHeight);
    }

    // ----------------------------------------------------------------
    // Draw the combined minute + second grids in one coordinate system.
    //
    // Portrait: 
    //   - columns = 0..23 for hours, col=24 is empty gap, col=25 = second grid
    //   - rows = 0..59 for minutes
    //
    // Landscape:
    //   - rows = 0..23 for hours, row=24 is empty gap, row=25 = second grid
    //   - columns = 0..59 for minutes
    // ----------------------------------------------------------------
    function drawAllGrids(orientation: "portrait" | "landscape", startX: number, startY: number) {
        if (orientation === "portrait") {
            // 24 columns for hours => col=0..23
            // col=24 => gap (no drawing)
            // col=25 => second grid
            // rows=0..59 => minutes

            // Label columns for hours
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.textSize(Math.max(10, BOX_SIZE * 0.6));
            for (let hour = 0; hour < 24; hour++) {
                const labelX = startX + hour * BOX_SIZE + BOX_SIZE / 2;
                const labelY = startY - BOX_SIZE * 0.7;
                p5.fill(0);
                p5.noStroke();
                p5.text(`${hour}`, labelX, labelY);
            }
            // Optionally label the second col=25
            {
                const labelX = startX + 25 * BOX_SIZE + BOX_SIZE / 2;
                const labelY = startY - BOX_SIZE * 0.7;
                p5.fill(0);
                p5.noStroke();
                p5.text(`sec`, labelX, labelY);
            }

            // Label rows for minutes
            for (let minute = 0; minute < 60; minute++) {
                const labelX = startX - BOX_SIZE * 0.7;
                const labelY = startY + minute * BOX_SIZE + BOX_SIZE / 2;
                p5.fill(0);
                p5.noStroke();
                p5.text(`${minute}`, labelX, labelY);
            }

            // Now draw the minute grid
            for (let hour = 0; hour < 24; hour++) {
                for (let minute = 0; minute < 60; minute++) {
                    const index = hour * 60 + minute;
                    p5.fill(minuteColors[index]);
                    p5.stroke(200);
                    p5.rect(
                        startX + hour * BOX_SIZE,
                        startY + minute * BOX_SIZE,
                        BOX_SIZE,
                        BOX_SIZE
                    );
                }
            }

            // Draw the second grid in col=25
            // for row=0..59 => secondColors[row]
            for (let sec = 0; sec < 60; sec++) {
                p5.fill(secondColors[sec]);
                p5.stroke(200);
                // skip col=24 => gap, so col=25:
                p5.rect(
                    startX + 25 * BOX_SIZE,
                    startY + sec * BOX_SIZE,
                    BOX_SIZE,
                    BOX_SIZE
                );
            }

        } else {
            // LANDSCAPE
            // rows=0..23 => hours
            // row=24 => gap
            // row=25 => second grid
            // columns=0..59 => minutes

            // Label columns for minutes
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.textSize(Math.max(10, BOX_SIZE * 0.6));
            for (let minute = 0; minute < 60; minute++) {
                const labelX = startX + minute * BOX_SIZE + BOX_SIZE / 2;
                const labelY = startY - BOX_SIZE * 0.7;
                p5.fill(0);
                p5.noStroke();
                p5.text(`${minute}`, labelX, labelY);
            }
            // Optionally label row=25 as "sec"
            {
                const labelX = startX - BOX_SIZE * 0.7;
                const labelY = startY + 25 * BOX_SIZE + BOX_SIZE / 2;
                p5.fill(0);
                p5.noStroke();
                p5.text(`sec`, labelX, labelY);
            }

            // Label rows for hours
            for (let hour = 0; hour < 24; hour++) {
                const labelX = startX - BOX_SIZE * 0.7;
                const labelY = startY + hour * BOX_SIZE + BOX_SIZE / 2;
                p5.fill(0);
                p5.noStroke();
                p5.text(`${hour}`, labelX, labelY);
            }

            // Draw the minute grid
            for (let hour = 0; hour < 24; hour++) {
                for (let minute = 0; minute < 60; minute++) {
                    const index = hour * 60 + minute;
                    p5.fill(minuteColors[index]);
                    p5.stroke(200);
                    p5.rect(
                        startX + minute * BOX_SIZE,
                        startY + hour * BOX_SIZE,
                        BOX_SIZE,
                        BOX_SIZE
                    );
                }
            }

            // Second grid in row=25, columns=0..59 => secondColors[col]
            for (let sec = 0; sec < 60; sec++) {
                p5.fill(secondColors[sec]);
                p5.stroke(200);
                // skip row=24 => gap, so row=25:
                p5.rect(
                    startX + sec * BOX_SIZE,
                    startY + 25 * BOX_SIZE,
                    BOX_SIZE,
                    BOX_SIZE
                );
            }
        }
    }

    // ----------------------------------------------------------------
    // p5 Setup & Draw
    // ----------------------------------------------------------------
    p5.setup = () => {
        p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        generateMinuteColors();
        generateSecondColors();
        p5.textSize(16);
    };

    p5.draw = () => {
        p5.background(245);

        // 1) Draw "Current time:" + rectangles
        drawClockFace();

        // 2) Orientation
        const orientation = getOrientation();

        // 3) We'll compute the bounding box for our unified grid
        //    so we can center it horizontally
        let gridWidth: number;
        let gridHeight: number;

        if (orientation === "portrait") {
            // total columns = 26 => 24 for hours + 1 gap + 1 for seconds
            // total rows = 60
            gridWidth = 26 * BOX_SIZE;
            gridHeight = 60 * BOX_SIZE;
        } else {
            // landscape
            // columns = 60
            // rows = 26 => 24 for hours + 1 gap + 1 for seconds
            gridWidth = 60 * BOX_SIZE;
            gridHeight = 26 * BOX_SIZE;
        }

        // We'll place the top of the grid below the clock
        // Let's define a margin
        const topMargin = 280;
        // horizontally center: x = (CANVAS_WIDTH - gridWidth)/2
        const gridX = (CANVAS_WIDTH - gridWidth) / 2;
        const gridY = topMargin;

        // 4) Draw the combined minute+second grid
        drawAllGrids(orientation, gridX, gridY);
    };
}
