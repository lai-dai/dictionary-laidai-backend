import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'
import path from 'path'
import { StatusCodes } from 'http-status-codes'
import cookieParser from 'cookie-parser'
import compression from 'compression'

import { AppError } from './_lib/utils/app-error'
import { globalError } from './_middlewares/global-error'
import { AttrType as UserType } from './users/type'

import { router as authRouter } from './auth/route'
import { router as usersRouter } from './users/route'
import { router as partOfSpeechesRouter } from './part-of-speech/route'
import { router as examplesRouter } from './examples/route'
import { router as definitionsRouter } from './definitions/route'
import { router as meaningsRouter } from './meanings/route'
import { router as wordsRouter } from './words/route'
import { router as favoritesRouter } from './favorites/route'
import { router as idiomsRouter } from './idioms/route'
import { router as commentsRouter } from './comments/route'
import { router as phoneticsRouter } from './phonetics/route'

declare global {
  namespace Express {
    export interface Request {
      options?: Record<string, any>
      user?: UserType
    }
  }
}

export const app = express()

// app.enable('trust proxy')

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors())

app.options('*', cors())

// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Set security HTTP headers
app.use(helmet())

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
})
app.use('/api', limiter)

// parse requests of content-type - application/json
app.use(express.json({ limit: '10kb' }))

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false, limit: '10kb' }))
app.use(cookieParser())
// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
// app.use(xss())

// Prevent parameter pollution
app.use(hpp())

app.use(compression())

// ROUTES
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/partOfSpeeches', partOfSpeechesRouter)
app.use('/api/v1/examples', examplesRouter)
app.use('/api/v1/definitions', definitionsRouter)
app.use('/api/v1/meanings', meaningsRouter)
app.use('/api/v1/words', wordsRouter)
app.use('/api/v1/favorites', favoritesRouter)
app.use('/api/v1/idioms', idiomsRouter)
app.use('/api/v1/comments', commentsRouter)
app.use('/api/v1/phonetics', phoneticsRouter)

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      StatusCodes.NOT_FOUND
    )
  )
})

// global error handler
app.use(globalError)
