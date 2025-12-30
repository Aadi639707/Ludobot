"use client";
import { useState } from "react";

export default function Home() {
  const [redPos, setRedPos] = useState(0);

  function rollDice() {
    const dice = Math.floor(Math.random() * 6) + 1;
    setRedPos(redPos + dice);
  }

  return (
    <div className="screen">
      <button className="dice" onClick={rollDice}>🎲 Roll</button>

      <div className="board">
        <div className="token redToken" style={{ left: redPos * 30 }}></div>
      </div>
    </div>
  );
}
