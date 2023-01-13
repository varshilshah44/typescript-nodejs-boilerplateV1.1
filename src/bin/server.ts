import 'module-alias/register'
import http from 'http'
import application from '@root/app'
import { config } from '@core/config'
import logger from '@core/logger'

if (config.ENVIRONMENT === 'production') {
	process.on('uncaughtException', (err: Error) => {
		logger.info('UNCAUGHT EXCEPTION! 💥 Shutting down...')
		logger.error(err.name, err.message)
		process.exit(1)
	})
}

const { server, port } = application.createServer(http)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function onError(error: any) {
	if (error.syscall !== 'listen') {
		throw error
	}
	const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`
	switch (error.code) {
		case 'EACCES':
			logger.error(`${bind} requires elevated privileges`)
			process.exit(1)
			break
		case 'EADDRINUSE':
			logger.error(`${bind} + is already in use`)
			process.exit(1)
			break
		default:
			throw error
	}
}

function onListening() {
	const addr = server.address()
	const bind = typeof addr === 'string' ? `Pipe ${addr}` : `Port ${addr.port}`
	logger.info(`Server started on port : ${port}`)
	logger.info(`Listening on ${bind}`)
}

process.on('unhandledRejection', (err: Error) => {
	logger.error('UNHANDLED REJECTION! 💥 Shutting down...')
	logger.error(err.name, err.message)
	server.close(() => {
		process.exit(1)
	})
})

process.on('SIGTERM', () => {
	logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully')
	server.close(() => {
		logger.info('💥 Process terminated!')
	})
})
