export default async function handler(req, res) {
  const { GITHUB_TOKEN } = process.env;
  const API_URL = 'https://api.github.com/repos/DimasMahardika24/DbUsers/contents/Db.json';

  if (!GITHUB_TOKEN) {
    return res.status(401).json({ message: 'GITHUB_TOKEN not set in environment variables' });
  }

  if (req.method === 'PUT') {
    const { content, sha, message } = req.body;

    if (!content || !sha || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
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

      const result = await response.json();
      return res.status(response.status).json(result);
    } catch (err) {
      return res.status(500).json({ message: 'Error updating file', error: err.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3.raw'
        }
      });

      if (!response.ok) {
        return res.status(response.status).json({ message: 'Failed to fetch Db.json' });
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ message: 'Error fetching file', error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
    }
