import { Response, Request, NextFunction } from 'express'
import { verify, Secret } from 'jsonwebtoken'
import { UserAuthPayload } from '../../type/UserAuthPayload'

export const checkAuth = (roles: string[] | null) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			console.log(roles)

			//auth Header here is "Bearer accessToken"
			const authHeader = req.header('Authorization')
			const accessToken = authHeader && authHeader.split(' ')[1]
			console.log(accessToken);
			

			if (!accessToken)
				return res.status(401).json({
					code: 401,
					success: false,
					message: 'Not authenticated to perform operations',
				})

			//Decode user
			const decodeUser: UserAuthPayload = verify(
				accessToken,
				process.env.ACCESS_TOKEN_SECRET as Secret
			) as UserAuthPayload

			//Check role
			if (decodeUser) {
				if (roles && Array.isArray(roles) && roles.includes(decodeUser.role)) {
					return res.status(401).json({
						code: 401,
						success: false,
						message: 'No permission to perform this function',
					})
				}
			}

			return next()
		} catch (error) {
			return res.status(401).json({
				code: 401,
				success: false,
				message: 'Error authenticating user',
			})
		}
	}
}
