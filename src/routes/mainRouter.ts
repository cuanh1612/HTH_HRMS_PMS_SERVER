import * as core from 'express-serve-static-core'
import attendanceRouter from './attendance.router'
import authRouter from './auth.router'
import clientCategoryRouter from './clientCategory.router'
import clientRouter from './client.router'
import clientSubCategoryRouter from './clientSubCategory.router'
import companyInfoRouter from './companyInfo.router'
import contractFileRouter from './contractFile.router'
import contractRouter from './contract.router'
import contractTypeRouter from './contractType.router'
import conversationReplyRouter from './conversationReply.router'
import conversationRouter from './conversation.router'
import dashboardJobsRouter from './dashboardJobs.router'
import dashboardRouter from './dashboard.router'
import departmentRouter from './department.router'
import designationRouter from './designation.router'
import discussionRouter from './discussion.router'
import employeeRouter from './employee.router'
import eventRouter from './event.router'
import holidayRouter from './holiday.router'
import hourlyRateRouter from './hourlyRate.router'
import interviewFileRouter from './interviewFile.router'
import interviewRouter from './interview.router'
import jobApplicationFileRouter from './jobApplicationFile.router'
import jobApplicationRouter from './jobApplication.router'
import jobOfferLetterRouter from './jobOfferLetter.router'
import jobRouter from './job.router'
import jobTypeRouter from './jobType.router'
import leaveRouter from './leave.router'
import leaveTypeRouter from './leaveType.router'
import locationRouter from './location.router'
import milestoneRouter from './milestone.router'
import noticeBoardRouter from './noticeBoard.router'
import NotificationRouter from './notification.router'
import projectActivityRouter from './projectActivity.router'
import projectCategoryRouter from './projectCategory.router'
import projectDiscussionCategoryRouter from './projectDiscussionCategory.router'
import projectDiscussionReplyRouter from './projectDiscussionReply.router'
import projectDiscussionRoomRouter from './projectDiscussionRoom.router'
import projectFileRouter from './projectFile.router'
import projectNoteRouter from './projectNote.router'
import projectRouter from './project.router'
import roomRouter from './room.router'
import salaryRouter from './salary.router'
import signRouter from './sign.router'
import skillRouter from './skill.router'
import statusRouter from './status.router'
import stickyNoteRouter from './stickyNote.router'
import taskCategoryRouter from './taskCategory.router'
import taskCommentRouter from './taskComment.router'
import taskFileRouter from './taskFile.router'
import taskRouter from './task.router'
import TimeLogRouter from './timeLog.router'
import workExperienceRouter from './workExperience.router'
import contactRouter from './contact.router'

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

	app.use('/api/project-activities', projectActivityRouter)

	app.use('/api/contact', contactRouter)
}

export default mainRouter
