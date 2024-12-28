import { P5CanvasInstance } from "@p5-wrapper/react";

export function secretInternationalClock(p5: P5CanvasInstance) {
    let randomOffset = 0;

    // Use a background that continuously changes color over time.
    const bg = (p5: P5CanvasInstance): [number, number, number] => {
        const speed = 0.005;
        const base = 120;
        const range = 135;
        const r = base + range * Math.abs(Math.sin(p5.frameCount * speed));
        const g = base + range * Math.abs(Math.sin((p5.frameCount * speed) + Math.PI / 3));
        const b = base + range * Math.abs(Math.sin((p5.frameCount * speed) + (2 * Math.PI) / 3));
        return [r, g, b];
    };

    // Generate possible offsets in 15-min increments from -12 to +14
    const generateOffsetArray = (): number[] => {
        let offsets: number[] = [];
        for (let offset = -12; offset <= 14; offset += 0.25) {
            // Round to avoid floating-point quirks
            offsets.push(Math.round(offset * 100) / 100);
        }
        return offsets;
    };

    // Given a local Date, convert it to a new Date with a random offset (in hours).
    const getTimeWithOffset = (date: Date, offset: number): Date => {
        // 1) Convert local time to “UTC time” (ms)
        let utcMillis = date.getTime() + date.getTimezoneOffset() * 60_000;
        // 2) Add the offset in hours (converted to ms)
        let offsetMillis = offset * 3600_000;
        // 3) Create and return new date
        return new Date(utcMillis + offsetMillis);
    };

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(Math.min(32, p5.windowWidth / 20));
        p5.textFont("Courier New");

        // Pick a random offset at the start (but don’t show it!)
        const offsets = generateOffsetArray();
        randomOffset = p5.random(offsets);
    };

    p5.draw = () => {
        p5.background(bg(p5));

        // HEADLINE
        p5.fill(0);
        p5.textSize(Math.min(40, p5.windowWidth / 15));
        p5.text("INTERNATIONAL CLOCK", p5.width / 2, p5.height / 4);

        // Create a new date for the “secret offset”
        let now = new Date();
        let offsetTime = getTimeWithOffset(now, randomOffset);

        // Extract hours/minutes/seconds
        let h = offsetTime.getHours();
        let m = offsetTime.getMinutes();
        let s = offsetTime.getSeconds();

        // Format HH:MM:SS with zero-pads
        let hh = h < 10 ? "0" + h : h;
        let mm = m < 10 ? "0" + m : m;
        let ss = s < 10 ? "0" + s : s;

        // Display the “local” time in that secret offset
        p5.textSize(Math.min(32, p5.windowWidth / 20));
        p5.fill(0);
        p5.text(`${hh}:${mm}:${ss}`, p5.width / 2, p5.height / 2);

        // Instead of showing the actual offset or time zone, we keep it hush-hush:
        p5.fill(50);
        p5.textSize(Math.min(20, p5.windowWidth / 25));
        p5.text("Time Zone: [CLASSIFIED]", p5.width / 2, p5.height / 2 + 60);
    };

    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        p5.textSize(Math.min(32, p5.windowWidth / 20));
    };
}
