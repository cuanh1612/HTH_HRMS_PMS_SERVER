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

//Creae and setup express app
const app = express()
const httpServer = createServer(app)
console.log(process.env.URL_CLIENT)
console.log(process.env.URL_CLIENT)
console.log(process.env.URL_CLIENT)
console.log(process.env.URL_CLIENT)
console.log(process.env.URL_CLIENT)
console.log(process.env.URL_CLIENT)
console.log(process.env.URL_CLIENT)
console.log(process.env.URL_CLIENT)
console.log(process.env.URL_CLIENT)
console.log(process.env.URL_CLIENT)
app.use(express.json())
app.use(cookieParser())
app.use(
	cors({
		origin: 'https://huprom-hrms-pms-client.vercel.app',
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		credentials: true,
	})
)

//Routes
mainRouter(app)

//Setting socket server
createSocketServer(httpServer)

//Server listen PORT
httpServer.listen(PORT, () => {
	console.log(`Server listen at http://localhost:${PORT}, ${process.env.URL_CLIENT}`)
})
