"use client";

export default function Home() {
  const size = 15;
  const cells: JSX.Element[] = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      cells.push(
        <div key={${r}-${c}} className="cell white"></div>
      );
    }
  }

  return (
    <div className="screen">
      <div className="sidebar">
        <h2>LudoBot</h2>
        <p>Board setup</p>
      </div>

      <div className="board">
        {cells}
      </div>
    </div>
  );
          }
