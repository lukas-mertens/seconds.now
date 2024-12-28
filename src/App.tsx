import './App.css';
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { clock1 } from "./clocks/1";
import { useEffect, useState } from "react";
import { secretInternationalClock } from "./clocks/2.tsx";
import { colorClockLegend } from "./clocks/3.tsx";
import { useLocation, useNavigate } from "react-router-dom";

const availableClocks = [clock1, secretInternationalClock, colorClockLegend];

export default function App() {
  const [currentClock, setCurrentClock] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const clockIndex = parseInt(path.slice(1), 10);

    if (!isNaN(clockIndex) && clockIndex >= 0 && clockIndex < availableClocks.length) {
      setCurrentClock(clockIndex);
    } else {
      const randomClock = Math.floor(Math.random() * availableClocks.length);
      setCurrentClock(randomClock);
      navigate(`/${randomClock}`, {replace: true});
    }
  }, [location.pathname, history]);

  if (currentClock === null) return null; // Or a loading state

  return <ReactP5Wrapper sketch={availableClocks[currentClock]} />;
}
