"use client";
import { useState } from "react";

const path = [
  { r: 8, c: 2 }, { r: 8, c: 3 }, { r: 8, c: 4 }, { r: 8, c: 5 }, { r: 8, c: 6 },
  { r: 7, c: 6 }, { r: 6, c: 6 }, { r: 5, c: 6 }, { r: 4, c: 6 }, { r: 3, c: 6 },
  { r: 2, c: 6 }, { r: 2, c: 7 }, { r: 2, c: 8 }, { r: 2, c: 9 }, { r: 2, c: 10 },
  { r: 3, c: 10 }, { r: 4, c: 10 }, { r: 5, c: 10 }, { r: 6, c: 10 }, { r: 7, c: 10 },
  { r: 8, c: 10 }, { r: 8, c: 11 }, { r: 8, c: 12 }, { r: 8, c: 13 }, { r: 8, c: 14 },
  { r: 9, c: 14 }, { r: 10, c: 14 }, { r: 11, c: 14 }, { r: 12, c: 14 }, { r: 13, c: 14 },
  { r: 14, c: 14 }, { r: 14, c: 13 }, { r: 14, c: 12 }, { r: 14, c: 11 }, { r: 14, c: 10 },
  { r: 13, c: 10 }, { r: 12, c: 10 }, { r: 11, c: 10 }, { r: 10, c: 10 }, { r: 9, c: 10 },
  { r: 8, c: 10 }, { r: 8, c: 9 }, { r: 8, c: 8 }
];

const colors = ["red", "blue", "yellow", "green"];

export default function Home() {
  const [dice, setDice] = useState(1);
  const [turn, setTurn] = useState(0);
  const [pos, setPos] = useState([0, 0, 0, 0]);

  function roll() {
    const d = Math.floor(Math.random() * 6) + 1;
    setDice(d);

    setPos(p => {
      const copy = [...p];
      copy[turn] = Math.min(copy[turn] + d, path.length - 1);
      return copy;
    });

    setTurn(t => (t + 1) % 4);
  }

  return (
    <div className="screen">
      <h2>Turn: {colors[turn].toUpperCase()}</h2>
      <h3>Dice: {dice}</h3>
      <button onClick={roll}>🎲 Roll</button>

      <div className="board">
        {path.map((p, i) => (
          <div
            key={i}
            className="cell"
            style={{ gridRow: p.r, gridColumn: p.c }}
          >
            {pos.map((pp, idx) =>
              pp === i ? (
                <div
                  key={idx}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: colors[idx]
                  }}
                />
              ) : null
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
