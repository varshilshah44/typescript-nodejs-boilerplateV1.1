import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import createError, { HttpError } from 'http-errors'
import dotenv from 'dotenv'
dotenv.config()
import { config } from '@core/config'
import indexRouter from '@modules/index'
import { database } from '@core/dbConnection'
import logger from '@core/logger'

class App {
	private app: Application
	constructor() {
		this.app = express()
		this.middlewares()
		this.databaseConnection()
		this.routes()
		this.errorHandling()
	}
	private middlewares() {
		this.app.use(cors())
		this.app.use(helmet())
		this.app.use(express.json())
		this.app.use(express.urlencoded({ extended: false }))
		this.app.use(cookieParser())
		if (config.ENVIRONMENT === 'development') {
			this.app.use(morgan('dev'))
		}
		this.app.use(
			rateLimit({
				max: 1000,
				windowMs: 60 * 60 * 1000,
				message: 'Too many requests from this IP, please try again in an hour!'
			})
		)
	}
	private routes() {
		this.app.use('/api/v1', indexRouter)
	}
	private databaseConnection() {
		const connection = new database(config.DB.url, config.DB.options)
		const db = connection.connect()
		db.on('connected', () => {
			logger.info('Mongoose connection open to master DB')
		})

		// If the connection throws an error
		db.on('error', (err) => {
			logger.debug(`Mongoose connection error for master DB: ${err}`)
		})

		// When the connection is disconnected
		db.on('disconnected', () => {
			logger.debug('Mongoose connection disconnected for master DB')
		})

		// When connection is reconnected
		db.on('reconnected', () => {
			logger.info('Mongoose connection reconnected for master DB')
		})

		// If the Node process ends, close the Mongoose connection
		process.on('SIGINT', () => {
			db.close(() => {
				logger.debug('Mongoose connection disconnected for master DB through app termination')
				// eslint-disable-next-line no-process-exit
				process.exit(0)
			})
		})
	}
	private errorHandling() {
		this.app.get('/', (_req: Request, res: Response) => {
			res.status(200).send('Welcome')
		})

		this.app.all('*', (_req: Request, _res: Response, next: NextFunction) => {
			const err = createError(404, '404 Not Found')
			return next(err)
		})
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		this.app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
			res.status(err.status).send(err.message)
		})
	}
	createServer(http: any) {
		this.app.set('port', config.PORT ? config.PORT : '3000')
		const server = http.createServer(this.app)
		return {
			server,
			port: this.app.get('port')
		}
	}
}

const application = new App()
export default application
