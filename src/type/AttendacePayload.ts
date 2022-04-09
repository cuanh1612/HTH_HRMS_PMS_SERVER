import { Attendance } from '../entities/attendance'

export type createOrUpdateAttendacePayload = Attendance & {
	employees: number[] | string[]
    mark_attendance_by: 'Month' | 'Date'
    year: string
    month: string
    dates: Date[]
}
