exports.handler = async (event) => {
  const token = process.env.GITHUB_TOKEN;
  const owner = 'amandaescalad-source';
  const repo  = 'lumieresayshi';
  const path  = 'site-data.json';
  const branch = 'main';

  if (!token) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GITHUB_TOKEN no configurado' }) };
  }

  try {
    const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const headers = {
      'Authorization': `token ${token}`,
      'User-Agent': 'lumieresayshi-web'
    };

    const res = await fetch(`${apiBase}?ref=${branch}`, { headers });

    if (res.status === 404) {
      // Archivo no existe aún — devolver objeto vacío
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      };
    }

    if (!res.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Error al leer GitHub' }) };
    }

    const file = await res.json();
    const decoded = Buffer.from(file.content, 'base64').toString('utf8');
    const data = JSON.parse(decoded);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
