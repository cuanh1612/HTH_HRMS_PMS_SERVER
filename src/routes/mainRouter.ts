import * as core from 'express-serve-static-core'
import attendanceRouter from './attendanceRouter'
import authRouter from './authRouter'
import clientCategoryRouter from './clientCategoryRouter'
import clientRouter from './clientRouter'
import clientSubCategoryRouter from './clientSubCategoryRouter'
import companyInfoRouter from './companyInfoRouter'
import contractFileRouter from './contractFileRouter'
import contractRouter from './contractRouter'
import contractTypeRouter from './contractTypeRouter'
import conversationReplyRouter from './conversationReplyRouter'
import conversationRouter from './conversationRouter'
import dashboardJobsRouter from './dashboardJobsRouter'
import dashboardRouter from './dashboardRouter'
import departmentRouter from './departmentRouter'
import designationRouter from './designationRouter'
import discussionRouter from './discussionRouter'
import employeeRouter from './employeeRouter'
import eventRouter from './eventRouter'
import holidayRouter from './holidayRouter'
import hourlyRateRouter from './hourlyRateRouter'
import interviewFileRouter from './interviewFileRouter'
import interviewRouter from './interviewRouter'
import jobApplicationFileRouter from './jobApplicationFileRouter'
import jobApplicationRouter from './jobApplicationRouter'
import jobOfferLetterRouter from './jobOfferLetterRouter'
import jobRouter from './jobRouter'
import jobTypeRouter from './jobTypeRouter'
import leaveRouter from './leaveRouter'
import leaveTypeRouter from './leaveTypeRouter'
import locationRouter from './locationRouter'
import milestoneRouter from './milestoneRouter'
import noticeBoardRouter from './noticeBoardRouter'
import NotificationRouter from './notificationRouter'
import projectCategoryRouter from './projectCategoryRouter'
import projectDiscussionCategoryRouter from './projectDiscussionCategoryRouter'
import projectDiscussionReplyRouter from './projectDiscussionReplyRouter'
import projectDiscussionRoomRouter from './projectDiscussionRoomRouter'
import projectFileRouter from './projectFileRouter'
import projectNoteRouter from './projectNoteRouter'
import projectRouter from './projectRouter'
import roomRouter from './roomRouter'
import salaryRouter from './salaryRouter'
import signRouter from './signRouter'
import skillRouter from './skillRouter'
import statusRouter from './statusRouter'
import stickyNoteRouter from './stickyNoteRouter'
import taskCategoryRouter from './taskCategoryRouter copy'
import taskCommentRouter from './taskCommentRouter'
import taskFileRouter from './taskFileRouter'
import taskRouter from './taskRouter'
import TimeLogRouter from './timeLogRouter'
import workExperienceRouter from './workExperience'

function mainRouter(app: core.Express) {
	app.use('/api/auth', authRouter)

	app.use('/api/employees', employeeRouter)

	app.use('/api/departments', departmentRouter)

	app.use('/api/designations', designationRouter)

	app.use('/api/leave-types', leaveTypeRouter)

	app.use('/api/leaves', leaveRouter)

	app.use('/api/clients', clientRouter)

	app.use('/api/holidays', holidayRouter)

	app.use('/api/client-categories', clientCategoryRouter)

	app.use('/api/client-sub-categories', clientSubCategoryRouter)

	app.use('/api/contracts', contractRouter)

	app.use('/api/contract-types', contractTypeRouter)

	app.use('/api/project-categories', projectCategoryRouter)

	app.use('/api/projects', projectRouter)

	app.use('/api/attendances', attendanceRouter)

	app.use('/api/signs', signRouter)

	app.use('/api/conversations', conversationRouter)

	app.use('/api/conversation-replies', conversationReplyRouter)

	app.use('/api/discussions', discussionRouter)

	app.use('/api/contract-files', contractFileRouter)

	app.use('/api/events', eventRouter)

	app.use('/api/task-categories', taskCategoryRouter)

	app.use('/api/project-files', projectFileRouter)

	app.use('/api/task-files', taskFileRouter)

	app.use('/api/project-discussion-categories', projectDiscussionCategoryRouter)

	app.use('/api/project-discussion-replies', projectDiscussionReplyRouter)

	app.use('/api/dashboard', dashboardRouter)

	app.use('/api/dashboard-jobs', dashboardJobsRouter)

	app.use('/api/salaries', salaryRouter)

	app.use('/api/notice-boards', noticeBoardRouter)

	app.use('/api/project-discussion-rooms', projectDiscussionRoomRouter)

	app.use('/api/status', statusRouter)

	app.use('/api/tasks', taskRouter)

	app.use('/api/project-notes', projectNoteRouter)

	app.use('/api/hourly-Rate', hourlyRateRouter)

	app.use('/api/milestone', milestoneRouter)

	app.use('/api/task-comments', taskCommentRouter)

	app.use('/api/time-logs', TimeLogRouter)

	app.use('/api/sticky-notes', stickyNoteRouter)

	app.use('/api/rooms', roomRouter)

	app.use('/api/notifications', NotificationRouter)

	app.use('/api/company-info', companyInfoRouter)

	app.use('/api/skills', skillRouter)

	app.use('/api/locations', locationRouter)

	app.use('/api/job-types', jobTypeRouter)

	app.use('/api/work-experiences', workExperienceRouter)

	app.use('/api/jobs', jobRouter)

	app.use('/api/job-applications', jobApplicationRouter)

	app.use('/api/interviews', interviewRouter)

	app.use('/api/interview-files', interviewFileRouter)

	app.use('/api/job-application-files', jobApplicationFileRouter)

	app.use('/api/job-offer-letters', jobOfferLetterRouter)
}

export default mainRouter
