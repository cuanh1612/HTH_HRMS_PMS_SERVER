import { Response } from 'express'
import { Project } from '../entities/Project'
import { Project_Activity } from '../entities/Project_Activity'

// compare time
export const compareDateTime = (
	date1: string,
	date2: string,
	inClock: string,
	outClock: string
) => {
	if (new Date(date1) == new Date(date2)) {
		const inClockSplit = inClock.split(' ')
		const outClockSplit = outClock.split(' ')
		if (inClockSplit[1] == 'PM' && outClockSplit[1] == 'AM') {
			return true
		}
		const timeInClock = inClockSplit[0].split(':')
		const timeOutClock = outClockSplit[0].split(':')
		if (Number(timeInClock[0]) >= Number(timeOutClock[0])) {
			return true
		}
		if (
			timeInClock[0] == timeOutClock[0] &&
			timeOutClock[1] <= timeInClock[1] &&
			inClockSplit[1] == 'PM' &&
			outClockSplit[1] == 'AM'
		) {
			return true
		}
	}

	if (new Date(date1) > new Date(date2)) {
		return true
	}
	return false
}

//Project Activity Notification
export const CreateProjectActivity = async (
	res: Response,
	projectId: number | string,
	content: string
) => {
	if (!projectId && content)
		return res.status(400).json({
			code: 400,
			status: false,
			message: 'Please enter full fields',
		})

	const existingProject = await Project.findOne({
		where: {
			id: Number(projectId),
		},
	})

	if (!existingProject)
		return res.status(400).json({
			code: 400,
			status: false,
			message: 'Project does not existing in the system',
		})

	const currentDate = new Date()

	const time =
		currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds()

	const projectActivity = await Project_Activity.create({
		project: existingProject,
		content,
		time,
	}).save()

	const listOfActivity = await Project_Activity.find({
		where: {
			project: {
				id: existingProject.id,
			},
		},
		order: {
			createdAt: 'DESC',
		},
	})

	//remove oldest item of activities list when have over 100 items
	if (Array.isArray(listOfActivity) && listOfActivity.length > 100) {
		await listOfActivity[0].remove()
	}

	return projectActivity
}

// return start time and end time of month to filter in postgres
export const getSETime = (value: Date)=> {
	const date = new Date(value)
		const firstDate = new Date(date.setDate(1))
		let lastDate = new Date (new Date((date.setMonth(date.getMonth() + 1))).setDate(0));
		const currentDate = new Date()
		if(currentDate.getTime() >= firstDate.getTime() && currentDate.getTime() < lastDate.getTime()) {
			lastDate = currentDate
		}
		return {
			firstTime: `${firstDate.getFullYear()}-${firstDate.getMonth()+1}-1`,
			lastTime: `${lastDate.getFullYear()}-${lastDate.getMonth()+1}-${lastDate.getDate()}`,
			firstTimeDate: firstDate,
			lastTimeDate: lastDate,
			lastDate: lastDate.getDate()
		}
}
