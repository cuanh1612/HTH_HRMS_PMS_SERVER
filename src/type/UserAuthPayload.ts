import { JwtPayload } from 'jsonwebtoken'

export type UserAuthPayload = JwtPayload & {
	userId: number
	role: string
	email: string
	tokenVersion: number
}
