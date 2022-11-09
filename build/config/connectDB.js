"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Attendance_entity_1 = require("../entities/Attendance.entity");
const Avatar_entity_1 = require("../entities/Avatar.entity");
const Client_entity_1 = require("../entities/Client.entity");
const Client_Category_entity_1 = require("../entities/Client_Category.entity");
const Client_Sub_Category_entity_1 = require("../entities/Client_Sub_Category.entity");
const Company_Info_entity_1 = require("../entities/Company_Info.entity");
const Company_Logo_entity_1 = require("../entities/Company_Logo.entity");
const Contract_entity_1 = require("../entities/Contract.entity");
const Contract_File_entity_1 = require("../entities/Contract_File.entity");
const Contract_Type_entity_1 = require("../entities/Contract_Type.entity");
const Conversation_entity_1 = require("../entities/Conversation.entity");
const Conversation_Reply_entity_1 = require("../entities/Conversation_Reply.entity");
const Department_entity_1 = require("../entities/Department.entity");
const Designation_entity_1 = require("../entities/Designation.entity");
const Discussion_entity_1 = require("../entities/Discussion.entity");
const Employee_entity_1 = require("../entities/Employee.entity");
const Event_entity_1 = require("../entities/Event.entity");
const Holiday_entity_1 = require("../entities/Holiday.entity");
const Hourly_rate_project_entity_1 = require("../entities/Hourly_rate_project.entity");
const Interview_entity_1 = require("../entities/Interview.entity");
const Interview_File_entity_1 = require("../entities/Interview_File.entity");
const Job_entity_1 = require("../entities/Job.entity");
const Job_Application_entity_1 = require("../entities/Job_Application.entity");
const Job_Application_File_entity_1 = require("../entities/Job_Application_File.entity");
const Job_Application_Picture_entity_1 = require("../entities/Job_Application_Picture.entity");
const Job_Offer_Letter_entity_1 = require("../entities/Job_Offer_Letter.entity");
const Job_Type_entity_1 = require("../entities/Job_Type.entity");
const Leave_entity_1 = require("../entities/Leave.entity");
const Leave_Type_entity_1 = require("../entities/Leave_Type.entity");
const Location_entity_1 = require("../entities/Location.entity");
const Milestone_entity_1 = require("../entities/Milestone.entity");
const Notice_Board_entity_1 = require("../entities/Notice_Board.entity");
const Notification_entity_1 = require("../entities/Notification.entity");
const Project_entity_1 = require("../entities/Project.entity");
const Project_Activity_entity_1 = require("../entities/Project_Activity.entity");
const Project_Category_entity_1 = require("../entities/Project_Category.entity");
const Project_Discussion_Category_entity_1 = require("../entities/Project_Discussion_Category.entity");
const Project_Discussion_Reply_entity_1 = require("../entities/Project_Discussion_Reply.entity");
const Project_Discussion_Room_entity_1 = require("../entities/Project_Discussion_Room.entity");
const Project_File_entity_1 = require("../entities/Project_File.entity");
const Project_Note_entity_1 = require("../entities/Project_Note.entity");
const Room_entity_1 = require("../entities/Room.entity");
const Salary_entity_1 = require("../entities/Salary.entity");
const Sign_entity_1 = require("../entities/Sign.entity");
const Skill_entity_1 = require("../entities/Skill.entity");
const Status_entity_1 = require("../entities/Status.entity");
const StickyNote_entity_1 = require("../entities/StickyNote.entity");
const Task_entity_1 = require("../entities/Task.entity");
const Task_Category_entity_1 = require("../entities/Task_Category.entity");
const Task_Comment_entity_1 = require("../entities/Task_Comment.entity");
const Task_File_entity_1 = require("../entities/Task_File.entity");
const Time_Log_entity_1 = require("../entities/Time_Log.entity");
const Work_Experience_entity_1 = require("../entities/Work_Experience.entity");
const connectDB = () => {
    (0, typeorm_1.createConnection)({
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
            Employee_entity_1.Employee,
            Avatar_entity_1.Avatar,
            Designation_entity_1.Designation,
            Department_entity_1.Department,
            Leave_entity_1.Leave,
            Leave_Type_entity_1.Leave_type,
            Client_entity_1.Client,
            Client_Category_entity_1.Client_Category,
            Client_Sub_Category_entity_1.Client_Sub_Category,
            Holiday_entity_1.Holiday,
            Contract_entity_1.Contract,
            Company_Logo_entity_1.Company_logo,
            Sign_entity_1.Sign,
            Contract_Type_entity_1.Contract_type,
            Attendance_entity_1.Attendance,
            Conversation_entity_1.Conversation,
            Conversation_Reply_entity_1.Conversation_reply,
            Event_entity_1.Event,
            Discussion_entity_1.Discussion,
            Contract_File_entity_1.Contract_file,
            Project_entity_1.Project,
            Project_Category_entity_1.Project_Category,
            Project_File_entity_1.Project_file,
            Task_entity_1.Task,
            Task_Category_entity_1.Task_Category,
            Task_File_entity_1.Task_file,
            Salary_entity_1.Salary,
            Notice_Board_entity_1.Notice_board,
            Project_Discussion_Category_entity_1.Project_discussion_category,
            Project_Discussion_Reply_entity_1.Project_discussion_reply,
            Project_Discussion_Room_entity_1.Project_Discussion_Room,
            Salary_entity_1.Salary,
            Status_entity_1.Status,
            Project_Note_entity_1.Project_note,
            Hourly_rate_project_entity_1.Hourly_rate_project,
            Milestone_entity_1.Milestone,
            Task_Comment_entity_1.Task_comment,
            Time_Log_entity_1.Time_log,
            Room_entity_1.Room,
            StickyNote_entity_1.Sticky_note,
            Notification_entity_1.Notification,
            Company_Info_entity_1.Company_Info,
            Skill_entity_1.Skill,
            Location_entity_1.Location,
            Job_entity_1.Job,
            Job_Type_entity_1.Job_Type,
            Work_Experience_entity_1.Work_Experience,
            Job_Application_entity_1.Job_Application,
            Job_Application_File_entity_1.Job_application_file,
            Job_Application_Picture_entity_1.Job_application_picture,
            Interview_entity_1.Interview,
            Interview_File_entity_1.Interview_file,
            Job_Offer_Letter_entity_1.Job_offer_letter,
            Project_Activity_entity_1.Project_Activity
        ],
    })
        .then(() => {
        console.log('Connected DB successfully.');
    })
        .catch((error) => {
        console.log('Connect DB false.', error);
    });
};
exports.default = connectDB;
