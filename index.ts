import express, { Request, Response } from 'express'

export const app = express()
app.use(express.json())

// get post routes
app.get('/post', (req: Request, res: Response) => {
  res.status(200).json({ message: 'post routes' })
})

// root routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World' })
})
app.post('/', (req: Request, res: Response) => {
  req.body
  res.status(200).json({ message: 'Hello World', data: req.body })
})

app.listen(5000, () => console.log('Server ready on port 5000.'))
