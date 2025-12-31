"use client";

import { useState } from "react";

export default function Page() {
  const [dice, setDice] = useState(0);
  const [turn, setTurn] = useState("RED");
  const [message, setMessage] = useState("Press Roll to start");

  function rollDice() {
    const d = Math.floor(Math.random() * 6) + 1;
    setDice(d);

    if (d === 6) {
      setMessage(turn + " rolled " + d + " and gets another turn!");
    } else {
      const next = turn === "RED" ? "BLUE" : "RED";
      setTurn(next);
      setMessage(turn + " rolled " + d + ". Now " + next + "'s turn");
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#111", color: "#fff", padding: 20 }}>
      <h1 style={{ fontSize: 32 }}>🎲 Ludo Dice Bot</h1>

      <div style={{ marginTop: 20 }}>
        <h2>Turn: {turn}</h2>
        <h2>Dice: {dice === 0 ? "-" : dice}</h2>
        <p>{message}</p>

        <button
          onClick={rollDice}
          style={{
            padding: "15px 30px",
            background: "#22c55e",
            border: "none",
            color: "black",
            fontSize: 18,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          🎲 Roll Dice
        </button>
      </div>
    </main>
  );
}
