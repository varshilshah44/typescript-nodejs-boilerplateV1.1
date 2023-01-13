import { Response } from 'express'
import { responseMessages } from '@core/messages'

export const handleResponse = (res: Response, statusCode = 200, message = responseMessages.SUCCESS, result = 1, data = {}): void => {
	res.status(statusCode).json({
		result,
		message,
		data
	})
}

export const handleError = (res: Response, statusCode = 500, message = responseMessages.ERROR, result = 0, data = {}): void => {
	res.status(statusCode).json({
		result,
		message,
		data
	})
}
