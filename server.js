const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
const app = express()

app.use(cors())
app.use(express.json())

// Ambil token dari environment (AMAN, tidak ditulis langsung)
const TOKEN = process.env.GITHUB_TOKEN
const GITHUB_API = 'https://api.github.com/repos/DimasMahardika24/DbUsers/contents/Db.json'

// Ambil SHA dari file GitHub (dibutuhkan untuk update)
async function getSha() {
  const res = await fetch(GITHUB_API, {
    headers: { Authorization: `token ${TOKEN}` }
  })
  const data = await res.json()
  return data.sha
}

// Endpoint untuk tambah data user
app.post('/tambah', async (req, res) => {
  const { phone, username, pin } = req.body
  if (!phone || !username || !pin) {
    return res.status(400).json({ error: 'Isi semua data' })
  }

  const dbRes = await fetch(GITHUB_API, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  })
  const db = await dbRes.json()

  // Tambahkan data baru
  db.users.push({ phone, username, pin })

  const sha = await getSha()
  const content = Buffer.from(JSON.stringify(db, null, 2)).toString('base64')

  await fetch(GITHUB_API, {
    method: 'PUT',
    headers: {
      Authorization: `token ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Add user ${phone}`,
      content,
      committer: {
        name: 'Lynxxx Botz',
        email: 'lynxxx@example.com'
      },
      sha
    })
  })

  res.json({ status: 'Berhasil tambah data!' })
})

app.get('/', (req, res) => res.send('🟢 Lynxxx API is Running'))

app.listen(3000, () => console.log('✅ Server jalan di http://localhost:3000'))
