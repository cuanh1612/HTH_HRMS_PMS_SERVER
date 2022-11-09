import { createConnection } from 'typeorm'
import { Attendance } from '../entities/Attendance.entity'
import { Avatar } from '../entities/Avatar.entity'
import { Client } from '../entities/Client.entity'
import { Client_Category } from '../entities/Client_Category.entity'
import { Client_Sub_Category } from '../entities/Client_Sub_Category.entity'
import { Company_Info } from '../entities/Company_Info.entity'
import { Company_logo } from '../entities/Company_Logo.entity'
import { Contract } from '../entities/Contract.entity'
import { Contract_file } from '../entities/Contract_File.entity'
import { Contract_type } from '../entities/Contract_Type.entity'
import { Conversation } from '../entities/Conversation.entity'
import { Conversation_reply } from '../entities/Conversation_Reply.entity'
import { Department } from '../entities/Department.entity'
import { Designation } from '../entities/Designation.entity'
import { Discussion } from '../entities/Discussion.entity'
import { Employee } from '../entities/Employee.entity'
import { Event } from '../entities/Event.entity'
import { Holiday } from '../entities/Holiday.entity'
import { Hourly_rate_project } from '../entities/Hourly_rate_project.entity'
import { Interview } from '../entities/Interview.entity'
import { Interview_file } from '../entities/Interview_File.entity'
import { Job } from '../entities/Job.entity'
import { Job_Application } from '../entities/Job_Application.entity'
import { Job_application_file } from '../entities/Job_Application_File.entity'
import { Job_application_picture } from '../entities/Job_Application_Picture.entity'
import { Job_offer_letter } from '../entities/Job_Offer_Letter.entity'
import { Job_Type } from '../entities/Job_Type.entity'
import { Leave } from '../entities/Leave.entity'
import { Leave_type } from '../entities/Leave_Type.entity'
import { Location } from '../entities/Location.entity'
import { Milestone } from '../entities/Milestone.entity'
import { Notice_board } from '../entities/Notice_Board.entity'
import { Notification } from '../entities/Notification.entity'
import { Project } from '../entities/Project.entity'
import { Project_Activity } from '../entities/Project_Activity.entity'
import { Project_Category } from '../entities/Project_Category.entity'
import { Project_discussion_category } from '../entities/Project_Discussion_Category.entity'
import { Project_discussion_reply } from '../entities/Project_Discussion_Reply.entity'
import { Project_Discussion_Room } from '../entities/Project_Discussion_Room.entity'
import { Project_file } from '../entities/Project_File.entity'
import { Project_note } from '../entities/Project_Note.entity'
import { Room } from '../entities/Room.entity'
import { Salary } from '../entities/Salary.entity'
import { Sign } from '../entities/Sign.entity'
import { Skill } from '../entities/Skill.entity'
import { Status } from '../entities/Status.entity'
import { Sticky_note } from '../entities/StickyNote.entity'
import { Task } from '../entities/Task.entity'
import { Task_Category } from '../entities/Task_Category.entity'
import { Task_comment } from '../entities/Task_Comment.entity'
import { Task_file } from '../entities/Task_File.entity'
import { Time_log } from '../entities/Time_Log.entity'
import { Work_Experience } from '../entities/Work_Experience.entity'

const connectDB = () => {
	createConnection({
		type: 'postgres',
		name: 'huprom',
		logging: true,
		synchronize: true,
		port: 5432,

		// localhost
		// database: 'hth_hrms_pms',
		// password: 'Truong123456789@',
		// username: 'postgres',
		

		// vercel
		url: `postgres://huprom-server-user:qLOnWGJlU2ZFCgo6@srv-captain--gsieyrxkjb-postgresql-14x:5432/huprom-server-database`,
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
			Notification,
			Company_Info,
			Skill,
			Location,
			Job,
			Job_Type,
			Work_Experience,
			Job_Application,
			Job_application_file,
			Job_application_picture,
			Interview,
			Interview_file,
			Job_offer_letter,
			Project_Activity
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
