import { NextFunction, Request, Response } from 'express'
//Handle catch async error
const handleCatchError = (func: (req: Request, res: Response, next: NextFunction) => void) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const asynFunc = new Promise((resolve) => {
			resolve(func(req, res, next))
		})

		asynFunc.catch((error) => {
			let statusCode = 500
			let message = 'Something went wrong'
			//Define error
			//Handle castError

			if (error.code === '22P02') {
				message = `Resource not found.`
				statusCode = 400
			}

			// //Handling Mongoose validation Error
			// if (nameError === 'ValidationError') {
			//   const messageError = Object.values(error.errors).map((value) => value.message)[0];
			//   message = messageError;
			//   statusCode = 400;
			// }

			//Hand duplicate key errors
			if (error.code === '23505') {
				const fieldDuplicate = (error.detail as string).split(`"`)[1]
				statusCode = 400
				message = `${fieldDuplicate} already exist`
			}

			//Hand delete but have reference to other table
			if (error.code === '23503') {
				statusCode = 400
				message = `Please delete all ${error.table} before action delete function`
			}

			//Hand delete but have reference to other table
			if (error.code === '23502') {
				statusCode = 400
				message = `Please enter full field`
			}

			// //Handling wrong JWT error
			// if (nameError === 'JsonWebTokenError') {
			//   const messageError = `JSON Web Token is invalid. Try Again!!!`;
			//   statusCode = 400;
			//   message = messageError;
			// }

			// //Handling Expored JWT error
			// if (nameError === 'TokenExpiredError') {
			//   const messageError = `JSON Web Token is invalid. Try Again!!!`;
			//   statusCode = 400;
			//   message = messageError;
			// }

			//Res error
			return res.status(statusCode).json({
				code: statusCode,
				success: false,
				message,
			})
		})
	}
}

export default handleCatchError
