import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { initDB } from './src/_db'
initDB()