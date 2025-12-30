"use client";

export default function Home() {
  const size = 15;

  const getCellClass = (r: number, c: number) => {
    // Center 3x3 (we keep it white; center overlay alag se hai)
    if (r >= 6 && r <= 8 && c >= 6 && c <= 8) return "cell white";

    // ===== HOMES (6x6 corners) with white 4x4 center =====
    // Blue (Top-Left)
    if (r <= 5 && c <= 5) {
      if (r >= 1 && r <= 4 && c >= 1 && c <= 4) return "cell white";
      return "cell blue";
    }
    // Yellow (Top-Right)
    if (r <= 5 && c >= 9) {
      if (r >= 1 && r <= 4 && c >= 10 && c <= 13) return "cell white";
      return "cell yellow";
    }
    // Red (Bottom-Left)
    if (r >= 9 && c <= 5) {
      if (r >= 10 && r <= 13 && c >= 1 && c <= 4) return "cell white";
      return "cell red";
    }
    // Green (Bottom-Right)
    if (r >= 9 && c >= 9) {
      if (r >= 10 && r <= 13 && c >= 10 && c <= 13) return "cell white";
      return "cell green";
    }

    // ===== COLORED LANES (towards center) =====
    // Yellow lane (top to center)
    if (c === 7 && r >= 0 && r <= 5) return "cell yellow";
    // Green lane (bottom to center)
    if (c === 7 && r >= 9 && r <= 14) return "cell green";
    // Red lane (left to center)
    if (r === 7 && c >= 0 && c <= 5) return "cell red";
    // Blue lane (right to center)
    if (r === 7 && c >= 9 && c <= 14) return "cell blue";

    // बाकी सब white
    return "cell white";
  };

  const cells = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      cells.push(
        <div key={${r}-${c}} className={getCellClass(r, c)} />
      );
    }
  }

  return (
    <div className="screen">
      <div className="sidebar">
        <h2>LudoBot</h2>
        <p>Board colors + lanes ✅</p>
      </div>

      <div className="board">
        {cells}
        <div className="center"></div>
      </div>
    </div>
  );
}
