import cors from 'cors'
import express from 'express'

const app = express()
const PORT = 3000

app.disable('etag')

app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
)

app.get('/users', (_req, res) => {
  res.json([
    { id: 1, name: 'John', role: 'USER' },
    { id: 2, name: 'Mary', role: 'ADMIN' },
  ])
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})