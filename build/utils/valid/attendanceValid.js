"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceValid = void 0;
exports.attendanceValid = {
    createOrUpdate: ({ working_from, clock_in_time, clock_out_time, mark_attendance_by, employees, dates, month, year, }) => {
        let messageError = '';
        if (!working_from ||
            !clock_in_time ||
            !clock_out_time ||
            !mark_attendance_by ||
            !employees ||
            (mark_attendance_by === 'Date' && !dates) ||
            (mark_attendance_by === 'Month' && (!month || !year))) {
            messageError = 'Pleas enter full field';
            return messageError;
        }
        return messageError;
    },
};
