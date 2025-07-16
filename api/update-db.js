export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = 'DimasMahardika24/database-lynxxx';
  const GITHUB_FILE = 'db.json';
  const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`;

  if (req.method === 'GET') {
    try {
      const raw = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3.raw'
        }
      });

      const meta = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
      });

      const metaJson = await meta.json();
      const data = await raw.json();

      res.status(200).json({ ...data, sha: metaJson.sha });
    } catch (err) {
      res.status(500).json({ error: 'Gagal ambil data', detail: err.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { content, message, sha } = req.body;
      if (!content || !message || !sha) {
        return res.status(400).json({ error: 'Data tidak lengkap' });
      }

      const update = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          content,
          sha,
          committer: {
            name: 'Lynxxx Botz',
            email: 'lynxxx@example.com'
          }
        })
      });

      const result = await update.json();
      if (!update.ok) return res.status(update.status).json(result);

      res.status(200).json({ success: true, result });
    } catch (err) {
      res.status(500).json({ error: 'Gagal update GitHub', detail: err.message });
    }
  }
}
