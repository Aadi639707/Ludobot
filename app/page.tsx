"use client";

import React, { useMemo } from "react";

const SIZE = 15;

export default function Home() {
  const cells = useMemo(() => {
    return Array.from({ length: SIZE * SIZE }, (_, idx) => {
      const r = Math.floor(idx / SIZE);
      const c = idx % SIZE;

      return (
        <div key={${r}-${c}} className="cell">
          {/* optional: show index */}
          {/* {r},{c} */}
        </div>
      );
    });
  }, []);

  return (
    <div className="screen">
      <div className="sidebar">
        <h1 className="title">🎲 LudoBot</h1>
        <button className="dice" type="button">
          Roll
        </button>
      </div>

      <div className="board">{cells}</div>
    </div>
  );
          }
