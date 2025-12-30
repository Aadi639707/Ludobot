export default function Home() {
  const cells = [];

  for (let i = 7; i <= 9; i++) {
    for (let j = 1; j <= 15; j++) {
      cells.push({ row: j, col: i });
      cells.push({ row: i, col: j });
    }
  }

  return (
    <div className="screen">
      <div className="board">

        {/* Homes */}
        <div className="cell blue" style={{ gridColumn: "1/7", gridRow: "1/7" }} />
        <div className="cell yellow" style={{ gridColumn: "10/16", gridRow: "1/7" }} />
        <div className="cell red" style={{ gridColumn: "1/7", gridRow: "10/16" }} />
        <div className="cell green" style={{ gridColumn: "10/16", gridRow: "10/16" }} />

        {/* Path */}
        {cells.map((c, i) => (
          <div
            key={i}
            className="cell"
            style={{
              gridColumn: c.col,
              gridRow: c.row,
              background: "#e5e7eb"
            }}
          />
        ))}

        {/* Center */}
        <div className="center" />

      </div>
    </div>
  );
}
