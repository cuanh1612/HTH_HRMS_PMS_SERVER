"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const attendance_1 = require("../entities/attendance");
const Employee_1 = require("../entities/Employee");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const attendanceValid_1 = require("../utils/valid/attendanceValid");
const attendanceController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewAttendances = req.body;
        const { mark_attendance_by, dates, employees, month, year, employee, date } = dataNewAttendances;
        //Check valid
        const messageValid = attendanceValid_1.attendanceValid.createOrUpdate(dataNewAttendances);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        if (mark_attendance_by === 'Date' && dates.length > 0 && employees.length > 0) {
            for (let index = 0; index < dates.length; index++) {
                const date = dates[index];
                for (let index = 0; index < employees.length; index++) {
                    const employeeId = employees[index];
                    //Get exist employee
                    const existingEmployee = yield Employee_1.Employee.findOne({
                        where: {
                            id: Number(employeeId),
                        },
                    });
                    //Check exist attendance
                    const existingAttendance = yield (0, typeorm_1.getManager)()
                        .getRepository(attendance_1.Attendance)
                        .createQueryBuilder('attendance')
                        .where('attendance.employeeId = :id', { id: employeeId })
                        .andWhere('attendance.date = :date', { date })
                        .getOne();
                    //Create new attendance
                    existingEmployee &&
                        !existingAttendance &&
                        (yield attendance_1.Attendance.create(Object.assign(Object.assign({}, dataNewAttendances), { date, employee: existingEmployee })).save());
                }
            }
        }
        else if (mark_attendance_by === 'Month' && employees.length > 0) {
            //Set date start mark attendance is 1
            let dateMark = new Date(`4-1-${year}`);
            //Get date next month
            const dateNextMonth = new Date(`${Number(month) + 1}-1-${year}`);
            //Get date now -1
            let dateNow = new Date();
            dateNow.setDate(dateNow.getDate() - 1);
            while (dateMark < dateNextMonth && dateMark < dateNow) {
                for (let index = 0; index < employees.length; index++) {
                    const employeeId = employees[index];
                    //Get exist employee
                    const existingEmployee = yield Employee_1.Employee.findOne({
                        where: {
                            id: Number(employeeId),
                        },
                    });
                    //Check exist attendance
                    const existingAttendance = yield (0, typeorm_1.getManager)()
                        .getRepository(attendance_1.Attendance)
                        .createQueryBuilder('attendance')
                        .where('attendance.employeeId = :id', { id: employeeId })
                        .andWhere('attendance.date = :date', { date: dateMark })
                        .getOne();
                    //Create new attendance
                    existingEmployee &&
                        !existingAttendance &&
                        (yield attendance_1.Attendance.create(Object.assign(Object.assign({}, dataNewAttendances), { date: dateMark, employee: existingEmployee })).save());
                    //increase datemark 1 day
                    dateMark.setDate(dateMark.getDate() + 1);
                }
            }
        }
        else {
            //Get exist employee
            const existingEmployee = yield Employee_1.Employee.findOne({
                where: {
                    id: Number(employee),
                },
            });
            //Check exist attendance
            const existingAttendance = yield (0, typeorm_1.getManager)()
                .getRepository(attendance_1.Attendance)
                .createQueryBuilder('attendance')
                .where('attendance.employeeId = :id', { id: employee })
                .andWhere('attendance.date = :date', { date })
                .getOne();
            //Create new attendance
            existingEmployee &&
                !existingAttendance &&
                (yield attendance_1.Attendance.create(Object.assign(Object.assign({}, dataNewAttendances), { date, employee: existingEmployee })).save());
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Mark attendances successfully',
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpAttendances = req.body;
        //Check exist attendance
        const exisitingAttendance = yield attendance_1.Attendance.findOne({
            where: {
                id: Number(id)
            }
        });
        if (!exisitingAttendance)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Attendance does not exist in the system',
            });
        yield attendance_1.Attendance.update(id, Object.assign({}, dataUpAttendances));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update attendance successfully',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        //Check existing attendance
        const existingAttendance = yield attendance_1.Attendance.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingAttendance)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Attendance does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            attendance: existingAttendance,
            message: 'Get detail attendance successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        //Check existing attendance
        const existingAttendance = yield attendance_1.Attendance.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingAttendance)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Attendance does not exist in the system',
            });
        //Delete attendance
        yield existingAttendance.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete attendance successfully',
        });
    })),
};
exports.default = attendanceController;
