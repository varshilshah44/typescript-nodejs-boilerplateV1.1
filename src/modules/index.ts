import express, { Router, Request, Response } from 'express'
import { catchAsync } from '@helpers/catchAsync'
import { handleResponse } from '@helpers/response'
import { responseMessages } from '@core/messages'
const router: Router = express.Router()

router.use(
	'/',
	catchAsync((_req: Request, res: Response) => {
		handleResponse(res, 200, responseMessages.WELCOME_MESSAGE, 1, {})
	})
)

export default router
