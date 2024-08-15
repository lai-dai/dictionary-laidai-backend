import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  process.exit(1)
})

import { app } from './src/app'
import { initDB } from './src/_db'
initDB()

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log('🚀 App is running on port', port)
})

process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully')
  server.close(() => {
    console.log('💥 Process terminated!')
  })
})
