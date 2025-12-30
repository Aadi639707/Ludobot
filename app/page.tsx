"use client";

export default function Home() {
  return (
    <main className="screen">
      <div className="board">
        {/* Top row */}
        <div className="home blue">
          <div className="token-grid">
            <span className="token blueTok" />
            <span className="token blueTok" />
            <span className="token blueTok" />
            <span className="token blueTok" />
          </div>
        </div>

        <div className="center-path top">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className={cell ${i % 3 === 1 ? "yellowCell" : ""}} />
          ))}
        </div>

        <div className="home yellow">
          <div className="token-grid">
            <span className="token yellowTok" />
            <span className="token yellowTok" />
            <span className="token yellowTok" />
            <span className="token yellowTok" />
          </div>
        </div>

        {/* Middle row */}
        <div className="center-path left">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className={cell ${i % 3 === 1 ? "blueCell" : ""}} />
          ))}
        </div>

        <div className="center">
          <div className="tri blueTri" />
          <div className="tri yellowTri" />
          <div className="tri greenTri" />
          <div className="tri redTri" />
          <div className="midDot" />
        </div>

        <div className="center-path right">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className={cell ${i % 3 === 1 ? "greenCell" : ""}} />
          ))}
        </div>

        {/* Bottom row */}
        <div className="home red">
          <div className="token-grid">
            <span className="token redTok" />
            <span className="token redTok" />
            <span className="token redTok" />
            <span className="token redTok" />
          </div>
        </div>

        <div className="center-path bottom">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className={cell ${i % 3 === 1 ? "redCell" : ""}} />
          ))}
        </div>

        <div className="home green">
          <div className="token-grid">
            <span className="token greenTok" />
            <span className="token greenTok" />
            <span className="token greenTok" />
            <span className="token greenTok" />
          </div>
        </div>
      </div>
    </main>
  );
}
