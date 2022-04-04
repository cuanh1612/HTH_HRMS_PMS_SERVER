import { createConnection } from 'typeorm'
import { Avatar } from '../entities/Avatar'
<<<<<<< HEAD
=======
import { Client } from '../entities/Client'
import { Client_Category } from '../entities/Client_Category'
import { Client_Sub_Category } from '../entities/Client_Sub_Category'
>>>>>>> 42a1af8692869b53a96be797f4bc000726c65cc6
import { Department } from '../entities/Department'
import { Designation } from '../entities/Designation'
import { Employee } from '../entities/Employee'
import { Leave } from '../entities/Leave'
import { LeaveType } from '../entities/LeaveType'

const connectDB = () => {
	createConnection({
		type: 'postgres',
<<<<<<< HEAD
		database: 'hth_hrms_pms',
=======
		database: 'HTH_HRMS_PMS',
>>>>>>> 42a1af8692869b53a96be797f4bc000726c65cc6
		username: process.env.DB_USERNAME_DEV,
		password: process.env.DB_PASSWORD_DEV,
		logging: true,
		synchronize: true,
<<<<<<< HEAD
		entities: [Employee, Avatar, Designation, Department, Leave, LeaveType],
=======
		entities: [
			Employee,
			Avatar,
			Designation,
			Department,
			Leave,
			LeaveType,
			Client,
			Client_Category,
			Client_Sub_Category,
		],
>>>>>>> 42a1af8692869b53a96be797f4bc000726c65cc6
	})
		.then(() => {
			console.log('Connected DB successfully.')
		})
		.catch((error) => {
			console.log('Connect DB false.', error)
		})
}

export default connectDB
