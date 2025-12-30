"use client";

export default function Home() {
  const cells = [];

  for (let i = 0; i < 225; i++) {
    cells.push(<div key={i} className="cell white"></div>);
  }

  return (
    <div className="screen">
      <div className="sidebar">
        <h2>LudoBot</h2>
        <p>Board loading…</p>
      </div>

      <div className="board">
        {cells}
        <div className="center"></div>
      </div>
    </div>
  );
}
