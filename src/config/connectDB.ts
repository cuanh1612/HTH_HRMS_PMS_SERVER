import { createConnection } from 'typeorm'

const connectDB = () => {
	createConnection({
		type: 'postgres',
		database:  process.env.DB_DATABASE,
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		host: process.env.DB_HOST,
		name: 'huprom',
		logging: true,
		synchronize: false,
		port: 5432,
		ssl: {
			rejectUnauthorized: false
		},
		entities: ['build/entities/**/*.js'],
	})
		.then(() => {
			console.log('Connected DB successfully.')
		})
		.catch((error) => {
			console.log('Connect DB false.', error)
		})
}

export default connectDB
