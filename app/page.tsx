"use client";

export default function Home() {
  const SIZE = 15;
  const cells = [];

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      cells.push(
        <div key={${r}-${c}} className="cell"></div>
      );
    }
  }

  return (
    <div className="screen">
      <div className="sidebar">
        <h2 className="title">LudoBot</h2>
        <button className="dice">🎲 Roll</button>
      </div>

      <div className="board">
        {cells}
      </div>
    </div>
  );
          }
