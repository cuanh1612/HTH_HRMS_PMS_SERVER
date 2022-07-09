"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const attendanceRouter_1 = __importDefault(require("./attendanceRouter"));
const authRouter_1 = __importDefault(require("./authRouter"));
const clientCategoryRouter_1 = __importDefault(require("./clientCategoryRouter"));
const clientRouter_1 = __importDefault(require("./clientRouter"));
const clientSubCategoryRouter_1 = __importDefault(require("./clientSubCategoryRouter"));
const companyInfoRouter_1 = __importDefault(require("./companyInfoRouter"));
const contractFileRouter_1 = __importDefault(require("./contractFileRouter"));
const contractRouter_1 = __importDefault(require("./contractRouter"));
const contractTypeRouter_1 = __importDefault(require("./contractTypeRouter"));
const conversationReplyRouter_1 = __importDefault(require("./conversationReplyRouter"));
const conversationRouter_1 = __importDefault(require("./conversationRouter"));
const dashboardRouter_1 = __importDefault(require("./dashboardRouter"));
const departmentRouter_1 = __importDefault(require("./departmentRouter"));
const designationRouter_1 = __importDefault(require("./designationRouter"));
const discussionRouter_1 = __importDefault(require("./discussionRouter"));
const employeeRouter_1 = __importDefault(require("./employeeRouter"));
const eventRouter_1 = __importDefault(require("./eventRouter"));
const holidayRouter_1 = __importDefault(require("./holidayRouter"));
const hourlyRateRouter_1 = __importDefault(require("./hourlyRateRouter"));
const interviewFileRouter_1 = __importDefault(require("./interviewFileRouter"));
const interviewRouter_1 = __importDefault(require("./interviewRouter"));
const jobApplicationFileRouter_1 = __importDefault(require("./jobApplicationFileRouter"));
const jobApplicationRouter_1 = __importDefault(require("./jobApplicationRouter"));
const jobOfferLetterRouter_1 = __importDefault(require("./jobOfferLetterRouter"));
const jobRouter_1 = __importDefault(require("./jobRouter"));
const jobTypeRouter_1 = __importDefault(require("./jobTypeRouter"));
const leaveRouter_1 = __importDefault(require("./leaveRouter"));
const leaveTypeRouter_1 = __importDefault(require("./leaveTypeRouter"));
const locationRouter_1 = __importDefault(require("./locationRouter"));
const milestoneRouter_1 = __importDefault(require("./milestoneRouter"));
const noticeBoardRouter_1 = __importDefault(require("./noticeBoardRouter"));
const notificationRouter_1 = __importDefault(require("./notificationRouter"));
const projectCategoryRouter_1 = __importDefault(require("./projectCategoryRouter"));
const projectDiscussionCategoryRouter_1 = __importDefault(require("./projectDiscussionCategoryRouter"));
const projectDiscussionReplyRouter_1 = __importDefault(require("./projectDiscussionReplyRouter"));
const projectDiscussionRoomRouter_1 = __importDefault(require("./projectDiscussionRoomRouter"));
const projectFileRouter_1 = __importDefault(require("./projectFileRouter"));
const projectNoteRouter_1 = __importDefault(require("./projectNoteRouter"));
const projectRouter_1 = __importDefault(require("./projectRouter"));
const roomRouter_1 = __importDefault(require("./roomRouter"));
const salaryRouter_1 = __importDefault(require("./salaryRouter"));
const signRouter_1 = __importDefault(require("./signRouter"));
const skillRouter_1 = __importDefault(require("./skillRouter"));
const statusRouter_1 = __importDefault(require("./statusRouter"));
const stickyNoteRouter_1 = __importDefault(require("./stickyNoteRouter"));
const taskCategoryRouter_copy_1 = __importDefault(require("./taskCategoryRouter copy"));
const taskCommentRouter_1 = __importDefault(require("./taskCommentRouter"));
const taskFileRouter_1 = __importDefault(require("./taskFileRouter"));
const taskRouter_1 = __importDefault(require("./taskRouter"));
const timeLogRouter_1 = __importDefault(require("./timeLogRouter"));
const workExperience_1 = __importDefault(require("./workExperience"));
function mainRouter(app) {
    app.use('/api/auth', authRouter_1.default);
    app.use('/api/employees', employeeRouter_1.default);
    app.use('/api/departments', departmentRouter_1.default);
    app.use('/api/designations', designationRouter_1.default);
    app.use('/api/leave-types', leaveTypeRouter_1.default);
    app.use('/api/leaves', leaveRouter_1.default);
    app.use('/api/clients', clientRouter_1.default);
    app.use('/api/holidays', holidayRouter_1.default);
    app.use('/api/client-categories', clientCategoryRouter_1.default);
    app.use('/api/client-sub-categories', clientSubCategoryRouter_1.default);
    app.use('/api/contracts', contractRouter_1.default);
    app.use('/api/contract-types', contractTypeRouter_1.default);
    app.use('/api/project-categories', projectCategoryRouter_1.default);
    app.use('/api/projects', projectRouter_1.default);
    app.use('/api/attendances', attendanceRouter_1.default);
    app.use('/api/signs', signRouter_1.default);
    app.use('/api/conversations', conversationRouter_1.default);
    app.use('/api/conversation-replies', conversationReplyRouter_1.default);
    app.use('/api/discussions', discussionRouter_1.default);
    app.use('/api/contract-files', contractFileRouter_1.default);
    app.use('/api/events', eventRouter_1.default);
    app.use('/api/task-categories', taskCategoryRouter_copy_1.default);
    app.use('/api/project-files', projectFileRouter_1.default);
    app.use('/api/task-files', taskFileRouter_1.default);
    app.use('/api/project-discussion-categories', projectDiscussionCategoryRouter_1.default);
    app.use('/api/project-discussion-replies', projectDiscussionReplyRouter_1.default);
    app.use('/api/dashboard', dashboardRouter_1.default);
    app.use('/api/salaries', salaryRouter_1.default);
    app.use('/api/notice-boards', noticeBoardRouter_1.default);
    app.use('/api/project-discussion-rooms', projectDiscussionRoomRouter_1.default);
    app.use('/api/status', statusRouter_1.default);
    app.use('/api/tasks', taskRouter_1.default);
    app.use('/api/project-notes', projectNoteRouter_1.default);
    app.use('/api/hourly-Rate', hourlyRateRouter_1.default);
    app.use('/api/milestone', milestoneRouter_1.default);
    app.use('/api/task-comments', taskCommentRouter_1.default);
    app.use('/api/time-logs', timeLogRouter_1.default);
    app.use('/api/sticky-notes', stickyNoteRouter_1.default);
    app.use('/api/rooms', roomRouter_1.default);
    app.use('/api/notifications', notificationRouter_1.default);
    app.use('/api/company-info', companyInfoRouter_1.default);
    app.use('/api/skills', skillRouter_1.default);
    app.use('/api/locations', locationRouter_1.default);
    app.use('/api/job-types', jobTypeRouter_1.default);
    app.use('/api/work-experiences', workExperience_1.default);
    app.use('/api/jobs', jobRouter_1.default);
    app.use('/api/job-applications', jobApplicationRouter_1.default);
    app.use('/api/interviews', interviewRouter_1.default);
    app.use('/api/interview-files', interviewFileRouter_1.default);
    app.use('/api/job-application-files', jobApplicationFileRouter_1.default);
    app.use('/api/job-offer-letters', jobOfferLetterRouter_1.default);
}
exports.default = mainRouter;
