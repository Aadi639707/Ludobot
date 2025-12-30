"use client";

const SIZE = 15;

export default function Home() {
  return (
    <div className="screen">
      <div className="sidebar">
        <h2 className="title">LudoBot</h2>
        <button className="dice">🎲 Roll</button>
      </div>

      <div className="board">
        {Array.from({ length: SIZE * SIZE }).map((_, idx) => (
          <div key={idx} className="cell" />
        ))}
      </div>
    </div>
  );
}
