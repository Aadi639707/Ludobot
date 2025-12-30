"use client";

export default function Home() {
  return (
    <div className="screen">
      <div className="board">

        {/* Top Row */}
        <div className="home blue"></div>
        <div className="path"></div>
        <div className="home yellow"></div>

        {/* Middle Row */}
        <div className="path"></div>
        <div className="center"></div>
        <div className="path"></div>

        {/* Bottom Row */}
        <div className="home red"></div>
        <div className="path"></div>
        <div className="home green"></div>

      </div>
    </div>
  );
}
