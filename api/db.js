export default async function handler(req, res) {
  const { method, body } = req;
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.REPO_OWNER;
  const repo = process.env.REPO_NAME;
  const path = process.env.FILE_PATH;

  const apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  try {
    const shaResp = await fetch(apiURL, { headers });
    const shaData = await shaResp.json();
    const sha = shaData.sha;

    const putResp = await fetch(apiURL, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: body.message || "Update via Lynxxx DB",
        content: Buffer.from(JSON.stringify(body.data, null, 2)).toString("base64"),
        sha,
        committer: {
          name: "Lynxxx Botz",
          email: "lynxxx@example.com",
        },
      }),
    });

    const putData = await putResp.json();
    if (putResp.ok) {
      return res.status(200).json({ success: true, commit: putData.commit.sha });
    } else {
      return res.status(500).json({ error: "Failed to update file", details: putData });
    }
  } catch (err) {
    return res.status(500).json({ error: "Unexpected error", details: err.message });
  }
    }
