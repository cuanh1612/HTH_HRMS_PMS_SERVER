"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const attendance_router_1 = __importDefault(require("./attendance.router"));
const auth_router_1 = __importDefault(require("./auth.router"));
const clientCategory_router_1 = __importDefault(require("./clientCategory.router"));
const client_router_1 = __importDefault(require("./client.router"));
const clientSubCategory_router_1 = __importDefault(require("./clientSubCategory.router"));
const companyInfo_router_1 = __importDefault(require("./companyInfo.router"));
const contractFile_router_1 = __importDefault(require("./contractFile.router"));
const contract_router_1 = __importDefault(require("./contract.router"));
const contractType_router_1 = __importDefault(require("./contractType.router"));
const conversationReply_router_1 = __importDefault(require("./conversationReply.router"));
const conversation_router_1 = __importDefault(require("./conversation.router"));
const dashboardJobs_router_1 = __importDefault(require("./dashboardJobs.router"));
const dashboard_router_1 = __importDefault(require("./dashboard.router"));
const department_router_1 = __importDefault(require("./department.router"));
const designation_router_1 = __importDefault(require("./designation.router"));
const discussion_router_1 = __importDefault(require("./discussion.router"));
const employee_router_1 = __importDefault(require("./employee.router"));
const event_router_1 = __importDefault(require("./event.router"));
const holiday_router_1 = __importDefault(require("./holiday.router"));
const hourlyRate_router_1 = __importDefault(require("./hourlyRate.router"));
const interviewFile_router_1 = __importDefault(require("./interviewFile.router"));
const interview_router_1 = __importDefault(require("./interview.router"));
const jobApplicationFile_router_1 = __importDefault(require("./jobApplicationFile.router"));
const jobApplication_router_1 = __importDefault(require("./jobApplication.router"));
const jobOfferLetter_router_1 = __importDefault(require("./jobOfferLetter.router"));
const job_router_1 = __importDefault(require("./job.router"));
const jobType_router_1 = __importDefault(require("./jobType.router"));
const leave_router_1 = __importDefault(require("./leave.router"));
const leaveType_router_1 = __importDefault(require("./leaveType.router"));
const location_router_1 = __importDefault(require("./location.router"));
const milestone_router_1 = __importDefault(require("./milestone.router"));
const noticeBoard_router_1 = __importDefault(require("./noticeBoard.router"));
const notification_router_1 = __importDefault(require("./notification.router"));
const projectActivity_router_1 = __importDefault(require("./projectActivity.router"));
const projectCategory_router_1 = __importDefault(require("./projectCategory.router"));
const projectDiscussionCategory_router_1 = __importDefault(require("./projectDiscussionCategory.router"));
const projectDiscussionReply_router_1 = __importDefault(require("./projectDiscussionReply.router"));
const projectDiscussionRoom_router_1 = __importDefault(require("./projectDiscussionRoom.router"));
const projectFile_router_1 = __importDefault(require("./projectFile.router"));
const projectNote_router_1 = __importDefault(require("./projectNote.router"));
const project_router_1 = __importDefault(require("./project.router"));
const room_router_1 = __importDefault(require("./room.router"));
const salary_router_1 = __importDefault(require("./salary.router"));
const sign_router_1 = __importDefault(require("./sign.router"));
const skill_router_1 = __importDefault(require("./skill.router"));
const status_router_1 = __importDefault(require("./status.router"));
const stickyNote_router_1 = __importDefault(require("./stickyNote.router"));
const taskCategory_router_1 = __importDefault(require("./taskCategory.router"));
const taskComment_router_1 = __importDefault(require("./taskComment.router"));
const taskFile_router_1 = __importDefault(require("./taskFile.router"));
const task_router_1 = __importDefault(require("./task.router"));
const timeLog_router_1 = __importDefault(require("./timeLog.router"));
const workExperience_router_1 = __importDefault(require("./workExperience.router"));
const contact_router_1 = __importDefault(require("./contact.router"));
function mainRouter(app) {
    app.use('/api/auth', auth_router_1.default);
    app.use('/api/employees', employee_router_1.default);
    app.use('/api/departments', department_router_1.default);
    app.use('/api/designations', designation_router_1.default);
    app.use('/api/leave-types', leaveType_router_1.default);
    app.use('/api/leaves', leave_router_1.default);
    app.use('/api/clients', client_router_1.default);
    app.use('/api/holidays', holiday_router_1.default);
    app.use('/api/client-categories', clientCategory_router_1.default);
    app.use('/api/client-sub-categories', clientSubCategory_router_1.default);
    app.use('/api/contracts', contract_router_1.default);
    app.use('/api/contract-types', contractType_router_1.default);
    app.use('/api/project-categories', projectCategory_router_1.default);
    app.use('/api/projects', project_router_1.default);
    app.use('/api/attendances', attendance_router_1.default);
    app.use('/api/signs', sign_router_1.default);
    app.use('/api/conversations', conversation_router_1.default);
    app.use('/api/conversation-replies', conversationReply_router_1.default);
    app.use('/api/discussions', discussion_router_1.default);
    app.use('/api/contract-files', contractFile_router_1.default);
    app.use('/api/events', event_router_1.default);
    app.use('/api/task-categories', taskCategory_router_1.default);
    app.use('/api/project-files', projectFile_router_1.default);
    app.use('/api/task-files', taskFile_router_1.default);
    app.use('/api/project-discussion-categories', projectDiscussionCategory_router_1.default);
    app.use('/api/project-discussion-replies', projectDiscussionReply_router_1.default);
    app.use('/api/dashboard', dashboard_router_1.default);
    app.use('/api/dashboard-jobs', dashboardJobs_router_1.default);
    app.use('/api/salaries', salary_router_1.default);
    app.use('/api/notice-boards', noticeBoard_router_1.default);
    app.use('/api/project-discussion-rooms', projectDiscussionRoom_router_1.default);
    app.use('/api/status', status_router_1.default);
    app.use('/api/tasks', task_router_1.default);
    app.use('/api/project-notes', projectNote_router_1.default);
    app.use('/api/hourly-Rate', hourlyRate_router_1.default);
    app.use('/api/milestone', milestone_router_1.default);
    app.use('/api/task-comments', taskComment_router_1.default);
    app.use('/api/time-logs', timeLog_router_1.default);
    app.use('/api/sticky-notes', stickyNote_router_1.default);
    app.use('/api/rooms', room_router_1.default);
    app.use('/api/notifications', notification_router_1.default);
    app.use('/api/company-info', companyInfo_router_1.default);
    app.use('/api/skills', skill_router_1.default);
    app.use('/api/locations', location_router_1.default);
    app.use('/api/job-types', jobType_router_1.default);
    app.use('/api/work-experiences', workExperience_router_1.default);
    app.use('/api/jobs', job_router_1.default);
    app.use('/api/job-applications', jobApplication_router_1.default);
    app.use('/api/interviews', interview_router_1.default);
    app.use('/api/interview-files', interviewFile_router_1.default);
    app.use('/api/job-application-files', jobApplicationFile_router_1.default);
    app.use('/api/job-offer-letters', jobOfferLetter_router_1.default);
    app.use('/api/project-activities', projectActivity_router_1.default);
    app.use('/api/contact', contact_router_1.default);
}
exports.default = mainRouter;
