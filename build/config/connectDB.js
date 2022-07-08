"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Attendance_1 = require("../entities/Attendance");
const Avatar_1 = require("../entities/Avatar");
const Client_1 = require("../entities/Client");
const Client_Category_1 = require("../entities/Client_Category");
const Client_Sub_Category_1 = require("../entities/Client_Sub_Category");
const Company_Info_1 = require("../entities/Company_Info");
const Company_Logo_1 = require("../entities/Company_Logo");
const Contract_1 = require("../entities/Contract");
const Contract_File_1 = require("../entities/Contract_File");
const Contract_Type_1 = require("../entities/Contract_Type");
const Conversation_1 = require("../entities/Conversation");
const Conversation_Reply_1 = require("../entities/Conversation_Reply");
const Department_1 = require("../entities/Department");
const Designation_1 = require("../entities/Designation");
const Discussion_1 = require("../entities/Discussion");
const Employee_1 = require("../entities/Employee");
const Event_1 = require("../entities/Event");
const Holiday_1 = require("../entities/Holiday");
const Hourly_rate_project_1 = require("../entities/Hourly_rate_project");
const Interview_1 = require("../entities/Interview");
const Interview_File_1 = require("../entities/Interview_File");
const Job_1 = require("../entities/Job");
const Job_Application_1 = require("../entities/Job_Application");
const Job_Application_File_1 = require("../entities/Job_Application_File");
const Job_Application_Picture_1 = require("../entities/Job_Application_Picture");
const Job_Type_1 = require("../entities/Job_Type");
const Leave_1 = require("../entities/Leave");
const Leave_Type_1 = require("../entities/Leave_Type");
const Location_1 = require("../entities/Location");
const Milestone_1 = require("../entities/Milestone");
const Notice_Board_1 = require("../entities/Notice_Board");
const Notification_1 = require("../entities/Notification");
const Project_1 = require("../entities/Project");
const Project_Category_1 = require("../entities/Project_Category");
const Project_Discussion_Category_1 = require("../entities/Project_Discussion_Category");
const Project_Discussion_Reply_1 = require("../entities/Project_Discussion_Reply");
const Project_Discussion_Room_1 = require("../entities/Project_Discussion_Room");
const Project_File_1 = require("../entities/Project_File");
const Project_Note_1 = require("../entities/Project_Note");
const Room_1 = require("../entities/Room");
const Salary_1 = require("../entities/Salary");
const Sign_1 = require("../entities/Sign");
const Skill_1 = require("../entities/Skill");
const Status_1 = require("../entities/Status");
const StickyNote_1 = require("../entities/StickyNote");
const Task_1 = require("../entities/Task");
const Task_Category_1 = require("../entities/Task_Category");
const Task_Comment_1 = require("../entities/Task_Comment");
const Task_File_1 = require("../entities/Task_File");
const Time_Log_1 = require("../entities/Time_Log");
const Work_Experience_1 = require("../entities/Work_Experience");
const connectDB = () => {
    (0, typeorm_1.createConnection)({
        type: 'postgres',
        name: 'huprom',
        logging: true,
        database: 'HTH_HRMS_PMS',
        password: '161201',
        username: 'postgres',
        synchronize: true,
        port: 5432,
        // url: `${process.env.DB_URL}`,
        // ssl: {
        // 	rejectUnauthorized: false
        // },
        entities: [
            Employee_1.Employee,
            Avatar_1.Avatar,
            Designation_1.Designation,
            Department_1.Department,
            Leave_1.Leave,
            Leave_Type_1.Leave_type,
            Client_1.Client,
            Client_Category_1.Client_Category,
            Client_Sub_Category_1.Client_Sub_Category,
            Holiday_1.Holiday,
            Contract_1.Contract,
            Company_Logo_1.Company_logo,
            Sign_1.Sign,
            Contract_Type_1.Contract_type,
            Attendance_1.Attendance,
            Conversation_1.Conversation,
            Conversation_Reply_1.Conversation_reply,
            Event_1.Event,
            Discussion_1.Discussion,
            Contract_File_1.Contract_file,
            Project_1.Project,
            Project_Category_1.Project_Category,
            Project_File_1.Project_file,
            Task_1.Task,
            Task_Category_1.Task_Category,
            Task_File_1.Task_file,
            Salary_1.Salary,
            Notice_Board_1.Notice_board,
            Project_Discussion_Category_1.Project_discussion_category,
            Project_Discussion_Reply_1.Project_discussion_reply,
            Project_Discussion_Room_1.Project_Discussion_Room,
            Salary_1.Salary,
            Status_1.Status,
            Project_Note_1.Project_note,
            Hourly_rate_project_1.Hourly_rate_project,
            Milestone_1.Milestone,
            Task_Comment_1.Task_comment,
            Time_Log_1.Time_log,
            Room_1.Room,
            StickyNote_1.Sticky_note,
            Notification_1.Notification,
            Company_Info_1.Company_Info,
            Skill_1.Skill,
            Location_1.Location,
            Job_1.Job,
            Job_Type_1.Job_Type,
            Work_Experience_1.Work_Experience,
            Job_Application_1.Job_Application,
            Job_Application_File_1.Job_application_file,
            Job_Application_Picture_1.Job_application_picture,
            Interview_1.Interview,
            Interview_File_1.Interview_file,
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
