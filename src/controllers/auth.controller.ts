import argon2 from 'argon2'
import { Request, Response } from 'express'
import { Employee } from '../entities/Employee.entity'
import { createActiveToken, createToken } from '../utils/auth'
import handleCatchError from '../utils/catchAsyncError'
import { JwtPayload, Secret, verify } from 'jsonwebtoken'
import { UserAuthPayload } from '../type/UserAuthPayload'
import { OAuth2Client } from 'google-auth-library'
import { Client } from '../entities/Client.entity'
import sendMail from '../utils/sendNotice'
import { validatePassword } from '../utils/valid/employeeValid'
import { templateWEmail } from '../utils/templateEmail'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const authController = {
	login: handleCatchError(async (req: Request, res: Response) => {
		const { email, password } = req.body
		const existingUser =
			(await Employee.findOne({
				where: {
					email,
				},
			})) ||
			(await Client.findOne({
				where: {
					email,
				},
			}))

		const existingUserPassword =
			(await Employee.createQueryBuilder('employee')
				.where('employee.email = :email', { email: email })
				.select('employee.password')
				.getOne()) ||
			(await Client.createQueryBuilder('client')
				.where('client.email = :email', { email: email })
				.select('client.password')
				.getOne())

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Incorrect email or password',
			})

		if (!existingUser || !existingUserPassword?.password)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Incorrect email or password',
			})

		if (!existingUser.can_login)
			return res.status(400).json({
				code: 400,
				success: false,
				message: "You can't login to the system",
			})

		const isPasswordValid = await argon2.verify(existingUserPassword.password, password)

		if (!isPasswordValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Incorrect email or password',
			})

		//Save cookie refresh token
		// sendRefreshToken(res, existingUser)
		const refreshToken = createToken('refreshToken', existingUser)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Logged in successfully',
			user: existingUser,
			accessToken: createToken('accessToken', existingUser),
			refreshToken,
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
		const existingUser =
			(await Employee.findOne({
				where: {
					email: userEmail,
				},
			})) ||
			(await Client.findOne({
				where: {
					email: userEmail,
				},
			}))

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Email does not exist in the system',
			})

		if (!existingUser.can_login)
			return res.status(400).json({
				code: 400,
				success: false,
				message: "You can't login to the system",
			})

		//Save cookie refresh token
		// sendRefreshToken(res, existingUser)
		const refreshToken = createToken('refreshToken', existingUser)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Logged in successfully',
			accessToken: createToken('accessToken', existingUser),
			refreshToken,
		})
	}),

	refreshToken: handleCatchError(async (req: Request, res: Response) => {
		const refreshToken = req.cookies[`jwt-auth-cookie`]
		if (!refreshToken)
			return res.status(401).json({
				code: 401,
				success: false,
				message: 'You must login first',
				refreshToken,
			})

		//Check decode
		try {
			const decodeUser = verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET as Secret
			) as UserAuthPayload

			const existingUser: Employee | Client | null =
				(await Employee.findOne({
					where: {
						email: decodeUser.email,
					},
				})) ||
				(await Client.findOne({
					where: {
						email: decodeUser.email,
					},
				}))

			if (!existingUser || existingUser.token_version !== decodeUser.tokenVersion)
				return res.status(401).json({
					code: 401,
					success: false,
					message: 'You must login 1first',
				})

			//Save cookie refresh token
			// sendRefreshToken(res, existingUser)
			const createdRefreshToken = createToken('refreshToken', existingUser)

			return res.status(200).json({
				code: 200,
				success: true,
				message: 'Refresh token successfully',
				accessToken: createToken('accessToken', existingUser),
				refreshToken: createdRefreshToken,
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
		//check exist current user
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		const existingUser =
			(await Employee.findOne({
				where: {
					email: decode.email,
				},
			})) ||
			(await Client.findOne({
				where: {
					email: decode.email,
				},
			}))

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Logout failed',
			})

		existingUser.token_version += 1

		await existingUser.save()

		// res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, {
		// 	httpOnly: true,
		// 	sameSite: 'lax',
		// 	secure: true,
		// 	path: '/',
		// })

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
		const existingUser =
			(await Employee.findOne({
				where: {
					id: decode.userId,
				},
			})) ||
			(await Client.findOne({
				where: {
					id: decode.userId,
				},
			}))

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

	askReEnterPassword: handleCatchError(async (req: Request, res: Response) => {
		const { email, password } = req.body

		const existingUser =
			(await Employee.createQueryBuilder('employee')
				.where('employee.email = :email', { email: email })
				.select('employee.password')
				.getOne()) ||
			(await Client.createQueryBuilder('client')
				.where('client.email = :email', { email: email })
				.select('employee.password')
				.getOne())

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
				message: 'Incorrect email or password 1',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Ask re enter password correct',
		})
	}),

	recoverPass: handleCatchError(async (req: Request, res: Response) => {
		const { email } = req.body
		if (!email) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please, enter full fields',
			})
		}

		const employee = await Employee.findOne({
			where: {
				email,
			},
		})

		if (!employee) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This employee does not exist in system',
			})
		}

		const activeToken = createActiveToken(email, employee.id)

		templateWEmail({
			activeToken:`${process.env.CLIENT_URL}/reset-password/${activeToken}`,
			name: employee.name,
			file: '../../views/resetPass.handlebars'
		})

		await sendMail({
			to: email,
			text: 'reset password',
			subject: 'huprom-reset password',
			template: 'resetPass',
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Password recovery link sent to your inbox.',
		})
	}),

	// reset password
	resetPassword: handleCatchError(async (req, res) => {
		const { activeToken, password, passwordConfirm } = req.body
		if (!validatePassword(password))
			return res.status(400).json({
				err: 'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
				statusCode: 400,
			})

		if (password != passwordConfirm)
			return res.status(400).json({
				err: 'Password not match',
				statusCode: 400,
			})

		const passwordHash = await argon2.hash(password)

		const data = verify(activeToken, process.env.ACTIVE_TOKEN_SECRET as string, {
			ignoreExpiration: false,
		}) as JwtPayload & {
			email: string
			id: number
		}

		if (new Date() >= new Date(Number(data.exp) * 1000))
			return res.status(400).json({
				err: 'Some thing went wrong! Please request mail reset password again at login page',
				statusCode: 400,
			})

		// find user by id and update
		const existingUser =
			(await Employee.findOne({
				where: {
					email: data.email,
				},
			})) ||
			(await Client.findOne({
				where: {
					email: data.email,
				},
			}))

		if (!existingUser)
			return res.status(400).json({
				err: 'User does not exist',
				statusCode: 400,
			})

		existingUser.password = passwordHash
		await existingUser.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Reset password successfully',
		})
	}),
}

export default authController
