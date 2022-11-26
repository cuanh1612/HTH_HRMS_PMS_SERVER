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

app.get('/', (_, res)=> {
	res.send(process.env.DB_URL)
})

//Routes
mainRouter(app)

//Setting socket server
createSocketServer(httpServer)

//Server listen PORT
httpServer.listen(PORT, () => {
	console.log(`Server listen at http://localhost:${PORT}, ${process.env.URL_CLIENT}`)
})
