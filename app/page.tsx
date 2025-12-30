"use client";

export default function Home() {
  const size = 15;
  const cells: JSX.Element[] = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      cells.push(<div key={${r}-${c}} className="cell" />);
    }
  }

  return (
    <div className="screen">
      <div className="sidebar">
        <h2 className="title">LudoBot</h2>
        <button className="dice">Roll</button>
      </div>

      <div className="board">{cells}</div>
    </div>
  );
}
