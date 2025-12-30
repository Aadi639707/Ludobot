const cells = Array.from({ length: SIZE * SIZE }, (_, idx) => {
  const r = Math.floor(idx / SIZE);
  const c = idx % SIZE;

  return (
    <div key={${r}-${c}}
className="cell">
      {/* optional: show index */}
      {/* {r},{c} */}
    </div>
  );
});
