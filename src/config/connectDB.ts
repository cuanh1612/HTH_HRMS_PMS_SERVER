import { createConnection } from 'typeorm'
import { Avatar } from '../entities/Avatar'
import { Department } from '../entities/Department'
import { Designation } from '../entities/Designation'
import { Employee } from '../entities/Employee'

const connectDB = () => {
	createConnection({
		type: 'postgres',
		database: 'hth_hrms_pms',
		username: process.env.DB_USERNAME_DEV,
		password: process.env.DB_PASSWORD_DEV,
		logging: true,
		synchronize: true,
		entities: [Employee, Avatar, Designation, Department],
	})
		.then(() => {
			console.log('Connected DB successfully.')
		})
		.catch((error) => {
			console.log('Connect DB false.', error)
		})
}

export default connectDB
