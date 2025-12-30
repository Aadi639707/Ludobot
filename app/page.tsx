"use client";

import { useMemo, useState } from "react";

type Player = 0 | 1; // 0 = Red, 1 = Blue

const SIZE = 15;
const SAFE_CELLS = new Set([1, 8, 13, 36, 41, 46, 53, 58]); // demo safe cells (change later)

// Helpers
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function Home() {
  const cells = useMemo(() => Array.from({ length: SIZE * SIZE }, (_, i) => i), []);

  const [dice, setDice] = useState<number>(1);
  const [turn, setTurn] = useState<Player>(0);
  const [msg, setMsg] = useState<string>("Roll to start");

  // Simple demo paths (not full Ludo yet, just to see movement)
  // We will replace with real Ludo paths later.
  const [pos, setPos] = useState<{ red: number; blue: number }>({ red: 0, blue: 0 });

  const rollDice = () => {
    const n = Math.floor(Math.random() * 6) + 1;
    setDice(n);
    setMsg(Rolled ${n}. Tap MOVE);
  };

  const move = () => {
    const step = dice;

    if (turn === 0) {
      const next = clamp(pos.red + step, 0, SIZE * SIZE - 1);
      setPos((p) => ({ ...p, red: next }));
      setMsg(Red moved +${step});
    } else {
      const next = clamp(pos.blue + step, 0, SIZE * SIZE - 1);
      setPos((p) => ({ ...p, blue: next }));
      setMsg(Blue moved +${step});
    }

    setTurn((t) => (t === 0 ? 1 : 0));
  };

  const reset = () => {
    setDice(1);
    setTurn(0);
    setPos({ red: 0, blue: 0 });
    setMsg("Reset done. Roll to start");
  };

  return (
    <div className="app">
      <aside className="left">
        <div className="brand">
          <div className="logo">LudoBot</div>
          <div className="sub">Demo board + dice + 2 players</div>
        </div>

        <div className="panel">
          <div className="row">
            <span className="label">Turn</span>
            <span className={pill ${turn === 0 ? "red" : "blue"}}>{turn === 0 ? "RED" : "BLUE"}</span>
          </div>

          <div className="row">
            <span className="label">Dice</span>
            <span className="dice">{dice}</span>
          </div>

          <div className="btnRow">
            <button className="btn primary" onClick={rollDice}>🎲 Roll</button>
            <button className="btn" onClick={move}>➡️ Move</button>
          </div>

          <button className="btn ghost" onClick={reset}>↩ Reset</button>

          <div className="msg">{msg}</div>

          <div className="mini">
            <div className="miniRow">
              <span className="dot redDot" /> Red pos: <b>{pos.red}</b>
            </div>
            <div className="miniRow">
              <span className="dot blueDot" /> Blue pos: <b>{pos.blue}</b>
            </div>
          </div>
        </div>

        <div className="hint">
          Abhi ye full Ludo rules nahi hai — sirf “dice + move + board render” properly.  
          Next step me hum real ludo path + 4 tokens each + home/finish banayenge.
        </div>
      </aside>

      <main className="right">
        <div className="board">
          {cells.map((idx) => {
            const isSafe = SAFE_CELLS.has(idx);
            const hasRed = idx === pos.red;
            const hasBlue = idx === pos.blue;

            return (
              <div key={idx} className={cell ${isSafe ? "safe" : ""}}>
                {(hasRed || hasBlue) && (
                  <div className="tokens">
                    {hasRed && <span className="token redToken" />}
                    {hasBlue && <span className="token blueToken" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
              }
