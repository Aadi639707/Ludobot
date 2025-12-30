"use client";

import React, { useMemo, useState } from "react";

/**
 * CORE LUDO RULES (offline/local):
 * - 2–4 players
 * - 4 tokens each
 * - Roll 6 to enter
 * - 52 main track + 6 home stretch + finish
 * - Safe cells (no capture)
 * - Capture sends token back to yard
 * - Blocks (2+ tokens on a cell) cannot be landed on or passed through
 * - Extra turn on 6 and on capture
 * - Win when 4 tokens finished
 *
 * UI: simplified track strip + home rows (not full Ludo King board art).
 */

type PlayerId = 0 | 1 | 2 | 3;
type Phase = "setup" | "playing" | "finished";

const PLAYERS: { id: PlayerId; name: string; color: string; startIndex: number }[] = [
  { id: 0, name: "Red", color: "#ff3b30", startIndex: 0 },
  { id: 1, name: "Green", color: "#22c55e", startIndex: 13 },
  { id: 2, name: "Yellow", color: "#eab308", startIndex: 26 },
  { id: 3, name: "Blue", color: "#0a84ff", startIndex: 39 },
];

// Standard-ish safe global indices on the 52 track (you can tweak later)
const SAFE_GLOBAL = new Set<number>([0, 8, 13, 21, 26, 34, 39, 47]);

// Token position encoding (per player):
// -1 = in yard (home)
// 0..51 = progress on main track
// 52..57 = progress in home stretch (6 cells)
// 58 = finished
type TokenPos = number;

type GameState = {
  phase: Phase;
  numPlayers: 2 | 3 | 4;
  turn: PlayerId; // whose turn
  dice: number | null;
  message: string;
  tokens: Record<PlayerId, TokenPos[]>; // 4 tokens each
  lastRollWasSix: boolean;
};

function nextActivePlayer(numPlayers: 2 | 3 | 4, current: PlayerId): PlayerId {
  const order: PlayerId[] = [0, 1, 2, 3];
  const allowed = order.slice(0, numPlayers);
  const idx = allowed.indexOf(current);
  return allowed[(idx + 1) % allowed.length];
}

function isSafeGlobal(globalIdx: number) {
  return SAFE_GLOBAL.has(globalIdx);
}

// Convert player-relative progress (0..51) to global track index 0..51
function relToGlobal(player: PlayerId, rel: number) {
  const start = PLAYERS[player].startIndex;
  return (start + rel) % 52;
}

// Count tokens on a global main-track cell (progress 0..51 only)
function tokensOnGlobalCell(gs: GameState, globalIdx: number) {
  const counts: { byPlayer: Record<PlayerId, number>; total: number } = {
    byPlayer: { 0: 0, 1: 0, 2: 0, 3: 0 },
    total: 0,
  };

  for (const p of [0, 1, 2, 3] as PlayerId[]) {
    for (const pos of gs.tokens[p]) {
      if (pos >= 0 && pos <= 51) {
        const g = relToGlobal(p, pos);
        if (g === globalIdx) {
          counts.byPlayer[p] += 1;
          counts.total += 1;
        }
      }
    }
  }
  return counts;
}

// If there is an opponent block (>=2) on some global cell, movement cannot pass through it.
function hasBlockingCellOnPath(gs: GameState, mover: PlayerId, fromRel: number, toRel: number) {
  // only relevant for main track moves within 0..51
  if (!(fromRel >= 0 && fromRel <= 51 && toRel >= 0 && toRel <= 51)) return false;
  if (toRel <= fromRel) return false; // (we never wrap in rel-space; rel increases monotonically)

  // iterate intermediate steps excluding start, including destination?
  // In Ludo, you cannot land on opponent block either. We'll check both intermediate and destination.
  for (let step = fromRel + 1; step <= toRel; step++) {
    const g = relToGlobal(mover, step);
    const counts = tokensOnGlobalCell(gs, g);

    // opponent block exists
    for (const op of [0, 1, 2, 3] as PlayerId[]) {
      if (op !== mover && counts.byPlayer[op] >= 2) return true;
    }
  }
  return false;
}

function computeLegalMoves(gs: GameState, player: PlayerId, dice: number) {
  const moves: { tokenIndex: number; to: TokenPos; capture: boolean }[] = [];

  const myTokens = gs.tokens[player];

  for (let i = 0; i < 4; i++) {
    const pos = myTokens[i];

    // finished can't move
    if (pos === 58) continue;

    // in yard -> can only enter on 6
    if (pos === -1) {
      if (dice !== 6) continue;

      const entryRel = 0; // enters at relative progress 0
      const entryGlobal = relToGlobal(player, entryRel);

      const counts = tokensOnGlobalCell(gs, entryGlobal);

// cannot land if opponent block
      for (const op of [0, 1, 2, 3] as PlayerId[]) {
        if (op !== player && counts.byPlayer[op] >= 2) {
          // blocked
          continue;
        }
      }

      // capture if single opponent token and not safe
      let capture = false;
      if (!isSafeGlobal(entryGlobal)) {
        for (const op of [0, 1, 2, 3] as PlayerId[]) {
          if (op !== player && counts.byPlayer[op] === 1) capture = true;
        }
      }
      moves.push({ tokenIndex: i, to: entryRel, capture });
      continue;
    }

    // on main track 0..51
    if (pos >= 0 && pos <= 51) {
      const toRel = pos + dice;

      // entering home stretch
      if (toRel === 52) {
        // exact to first home cell (52)
        moves.push({ tokenIndex: i, to: 52, capture: false });
        continue;
      }
      if (toRel > 52) {
        const homeTo = pos + dice; // 53..?
        if (homeTo <= 57) {
          moves.push({ tokenIndex: i, to: homeTo, capture: false });
        } else if (homeTo === 58) {
          moves.push({ tokenIndex: i, to: 58, capture: false }); // finish exact
        } else {
          // overshoot finish not allowed
        }
        continue;
      }

      // normal main-track move within 0..51
      if (toRel <= 51) {
        // blocks: cannot pass/land on opponent block
        if (hasBlockingCellOnPath(gs, player, pos, toRel)) continue;

        const destGlobal = relToGlobal(player, toRel);
        const counts = tokensOnGlobalCell(gs, destGlobal);

        // cannot land on opponent block
        let blocked = false;
        for (const op of [0, 1, 2, 3] as PlayerId[]) {
          if (op !== player && counts.byPlayer[op] >= 2) blocked = true;
        }
        if (blocked) continue;

        // capture if single opponent token and not safe
        let capture = false;
        if (!isSafeGlobal(destGlobal)) {
          for (const op of [0, 1, 2, 3] as PlayerId[]) {
            if (op !== player && counts.byPlayer[op] === 1) capture = true;
          }
        }
        moves.push({ tokenIndex: i, to: toRel, capture });
      }
      continue;
    }

    // home stretch 52..57
    if (pos >= 52 && pos <= 57) {
      const to = pos + dice;
      if (to <= 57) moves.push({ tokenIndex: i, to, capture: false });
      else if (to === 58) moves.push({ tokenIndex: i, to: 58, capture: false });
      // overshoot not allowed
      continue;
    }
  }

  return moves;
}

function applyMove(gs: GameState, player: PlayerId, tokenIndex: number, to: TokenPos) {
  const dice = gs.dice ?? 0;
  const tokens = structuredClone(gs.tokens) as GameState["tokens"];
  const from = tokens[player][tokenIndex];

  let captured = false;

  // If destination is on main track, maybe capture
  if (to >= 0 && to <= 51) {
    const destGlobal = relToGlobal(player, to);
    if (!isSafeGlobal(destGlobal)) {
      const counts = tokensOnGlobalCell(gs, destGlobal);

      // if there is exactly one opponent token on that global cell -> capture it
      for (const op of [0, 1, 2, 3] as PlayerId[]) {
        if (op === player) continue;
        if (counts.byPlayer[op] === 1) {
          // find that opponent token and send to yard
          for (let j = 0; j < 4; j++) {
            const opPos = tokens[op][j];
            if (opPos >= 0 && opPos <= 51) {
              if (relToGlobal(op, opPos) === destGlobal) {
                tokens[op][j] = -1;
                captured = true;
                break;
              }
            }
          }
        }
      }
    }
  }

  // move token
  tokens[player][tokenIndex] = to;

  // check winner
  const finishedCount = tokens[player].filter((p) => p === 58).length;
  const winner = finishedCount === 4;

  // extra turn conditions
  const extraTurn = dice === 6 || captured;

  return {
    tokens,
    captured,
    extraTurn,
    winner,
    from,
  };
}

function newGame(numPlayers: 2 | 3 | 4): GameState {
  return {
    phase: "playing",
    numPlayers,
    turn: 0,
    dice: null,
    message: "Roll the dice to start.",

tokens: {
      0: [-1, -1, -1, -1],
      1: [-1, -1, -1, -1],
      2: [-1, -1, -1, -1],
      3: [-1, -1, -1, -1],
    },
    lastRollWasSix: false,
  };
}

export default function Page() {
  const [gs, setGs] = useState<GameState>(() => ({
    phase: "setup",
    numPlayers: 2,
    turn: 0,
    dice: null,
    message: "Choose players and start.",
    tokens: { 0: [-1, -1, -1, -1], 1: [-1, -1, -1, -1], 2: [-1, -1, -1, -1], 3: [-1, -1, -1, -1] },
    lastRollWasSix: false,
  }));

  const activePlayers = useMemo(() => PLAYERS.slice(0, gs.numPlayers), [gs.numPlayers]);

  const legalMoves = useMemo(() => {
    if (gs.phase !== "playing") return [];
    if (gs.dice == null) return [];
    return computeLegalMoves(gs, gs.turn, gs.dice);
  }, [gs]);

  function start() {
    setGs(newGame(gs.numPlayers));
  }

  function roll() {
    setGs((prev) => {
      if (prev.phase !== "playing") return prev;
      // prevent reroll without moving/passing
      if (prev.dice != null) return { ...prev, message: "Choose a move or Pass." };

      const d = Math.floor(Math.random() * 6) + 1;
      const moves = computeLegalMoves(prev, prev.turn, d);
      const d = Math.floor(Math.random() * 6) + 1;
const moves = computeLegalMoves(prev, prev.turn, d);

const msg = moves.length
  ? Rolled ${d}. Choose a token to move.
  : Rolled ${d}. No moves. Tap Pass.;

return { ...prev, dice: d, message: msg, lastRollWasSix: d === 6 };
      return { ...prev, dice: d, message: msg, lastRollWasSix: d === 6 };
    });
  }

  function passTurn() {
    setGs((prev) => {
      if (prev.phase !== "playing") return prev;
      if (prev.dice == null) return { ...prev, message: "Roll first." };

      const next = nextActivePlayer(prev.numPlayers, prev.turn);
      return { ...prev, turn: next, dice: null, message: "Turn passed. Roll." };
    });
  }

  function doMove(tokenIndex: number, to: TokenPos) {
    setGs((prev) => {
      if (prev.phase !== "playing") return prev;
      if (prev.dice == null) return prev;

      const lm = computeLegalMoves(prev, prev.turn, prev.dice);
      const ok = lm.find((m) => m.tokenIndex === tokenIndex && m.to === to);
      if (!ok) return { ...prev, message: "Illegal move (refresh moves)." };

      const res = applyMove(prev, prev.turn, tokenIndex, to);

      if (res.winner) {
        return {
          ...prev,
          tokens: res.tokens,
          phase: "finished",
          message: ${PLAYERS[prev.turn].name} wins! 🎉,
        };
      }

      if (res.extraTurn) {
        return {
          ...prev,
          tokens: res.tokens,
          dice: null,
          message: res.captured ? "Captured! Extra turn. Roll again." : "Extra turn (rolled 6). Roll again.",
        };
      }

      const next = nextActivePlayer(prev.numPlayers, prev.turn);
      return {
        ...prev,
        tokens: res.tokens,
        turn: next,
        dice: null,
        message: "Next player's turn. Roll.",
      };
    });
  }

  function reset() {
    setGs((prev) => ({
      ...prev,
      phase: "setup",
      dice: null,
      turn: 0,
      message: "Choose players and start.",
      tokens: { 0: [-1, -1, -1, -1], 1: [-1, -1, -1, -1], 2: [-1, -1, -1, -1], 3: [-1, -1, -1, -1] },
    }));
  }

  // Render: simplified main track (52) + home stretches (6 each) + yard/finished counters
  const trackCells = useMemo(() => Array.from({ length: 52 }, (_, i) => i), []);
  const homeCells = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);

  function tokensAtGlobal(globalIdx: number) {
    const here: { p: PlayerId; count: number }[] = [];
    for (const p of [0, 1, 2, 3] as PlayerId[]) {
      let count = 0;
      for (const pos of gs.tokens[p]) {
        if (pos >= 0 && pos <= 51 && relToGlobal(p, pos) === globalIdx) count++;
      }
      if (count) here.push({ p, count });
    }
    return here;
  }

  function tokensAtHomeCell(p: PlayerId, homeIdx0to5: number) {
    // home positions are 52..57
    const target = 52 + homeIdx0to5;
    const count = gs.tokens[p].filter((x) => x === target).length;
    return count;
  }

  function yardCount(p: PlayerId) {
    return gs.tokens[p].filter((x) => x === -1).length;
  }

function finishedCount(p: PlayerId) {
    return gs.tokens[p].filter((x) => x === 58).length;
  }

  return (
    <div className="wrap">
      <style jsx global>{
        *{box-sizing:border-box}
        body{margin:0;background:#0b0f14;color:#e8eef6;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial}
        .wrap{max-width:1100px;margin:0 auto;padding:16px;display:grid;gap:14px}
        .top{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start;justify-content:space-between}
        .card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:14px}
        .title{font-weight:900;font-size:22px;margin:0}
        .sub{opacity:.75;font-size:13px;margin-top:6px}
        .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
        .btn{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#e8eef6;border-radius:12px;padding:10px 12px;font-weight:800}
        .btn.primary{background:#22c55e;border-color:#22c55e;color:#05210f}
        .btn.danger{background:transparent}
        .btn:disabled{opacity:.5}
        .pill{padding:6px 10px;border-radius:999px;font-size:12px;font-weight:900;border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.25)}
        .msg{margin-top:10px;opacity:.9;font-size:14px}
        .grid{display:grid;gap:10px}
        .track{display:grid;grid-template-columns:repeat(13,1fr);gap:6px}
        .cell{min-height:34px;border-radius:12px;border:1px solid rgba(0,0,0,.08);background:rgba(255,255,255,.10);display:flex;align-items:center;justify-content:center;position:relative}
        .cell.safe{outline:2px solid rgba(255,255,255,.18)}
        .tag{position:absolute;bottom:3px;right:6px;font-size:10px;opacity:.6}
        .tokens{display:flex;gap:4px;flex-wrap:wrap;justify-content:center;padding:4px}
        .tok{width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,.85);box-shadow:0 10px 18px rgba(0,0,0,.35)}
        .mini{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
        .phead{display:flex;align-items:center;justify-content:space-between;gap:10px}
        .pname{display:flex;align-items:center;gap:8px;font-weight:900}
        .dot{width:10px;height:10px;border-radius:50%}
        .moves{display:flex;flex-direction:column;gap:8px}
        .moveBtn{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#e8eef6;font-weight:800}
        .moveBtn small{opacity:.7;font-weight:700}
        @media (max-width:900px){
          .track{grid-template-columns:repeat(8,1fr)}
          .mini{grid-template-columns:1fr}
        }
      }</style>

      <div className="top">
        <div className="card" style={{ flex: 1, minWidth: 280 }}>
          <h1 className="title">🎲 LudoBot (Core Rules)</h1>
          <div className="sub">Offline/local complete rules engine. UI is simplified (polish later).</div>

          {gs.phase === "setup" ? (
            <>
              <div className="row" style={{ marginTop: 12 }}>
                <span className="pill">Players</span>
                {[2, 3, 4].map((n) => (
                  <button
                    key={n}
                    className="btn"
                    onClick={() => setGs((p) => ({ ...p, numPlayers: n as 2 | 3 | 4 }))}
                    style={{
                      borderColor: gs.numPlayers === n ? "#22c55e" : undefined,
                    }}
                  >
                    {n}
                  </button>
                ))}

<button className="btn primary" onClick={start}>
                  Start Game
                </button>
              </div>
              <div className="msg">{gs.message}</div>
            </>
          ) : (
            <>
              <div className="row" style={{ marginTop: 12 }}>
                <span className="pill">
                  Turn: <b>{PLAYERS[gs.turn].name}</b>
                </span>
                <span className="pill">Dice: <b>{gs.dice ?? "-"}</b></span>
                <button className="btn primary" onClick={roll} disabled={gs.phase !== "playing"  gs.dice != null}>
                  🎲 Roll
                </button>
                <button className="btn" onClick={passTurn} disabled={gs.phase !== "playing"  gs.dice == null}>
                  Pass
                </button>
                <button className="btn danger" onClick={reset}>Reset</button>
              </div>
              <div className="msg">{gs.message}</div>
            </>
          )}
        </div>

        <div className="card" style={{ width: 340, minWidth: 280 }}>
          <div className="phead">
            <div className="pname">
              <span className="dot" style={{ background: PLAYERS[gs.turn].color }} />
              {gs.phase === "setup" ? "Moves" : ${PLAYERS[gs.turn].name} moves}
            </div>
            <span className="pill">{gs.phase === "finished" ? "Finished" : "Live"}</span>
          </div>

          {gs.phase !== "playing" ? (
            <div className="sub" style={{ marginTop: 10 }}>
              Start the game, then Roll. If no legal moves, press Pass.
            </div>
          ) : gs.dice == null ? (
            <div className="sub" style={{ marginTop: 10 }}>Roll to get moves.</div>
          ) : legalMoves.length === 0 ? (
            <div className="sub" style={{ marginTop: 10 }}>No legal moves. Press Pass.</div>
          ) : (
            <div className="moves" style={{ marginTop: 10 }}>
              {legalMoves.map((m, idx) => (
                <button
                  key={idx}
                  className="moveBtn"
                  onClick={() => doMove(m.tokenIndex, m.to)}
                >
                  <span>
                    Move token <b>#{m.tokenIndex + 1}</b> <small>(to {m.to === -1 ? "Yard" : m.to})</small>
                  </span>
                  <span>{m.capture ? "⚔️" : "➡️"}</span>
                </button>
              ))}
            </div>
          )}

          <div className="sub" style={{ marginTop: 12 }}>
            Rule notes: 6 to enter, exact finish, blocks stop passing, capture on non-safe.
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div className="pill">Main Track (52)</div>
            <div className="sub">Safe cells have outline.</div>
          </div>

          <div className="track" style={{ marginTop: 12 }}>
            {trackCells.map((g) => {
              const stack = tokensAtGlobal(g);
              return (
                <div key={g} className={cell ${isSafeGlobal(g) ? "safe" : ""}}>
                  <div className="tokens">
                    {stack.map(({ p, count }) =>
                      Array.from({ length: Math.min(count, 4) }).map((_, i) => (
                        <span key={${p}-${i}} className="tok" style={{ background: PLAYERS[p].color }} />
                      ))
                    )}
                  </div>
                  <span className="tag">{g}</span>
                </div>
              );
            })}

</div>
        </div>

        <div className="card">
          <div className="pill">Players</div>
          <div className="mini" style={{ marginTop: 12 }}>
            {activePlayers.map((p) => (
              <div key={p.id} className="card" style={{ padding: 12 }}>
                <div className="phead">
                  <div className="pname">
                    <span className="dot" style={{ background: p.color }} />
                    {p.name}
                  </div>
                  <span className="pill">Start: {p.startIndex}</span>
              
