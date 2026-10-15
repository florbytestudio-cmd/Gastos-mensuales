// Vercel Function: entrega la configuración pública de Supabase desde
// variables de entorno, para que no quede escrita en el código ni en GitHub.
module.exports = (req, res) => {
  const url = process.env.SUPABASE_URL || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || '';
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') { res.statusCode = 405; return res.end('{"error":"method"}'); }
  if (!url || !anonKey) { res.statusCode = 500; return res.end('{"error":"faltan variables"}'); }
  // Nunca entregar una llave que no sea la anon (protege si alguien pega la service_role por error)
  try {
    const payload = JSON.parse(Buffer.from(anonKey.split('.')[1], 'base64url').toString());
    if (payload.role !== 'anon') { res.statusCode = 500; return res.end('{"error":"la llave no es anon"}'); }
  } catch (e) {
    if (!anonKey.startsWith('sb_publishable_')) { res.statusCode = 500; return res.end('{"error":"llave invalida"}'); }
  }
  res.statusCode = 200;
  res.end(JSON.stringify({ url, anonKey }));
};
