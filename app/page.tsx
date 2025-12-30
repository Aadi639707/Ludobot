"use client";

import { useMemo, useState } from "react";

const SIZE = 15;

function cellType(r: number, c: number) {
  // 6x6 homes
  if (r <= 5 && c <= 5) return "blue";
  if (r <= 5 && c >= 9) return "yellow";
  if (r >= 9 && c <= 5) return "red";
  if (r >= 9 && c >= 9) return "green";

  // center cross (simple path)
  const cross = r === 7 || c === 7;
  if (cross) return "path";

  return "empty";
}

export default function Home() {
  const [dice, setDice] = useState(1);
  const [pos, setPos] = useState(0);

  const cells = useMemo(() => {
    return Array.from({ length: SIZE * SIZE }, (_, idx) => {
      const r = Math.floor(idx / SIZE);
      const c = idx % SIZE;
      const type = cellType(r, c);
      return { r, c, type, key: ${r}-${c} };
    });
  }, []);

  const path = useMemo(() => {
    // simple cross path order: left->right then top->bottom (demo)
    const p: string[] = [];
    for (let c = 0; c < SIZE; c++) p.push(7-${c});
    for (let r = 0; r < SIZE; r++) if (r !== 7) p.push(${r}-7);
    return p;
  }, []);

  function roll() {
    const d = Math.floor(Math.random() * 6) + 1;
    setDice(d);
    setPos((p) => Math.min(p + d, path.length - 1));
  }

  const tokenKey = path[pos];

  return (
    <div className="wrap">
      <header className="top">
        <div>
          <div className="brand">🎲 LudoBot</div>
          <div className="sub">Fast, clean ludo experience — multiplayer coming soon.</div>
        </div>

        <div className="actions">
          <button className="btn" onClick={roll}>Roll Dice</button>
          <div className="pill">Dice: <b>{dice}</b></div>
          <button className="btn ghost" type="button">Create Room (Soon)</button>
        </div>
      </header>

      <main className="main">
        <section className="boardCard">
          <div className="board">
            {cells.map((cell) => {
              const isToken = cell.key === tokenKey;
              return (
                <div key={cell.key} className={cell ${cell.type}}>
                  {isToken ? <span className="token redTok" /> : null}
                </div>
              );
            })}
          </div>

          <div className="hint">
            Demo mode: token moves on a simple cross-path. Next step: real ludo track + 4 players.
          </div>
        </section>

        <section className="sideCard">
          <h3>What’s next</h3>
          <ul>
            <li>✅ Clean board UI</li>
            <li>✅ Dice + movement demo</li>
            <li>⬜ Real ludo track (52 steps)</li>
            <li>⬜ Play vs Computer</li>
            <li>⬜ Friends rooms (online)</li>
          </ul>

          <div className="ctaRow">
            <button className="btn" onClick={roll}>Try Another Roll</button>
            <button className="btn ghost" type="button">Share Link</button>
          </div>
        </section>
      </main>

      <footer className="foot">
        Built on Next.js • Future-ready for multiplayer rooms
      </footer>
    </div>
  );
}
