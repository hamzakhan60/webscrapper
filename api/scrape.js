export default async function handler(req, res) {
  // Allow CORS from your own frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { url, attributes, prompt } = req.body;

    if (!url || !attributes) {
      return res.status(400).json({ error: 'Missing url or attributes' });
    }

    const payload = { url, attributes };
    if (prompt) payload.prompt = prompt;

    const response = await fetch('https://api.parsera.org/v1/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': '7b3e0f956d9887f8b201c07b8473c3ee',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}