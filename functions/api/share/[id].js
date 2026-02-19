export async function onRequestGet(context) {
  try {
    const { params, env } = context;
    const id = params.id;
    const row = await env.DB.prepare(`SELECT id, payload, created_at FROM shares WHERE id = ?`).bind(id).first();
    if (!row) return Response.json({ error: 'not found' }, { status: 404 });
    const state = JSON.parse(row.payload || 'null');
    return Response.json({ id: row.id, state, created_at: row.created_at });
  } catch (e) {
    return Response.json({ error: `failed: ${e?.message || e}` }, { status: 500 });
  }
}
