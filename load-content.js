const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  try {
    const store = getStore('studio-lumiere');
    const data = await store.get('site-content', { type: 'json' });

    if (!data) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    };
  }
};
