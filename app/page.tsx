"use client";

import { useMemo } from "react";

const SIZE = 15;

export default function Home() {
  const cells = useMemo(
    () =>
      Array.from({ length: SIZE * SIZE }, (_, idx) => {
        const r = Math.floor(idx / SIZE);
        const c = idx % SIZE;
        return <div key={${r}-${c}} className="cell" />;
      }),
    []
  );

  return (
    <div className="screen">
      <div className="sidebar">
        <h2 className="title">LudoBot</h2>
        <button className="dice" type="button">🎲 Roll</button>
      </div>

      <div className="board">{cells}</div>
    </div>
  );
}
