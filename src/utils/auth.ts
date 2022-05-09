import { Employee } from '../entities/Employee'
import { sign, Secret } from 'jsonwebtoken'
import { Response } from 'express'
import { Client } from '../entities/Client'

export const createToken = (type: 'accessToken' | 'refreshToken', user: Employee | Client) =>
	sign(
		{
			userId: user.id,
			role: user.role,
			email: user.email,
			...(type === 'refreshToken' ? { tokenVersion: user.token_version } : {}),
		},
		type === 'accessToken'
			? (process.env.ACCESS_TOKEN_SECRET as Secret)
			: (process.env.REFRESH_TOKEN_SECRET as Secret),
		{
			expiresIn: type === 'accessToken' ? '5m' : '7h',
		}
	)

export const sendRefreshToken = (res: Response, user: Employee | Client) => {
	res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, createToken('refreshToken', user), {
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
		path: '/',
	})
}
