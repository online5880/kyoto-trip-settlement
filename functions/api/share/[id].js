function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export async function onRequestGet(context) {
  try {
    const { params, env } = context;
    const id = params.id;
    const row = await env.DB.prepare(
      `SELECT id, payload, created_at, updated_at FROM shares WHERE id = ?`
    ).bind(id).first();

    if (!row) return json({ error: 'not found' }, 404);

    const state = JSON.parse(row.payload || 'null');
    return json({
      id: row.id,
      state,
      created_at: row.created_at,
      updated_at: row.updated_at || row.created_at,
    });
  } catch (e) {
    return json({ error: `failed: ${e?.message || e}` }, 500);
  }
}

export async function onRequestPut(context) {
  try {
    const { request, params, env } = context;
    const id = params.id;
    const body = await request.json();
    const payload = JSON.stringify(body?.state ?? null);
    if (!payload || payload === 'null') return json({ error: 'state is required' }, 400);

    const existing = await env.DB.prepare(`SELECT id FROM shares WHERE id = ?`).bind(id).first();
    if (!existing) return json({ error: 'not found' }, 404);

    await env.DB.prepare(
      `UPDATE shares SET payload = ?, updated_at = datetime('now') WHERE id = ?`
    ).bind(payload, id).run();

    return json({ ok: true, id });
  } catch (e) {
    return json({ error: `failed: ${e?.message || e}` }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}
