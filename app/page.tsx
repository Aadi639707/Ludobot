"use client";
import { useState } from "react";

export default function Home() {
  const [redPos, setRedPos] = useState(0);

  function rollDice() {
    const dice = Math.floor(Math.random() * 6) + 1;
    setRedPos(prev => prev + dice);
  }

  return (
    <div className="screen">
      <button className="dice" onClick={rollDice}>🎲 Roll</button>

      <div className="board">

        {/* Top */}
        <div className="home blue"></div>
        <div className="path"></div>
        <div className="home yellow"></div>

        {/* Middle */}
        <div className="path"></div>
        <div className="center">
          <div className="token redToken" style={{transform:translateX(${redPos*20}px)}}></div>
        </div>
        <div className="path"></div>

        {/* Bottom */}
        <div className="home red"></div>
        <div className="path"></div>
        <div className="home green"></div>

      </div>
    </div>
  );
}
