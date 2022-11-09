import express from 'express'
import authController from '../controllers/auth.controller'

const authRouter = express.Router()

authRouter.post('/login', authController.login)
authRouter.post('/login-google', authController.googleLogin)
authRouter.post('/ask-re-enter-password', authController.askReEnterPassword)

authRouter.get('/refresh_token', authController.refreshToken)
authRouter.get('/me', authController.currentUser)

authRouter.post('/logout', authController.logout)

authRouter.post('/recover-password', authController.recoverPass)
authRouter.post('/reset-password', authController.resetPassword)

export default authRouter
