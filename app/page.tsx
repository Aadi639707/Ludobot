export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#0f172a", color: "white", padding: "40px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 42, marginBottom: 10 }}>🎲 LudoBot</h1>
        <p style={{ opacity: 0.8, marginBottom: 30 }}>
          A modern online Ludo game
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "#1e293b", padding: 20, borderRadius: 12 }}>
            <h2>Play</h2>
            <p>Play Ludo against smart bot.</p>
          </div>

          <div style={{ background: "#1e293b", padding: 20, borderRadius: 12 }}>
            <h2>Features</h2>
            <ul>
              <li>4 Players</li>
              <li>Dice System</li>
              <li>Turn Based</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
