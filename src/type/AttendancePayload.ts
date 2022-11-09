import { Attendance } from "../entities/Attendance.entity"

export type createOrUpdateAttendancePayload = Attendance & {
	employees: number[] | string[]
    mark_attendance_by: 'Month' | 'Date'
    year: string
    month: string
    dates: Date[]
}
