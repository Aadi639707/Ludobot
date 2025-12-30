export default function Home() {
  return (
    <div className="screen">
      <div className="board">

        {/* Blue Home */}
        <div className="cell blue" style={{ gridColumn: "1/7", gridRow: "1/7" }} />

        {/* Yellow Home */}
        <div className="cell yellow" style={{ gridColumn: "10/16", gridRow: "1/7" }} />

        {/* Red Home */}
        <div className="cell red" style={{ gridColumn: "1/7", gridRow: "10/16" }} />

        {/* Green Home */}
        <div className="cell green" style={{ gridColumn: "10/16", gridRow: "10/16" }} />

        {/* Center */}
        <div className="center" />

      </div>
    </div>
  );
}
