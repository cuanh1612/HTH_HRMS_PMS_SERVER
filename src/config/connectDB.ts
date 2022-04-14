import { createConnection } from 'typeorm'
import { Avatar } from '../entities/Avatar'
import { Client } from '../entities/Client'
import { Client_Category } from '../entities/Client_Category'
import { Client_Sub_Category } from '../entities/Client_Sub_Category'
import { Company_logo } from '../entities/CompanyLogo'
import { Department } from '../entities/Department'
import { Designation } from '../entities/Designation'
import { Employee } from '../entities/Employee'
import { Holiday } from '../entities/Holiday'
import { Leave } from '../entities/Leave'
import { LeaveType } from '../entities/LeaveType'
import { Sign } from '../entities/Sign'
import { Contract } from '../entities/Contract'
import { ContractType } from '../entities/ContractType'
import { Attendance } from '../entities/Attendance'
import { Conversation } from '../entities/Conversation'
import { Conversation_reply } from '../entities/ConversationReply'

const connectDB = () => {
	createConnection({
		type: 'postgres',
		database: 'hth_hrms_pms',
		username: process.env.DB_USERNAME_DEV,
		password: process.env.DB_PASSWORD_DEV,
		logging: true,
		synchronize: true,
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
			Holiday,
			Contract,
			Company_logo,
			Sign,
			ContractType,
			Attendance,
			Conversation,
			Conversation_reply
		],
	})
		.then(() => {
			console.log('Connected DB successfully.')
		})
		.catch((error) => {
			console.log('Connect DB false.', error)
		})
}

export default connectDB
