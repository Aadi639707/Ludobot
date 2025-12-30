"use client";

const SIZE = 15;

// helper: center cross + safe-ish path look
function cellType(r: number, c: number) {
  const mid = 7;

  // center 3x3
  if (r >= 6 && r <= 8 && c >= 6 && c <= 8) return "center";

  // home 6x6 corners
  if (r < 6 && c < 6) return "home red";
  if (r < 6 && c > 8) return "home green";
  if (r > 8 && c < 6) return "home yellow";
  if (r > 8 && c > 8) return "home blue";

  // cross paths (3-wide)
  const inRowBand = r >= 6 && r <= 8;
  const inColBand = c >= 6 && c <= 8;

  // horizontal path
  if (inRowBand && (c <= 5  c >= 9)) return "path";
  // vertical path
  if (inColBand && (r <= 5  r >= 9)) return "path";

  // arrows (just visual)
  if (r === 7 && c === 1) return "path red";
  if (r === 1 && c === 7) return "path green";
  if (r === 13 && c === 7) return "path yellow";
  if (r === 7 && c === 13) return "path blue";

  return "empty";
}

export default function Home() {
  return (
    <div className="screen">
      <div className="sidebar">
        <h2 className="title">LudoBot</h2>
        <button className="dice">🎲 Roll</button>
      </div>

      <div className="board">
        {Array.from({ length: SIZE * SIZE }).map((_, idx) => {
          const r = Math.floor(idx / SIZE);
          const c = idx % SIZE;
          const type = cellType(r, c);
          return <div key={${r}-${c}} className={cell ${type}} />;
        })}
      </div>
    </div>
  );
}
