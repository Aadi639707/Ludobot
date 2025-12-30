"use client";

import { useMemo, useState } from "react";

const SIZE = 15;

export default function Home() {
  const [dice, setDice] = useState<number>(1);

  const cells = useMemo(() => {
    return Array.from({ length: SIZE * SIZE }, (_, idx) => {
      const r = Math.floor(idx / SIZE);
      const c = idx % SIZE;

      // Demo styling: center 3x3 ko highlight
      const isCenter = r >= 6 && r <= 8 && c >= 6 && c <= 8;

      const cls = cell ${isCenter ? "center" : ""};

      return <div key={${r}-${c}} className={cls} />;
    });
  }, []);

  function rollDice() {
    setDice(Math.floor(Math.random() * 6) + 1);
  }

  return (
    <div className="screen">
      <div className="sidebar">
        <h2 className="title">LudoBot</h2>

        <button className="dice" onClick={rollDice}>
          🎲 Roll: {dice}
        </button>
      </div>

      <div className="board">{cells}</div>
    </div>
  );
}
