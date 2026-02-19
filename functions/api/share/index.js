function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const payload = JSON.stringify(body?.state ?? null);
    if (!payload || payload === 'null') {
      return json({ error: 'state is required' }, 400);
    }

    const id = (crypto.randomUUID?.() || String(Date.now())).replace(/-/g, '').slice(0, 12);
    await env.DB.prepare(
      `INSERT INTO shares (id, payload, created_at, updated_at) VALUES (?, ?, datetime('now'), datetime('now'))`
    ).bind(id, payload).run();

    return json({ id, url: `${new URL(request.url).origin}?sid=${id}` });
  } catch (e) {
    return json({ error: `failed: ${e?.message || e}` }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}
