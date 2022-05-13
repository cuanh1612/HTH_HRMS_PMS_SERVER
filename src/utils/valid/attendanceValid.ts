import { Attendance } from '../../entities/Attendance'
import { createOrUpdateAttendacePayload } from '../../type/AttendacePayload'

export const attendanceValid = {
	createOrUpdate: ({
		working_from,
		clock_in_time,
		clock_out_time,
		mark_attendance_by,
		employees,
		dates,
		month,
		year,
	}: createOrUpdateAttendacePayload) => {
		let messageError = ''

		if (
			!working_from ||
			!clock_in_time ||
			!clock_out_time ||
			!mark_attendance_by ||
			!employees ||
			(mark_attendance_by === 'Date' && !dates) ||
			(mark_attendance_by === 'Month' && (!month || !year))
		) {
			messageError = 'Pleas enter full field'
			return messageError
		}

		return messageError
	},

	insertOne: ({clock_in_time, clock_out_time, date, employee}: Attendance) => {
		if(!clock_in_time || !clock_out_time || !date || !employee) {
			const messageError = 'Pleas enter full field'
			return messageError
		}
		return ''
	}
}


