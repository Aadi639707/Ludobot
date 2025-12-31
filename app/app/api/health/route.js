export async function GET() {
  return new Response(
    JSON.stringify({ ok: true, message: "health ok" }),
    { status: 200, headers: { "content-type": "application/json" } }
  );
}
