"use client";

export default function Home() {
  const SIZE = 15;

  const getClass = (r: number, c: number) => {
    // 4 Homes (6x6 corners)
    if (r <= 5 && c <= 5) return "cell blue";          // Top-left
    if (r <= 5 && c >= 9) return "cell yellow";        // Top-right
    if (r >= 9 && c <= 5) return "cell red";           // Bottom-left
    if (r >= 9 && c >= 9) return "cell green";         // Bottom-right

    // Middle cross path (3 wide)
    if ((c >= 6 && c <= 8) || (r >= 6 && r <= 8)) return "cell path";

    // Default empty white
    return "cell";
  };

  const cells = Array.from({ length: SIZE * SIZE }, (_, idx) => {
    const r = Math.floor(idx / SIZE);
    const c = idx % SIZE;
    return <div key={${r}-${c}} className={getClass(r, c)} />;
  });

  return (
    <div className="screen">
      <div className="sidebar">
        <h2 className="title">🎲 LudoBot</h2>
        <button className="dice" type="button">Roll</button>
        <p style={{ margin: 0, opacity: 0.8, fontSize: 12 }}>
          Homes + lanes ✅
        </p>
      </div>

      <div className="board">{cells}</div>
    </div>
  );
}
