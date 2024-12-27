import './App.css'
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { clock1 } from "./clocks/1";

export default function App() {
  return <ReactP5Wrapper sketch={clock1} />;
}