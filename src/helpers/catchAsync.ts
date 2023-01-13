import { Request, Response, NextFunction } from 'express'

export const catchAsync = (callback: (req: Request, res: Response, next?: NextFunction) => any) => {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			await callback(req, res, next)
		} catch (err) {
			res.send('error')
		}
	}
}
