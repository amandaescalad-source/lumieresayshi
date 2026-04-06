exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = 'amandaescalad-source';
  const repo  = 'lumieresayshi';
  const path  = 'site-data.json';
  const branch = 'main';

  if (!token) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GITHUB_TOKEN no configurado' }) };
  }

  try {
    const data = JSON.parse(event.body);
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');

    // Obtener el SHA actual del archivo (necesario para actualizarlo)
    const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const headers = {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'lumieresayshi-web'
    };

    let sha = null;
    try {
      const getRes = await fetch(`${apiBase}?ref=${branch}`, { headers });
      if (getRes.ok) {
        const existing = await getRes.json();
        sha = existing.sha;
      }
    } catch (e) {
      // Archivo no existe aún — se creará
    }

    // Guardar el archivo en GitHub
    const body = {
      message: 'Actualizar contenido web',
      content,
      branch
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(apiBase, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });

    if (!putRes.ok) {
      const err = await putRes.text();
      return { statusCode: 500, body: JSON.stringify({ error: err }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, savedAt: new Date().toISOString() })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
