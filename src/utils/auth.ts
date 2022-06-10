import { Employee } from '../entities/Employee'
import { sign, Secret } from 'jsonwebtoken'
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

	export const createActiveToken = (email: string, id: number) =>
	sign(
		{
			email,
			id
		},
		process.env.ACTIVE_TOKEN_SECRET as Secret,
		{
			expiresIn: '10m'
		}
	)

	export const createAc = (type: 'accessToken' | 'refreshToken', user: Employee | Client) =>
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


export const sendRefreshToken = (req: any, user: Employee | Client) => {
	req.session.refresh =  createToken('refreshToken', user)
}
