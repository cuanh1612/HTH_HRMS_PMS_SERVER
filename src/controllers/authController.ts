import argon2 from 'argon2'
import { Request, Response } from 'express'
import { Employee } from '../entities/Employee'
import { createToken, sendRefreshToken } from '../utils/auth'
import handleCatchError from '../utils/catchAsyncError'
import { Secret, verify } from 'jsonwebtoken'
import { UserAuthPayload } from '../type/UserAuthPayload'
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const authController = {
	login: handleCatchError(async (req: Request, res: Response) => {
		const { email, password } = req.body

		const existingUser = await Employee.findOne({
			where: {
				email,
			},
		})

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Incorrect email or password',
			})

		const isPasswordValid = await argon2.verify(existingUser.password, password)

		if (!isPasswordValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Incorrect email or password',
			})

		//Save cookie refresh token
		sendRefreshToken(res, existingUser)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Logged in successfully',
			user: existingUser,
			accessToken: createToken('accessToken', existingUser),
		})
	}),

	googleLogin: handleCatchError(async (req: Request, res: Response) => {
		const { token } = req.body

		//verify email token
		const user = await client.verifyIdToken({
			idToken: token,
		})

		//Get email
		const userEmail = user.getAttributes().payload?.email

		//Check existing user
		const existingUser = await Employee.findOne({
			where: {
				email: userEmail,
			},
		})

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Email does not exist in the system',
			})

		//Save cookie refresh token
		sendRefreshToken(res, existingUser)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Logged in successfully',
			accessToken: createToken('accessToken', existingUser),
		})
	}),

	refreshToken: handleCatchError(async (req: Request, res: Response) => {
		const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string]

		if (!refreshToken)
			return res.status(401).json({
				code: 401,
				success: false,
				message: 'You must login first',
			})

		//Check decode
		try {
			const decodeUser = verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET as Secret
			) as UserAuthPayload

			console.log(decodeUser)

			const existingUser = await Employee.findOne({
				where: {
					id: decodeUser.userId,
				},
			})

			if (!existingUser || existingUser.token_version !== decodeUser.tokenVersion)
				return res.status(401).json({
					code: 401,
					success: false,
					message: 'You must login first',
				})

			sendRefreshToken(res, existingUser)

			return res.status(200).json({
				code: 200,
				success: true,
				message: 'Refresh token success',
				accessToken: createToken('accessToken', existingUser),
			})
		} catch (error) {
			return res.status(403).json({
				code: 403,
				success: false,
				message: 'You must login first',
			})
		}
	}),

	logout: handleCatchError(async (req: Request, res: Response) => {
		console.log('co ne ')

		const { userId } = req.body

		const existingUser = await Employee.findOne({
			where: {
				id: userId,
			},
		})

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Logout false',
			})

		existingUser.token_version += 1

		await existingUser.save()

		res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, {
			httpOnly: true,
			sameSite: 'lax',
			secure: true,
			path: '/',
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Logout successfully',
		})
	}),

	currentUser: handleCatchError(async (req: Request, res: Response) => {
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		//Get data user
		const existingUser = await Employee.findOne({
			where: {
				id: decode.userId,
			},
		})

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			user: existingUser,
			message: 'Get current user successfully',
		})
	}),
}

export default authController
