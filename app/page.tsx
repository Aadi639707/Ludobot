"use client";

import { useState } from "react";

export default function Home() {
  const [dice, setDice] = useState(1);
  const [pos, setPos] = useState(0);

  function rollDice() {
    const d = Math.floor(Math.random() * 6) + 1;
    setDice(d);
    setPos(p => Math.min(p + d, 56));
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0f172a", color: "white", padding: 20 }}>
      <h1 style={{ fontSize: 32 }}>🎲 LudoBot</h1>

      <p>Dice: {dice}</p>
      <p>Token Position: {pos}</p>

      <button
        onClick={rollDice}
        style={{
          padding: 12,
          background: "#22c55e",
          color: "black",
          borderRadius: 10,
          fontSize: 18
        }}
      >
        Roll Dice
      </button>

      <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(8, 40px)", gap: 4 }}>
        {Array.from({ length: 56 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 40,
              height: 40,
              background: i === pos ? "red" : "#1e293b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12
            }}
          >
            {i}
          </div>
        ))}
      </div>
    </main>
  );
}
