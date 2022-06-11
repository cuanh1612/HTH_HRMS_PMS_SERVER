import { createConnection } from 'typeorm'
import { Avatar } from '../entities/Avatar'
import { Client } from '../entities/Client'
import { Client_Category } from '../entities/Client_Category'
import { Client_Sub_Category } from '../entities/Client_Sub_Category'
import { Company_logo } from '../entities/Company_Logo'
import { Department } from '../entities/Department'
import { Designation } from '../entities/Designation'
import { Employee } from '../entities/Employee'
import { Holiday } from '../entities/Holiday'
import { Leave } from '../entities/Leave'
import { Leave_type } from '../entities/Leave_Type'
import { Sign } from '../entities/Sign'
import { Contract } from '../entities/Contract'
import { Contract_type } from '../entities/Contract_Type'
import { Attendance } from '../entities/Attendance'
import { Conversation } from '../entities/Conversation'
import { Conversation_reply } from '../entities/Conversation_Reply'
import { Event } from '../entities/Event'
import { Discussion } from '../entities/Discussion'
import { Contract_file } from '../entities/Contract_File'
import { Project } from '../entities/Project'
import { Project_Category } from '../entities/Project_Category'
import { Project_file } from '../entities/Project_File'
import { Task } from '../entities/Task'
import { Task_Category } from '../entities/Task_Category'
import { Task_file } from '../entities/Task_File'
import { Notice_board } from '../entities/Notice_Board'
import { Project_discussion_category } from '../entities/Project_Discussion_Category'
import { Project_discussion_reply } from '../entities/Project_Discussion_Reply'
import { Project_Discussion_Room } from '../entities/Project_Discussion_Room'
import { Salary } from '../entities/Salary'
import { Status } from '../entities/Status'
import { Project_note } from '../entities/Project_Note'
import { Hourly_rate_project } from '../entities/Hourly_rate_project'
import { Milestone } from '../entities/Milestone'
import { Task_comment } from '../entities/Task_Comment'
import { Time_log } from '../entities/Time_Log'
import { Room } from '../entities/Room'
import { Sticky_note } from '../entities/StickyNote'
import { Notification } from '../entities/Notification'

const connectDB = () => {
	createConnection({
		type: 'postgres',
		
		name: 'huprom',
		logging: false,
		synchronize: false,
		url: 'postgres://rolsvfrghljqgx:923226cf35e1aed81f8fa3300de528d0cbf4e145ce736cc0fd427d416a98f53f@ec2-54-76-43-89.eu-west-1.compute.amazonaws.com:5432/dbj2954fbb99p2',
		port: 5432,
		ssl: {
			rejectUnauthorized: false
		},
		entities: [
			Employee,
			Avatar,
			Designation,
			Department,
			Leave,
			Leave_type,
			Client,
			Client_Category,
			Client_Sub_Category,
			Holiday,
			Contract,
			Company_logo,
			Sign,
			Contract_type,
			Attendance,
			Conversation,
			Conversation_reply,
			Event,
			Discussion,
			Contract_file,
			Project,
			Project_Category,
			Project_file,
			Task,
			Task_Category,
			Task_file,
			Salary,
			Notice_board,
			Project_discussion_category,
			Project_discussion_reply,
			Project_Discussion_Room,
			Salary,
			Status,
			Project_note,
			Hourly_rate_project,
			Milestone,
			Task_comment, 
			Time_log,
			Room,
			Sticky_note, 
			Notification
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
