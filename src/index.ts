require('dotenv').config()
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import 'reflect-metadata'
import connectDB from './config/connectDB'
import createSocketServer from './config/socketIO'
import mainRouter from './routes/mainRouter'

const PORT = process.env.PORT || 4000

//Create typeorm connection
connectDB()

//Create and setup express app
const app = express()
const httpServer = createServer(app)
app.use(express.json())
app.set('trust proxy', 1)
app.use(
	cors({
		// 'https://huprom-hrms-pms-client.vercel.app'
		origin: 'https://huprom-hrms-pms-client.vercel.app',
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		credentials: true, 

	})
)
app.use(cookieParser())

//Routes
mainRouter(app)

//Setting socket server
createSocketServer(httpServer)

//Server listen PORT
httpServer.listen(PORT, () => {
	console.log(`Server listen at http://localhost:${PORT}, ${process.env.URL_CLIENT}`)
})
