import { Attendance } from "../entities/Attendance"

export type createOrUpdateAttendancePayload = Attendance & {
	employees: number[] | string[]
    mark_attendance_by: 'Month' | 'Date'
    year: string
    month: string
    dates: Date[]
}
