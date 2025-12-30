export default function Home() {
  return (
    <main style={{ minHeight: "100vh", padding: 24, fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 40, margin: 0 }}>🎲 LudoBot</h1>
        <p style={{ marginTop: 8, fontSize: 16, opacity: 0.8 }}>
          A clean, modern Ludo game UI — build in public.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
          <div style={{ padding: 18, border: "1px solid #333", borderRadius: 14 }}>
            <h2 style={{ margin: 0, fontSize: 20 }}>✅ Status</h2>
            <p style={{ marginTop: 8 }}>Site is live on Vercel.</p>
          </div>

          <div style={{ padding: 18, border: "1px solid #333", borderRadius: 14 }}>
            <h2 style={{ margin: 0, fontSize: 20 }}>🚀 Next</h2>
            <ul style={{ marginTop: 8, paddingLeft: 18 }}>
              <li>Ludo board UI</li>
              <li>Dice + turns</li>
              <li>4 players + tokens</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 18, padding: 18, border: "1px dashed #333", borderRadius: 14 }}>
          <h3 style={{ margin: 0 }}>Start Button (demo)</h3>
          <button
            style={{
              marginTop: 10,
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #333",
              background: "black",
              color: "white",
              fontSize: 16,
              cursor: "pointer",
            }}
            onClick={() => alert("Next: Board UI banayenge 🎯")}
          >
            Start Game
          </button>
        </div>
      </div>
    </main>
  );
}
