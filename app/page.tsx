export default function Home() {
  const path = [];

  // Vertical
  for (let r = 1; r <= 15; r++) path.push({ r, c: 8 });
  // Horizontal
  for (let c = 1; c <= 15; c++) path.push({ r: 8, c });

  const safe = [
    { r: 2, c: 8 },
    { r: 8, c: 2 },
    { r: 14, c: 8 },
    { r: 8, c: 14 },
  ];

  return (
    <div className="screen">
      <div className="board">

        {/* Homes */}
        <div className="cell blue" style={{ gridColumn: "1/7", gridRow: "1/7" }} />
        <div className="cell yellow" style={{ gridColumn: "10/16", gridRow: "1/7" }} />
        <div className="cell red" style={{ gridColumn: "1/7", gridRow: "10/16" }} />
        <div className="cell green" style={{ gridColumn: "10/16", gridRow: "10/16" }} />

        {/* Path */}
        {path.map((p, i) => {
          const isSafe = safe.some(s => s.r === p.r && s.c === p.c);
          return (
            <div
              key={i}
              className="cell"
              style={{
                gridRow: p.r,
                gridColumn: p.c,
                background: isSafe ? "#facc15" : "#e5e7eb"
              }}
            />
          );
        })}

        {/* Center */}
        <div className="center" />
      </div>
    </div>
  );
}
