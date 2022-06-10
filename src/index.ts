require('dotenv').config()
import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import 'reflect-metadata'
import connectDB from './config/connectDB'
import createSocketServer from './config/socketIO'
import mainRouter from './routes/mainRouter'
import session from 'express-session'

const PORT = process.env.PORT || 4000

//Create typeorm connection
connectDB()

//Creae and setup express app
const app = express()
app.enable('trust proxy')
const httpServer = createServer(app)
app.use(express.json())
app.use(session({
	secret: 'somesecret',
	proxy: true,
	cookie: {
		secure: true,
		maxAge: 5184000000,
		sameSite: 'lax',
		path: '/'
	}
}))
app.use(
	cors({
		origin: 'https://huprom-hrms-pms-client.vercel.app',
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		credentials: true
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
