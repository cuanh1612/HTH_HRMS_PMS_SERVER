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
const Attendance_entity_1 = require("../entities/Attendance.entity");
const Employee_entity_1 = require("../entities/Employee.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const attendanceValid_1 = require("../utils/valid/attendanceValid");
const attendanceController = {
    getAll: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { date, department, employee } = req.query;
        const data = yield Employee_entity_1.Employee.find({
            select: {
                id: true,
                name: true,
                avatar: {
                    url: true,
                },
                department: {
                    id: true,
                    name: true,
                },
                attendances: true,
            },
            where: {
                department: {
                    id: Number(department) || undefined,
                },
                id: Number(employee) || undefined,
            },
        });
        if (date) {
            const dateFilter = new Date(`${date}`);
            data.map((employee) => {
                employee.attendances = employee.attendances.filter((attendance) => {
                    const currentDate = new Date(attendance.date);
                    return (currentDate.getMonth() == dateFilter.getMonth() &&
                        currentDate.getFullYear() == dateFilter.getFullYear());
                });
            });
        }
        return res.json({
            code: 200,
            success: true,
            message: 'Get all attendances successfully',
            data: data || [],
        });
    })),
    insertOne: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employee, date } = req.body;
        const messageValid = attendanceValid_1.attendanceValid.insertOne(req.body);
        if (messageValid) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        }
        const user = yield Employee_entity_1.Employee.findOne({
            select: {
                attendances: true,
            },
            where: {
                id: Number(employee),
            },
        });
        if (!user) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User not exist',
            });
        }
        const attendanceExist = user === null || user === void 0 ? void 0 : user.attendances.find((attendance) => {
            return (new Date(attendance.date).toLocaleDateString() ==
                new Date(new Date(date).setHours(0, 0, 0, 0)).toLocaleDateString());
        });
        const fixDate = new Date(new Date(date).setDate(new Date(date).getDate() + 1));
        if (attendanceExist) {
            yield Attendance_entity_1.Attendance.update(attendanceExist.id, Object.assign(Object.assign({}, req.body), { employee: user, date: fixDate }));
        }
        else {
            yield Attendance_entity_1.Attendance.insert(Object.assign(Object.assign({}, req.body), { employee: user, date: fixDate }));
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Checked attendance successfully',
        });
    })),
    // create: handleCatchError(async (req: Request, res: Response) => {
    // 	const dataNewAttendances: createOrUpdateAttendancePayload = req.body
    // 	const { mark_attendance_by, dates, employees, month, year, employee, date } =
    // 		dataNewAttendances
    // 	//Check valid
    // 	const messageValid = attendanceValid.createOrUpdate(dataNewAttendances)
    // 	if (messageValid)
    // 		return res.status(400).json({
    // 			code: 400,
    // 			success: false,
    // 			message: messageValid,
    // 		})
    // 	if (mark_attendance_by === 'Date' && dates.length > 0 && employees.length > 0) {
    // 		for (let index = 0; index < dates.length; index++) {
    // 			const date = dates[index]
    // 			for (let index = 0; index < employees.length; index++) {
    // 				const employeeId = employees[index]
    // 				//Get exist employee
    // 				const existingEmployee = await Employee.findOne({
    // 					where: {
    // 						id: Number(employeeId),
    // 					},
    // 				})
    // 				//Check exist attendance
    // 				const existingAttendance = await getManager()
    // 					.getRepository(Attendance)
    // 					.createQueryBuilder('attendance')
    // 					.where('attendance.employeeId = :id', { id: employeeId })
    // 					.andWhere('attendance.date = :date', { date })
    // 					.getOne()
    // 				//Create new attendance
    // 				existingEmployee &&
    // 					!existingAttendance &&
    // 					(await Attendance.create({
    // 						...dataNewAttendances,
    // 						date,
    // 						employee: existingEmployee,
    // 					}).save())
    // 			}
    // 		}
    // 	} else if (mark_attendance_by === 'Month' && employees.length > 0) {
    // 		//Set date start mark attendance is 1
    // 		const dateMark = new Date(`4-1-${year}`)
    // 		//Get date next month
    // 		const dateNextMonth = new Date(`${Number(month) + 1}-1-${year}`)
    // 		//Get date now -1
    // 		const dateNow = new Date()
    // 		dateNow.setDate(dateNow.getDate() - 1)
    // 		while (dateMark < dateNextMonth && dateMark < dateNow) {
    // 			for (let index = 0; index < employees.length; index++) {
    // 				const employeeId = employees[index]
    // 				//Get exist employee
    // 				const existingEmployee = await Employee.findOne({
    // 					where: {
    // 						id: Number(employeeId),
    // 					},
    // 				})
    // 				//Check exist attendance
    // 				const existingAttendance = await getManager()
    // 					.getRepository(Attendance)
    // 					.createQueryBuilder('attendance')
    // 					.where('attendance.employeeId = :id', { id: employeeId })
    // 					.andWhere('attendance.date = :date', { date: dateMark })
    // 					.getOne()
    // 				//Create new attendance
    // 				existingEmployee &&
    // 					!existingAttendance &&
    // 					(await Attendance.create({
    // 						...dataNewAttendances,
    // 						date: dateMark,
    // 						employee: existingEmployee,
    // 					}).save())
    // 				//increase date mark 1 day
    // 				dateMark.setDate(dateMark.getDate() + 1)
    // 			}
    // 		}
    // 	} else {
    // 		//Get exist employee
    // 		const existingEmployee = await Employee.findOne({
    // 			where: {
    // 				id: Number(employee),
    // 			},
    // 		})
    // 		//Check exist attendance
    // 		const existingAttendance = await getManager()
    // 			.getRepository(Attendance)
    // 			.createQueryBuilder('attendance')
    // 			.where('attendance.employeeId = :id', { id: employee })
    // 			.andWhere('attendance.date = :date', { date })
    // 			.getOne()
    // 		//Create new attendance
    // 		existingEmployee &&
    // 			!existingAttendance &&
    // 			(await Attendance.create({
    // 				...dataNewAttendances,
    // 				date,
    // 				employee: existingEmployee,
    // 			}).save())
    // 	}
    // 	return res.status(200).json({
    // 		code: 200,
    // 		success: true,
    // 		message: 'Checked attendance successfully',
    // 	})
    // }),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpAttendances = req.body;
        //Check exist attendance
        const existingAttendance = yield Attendance_entity_1.Attendance.findOne({
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
        yield Attendance_entity_1.Attendance.update(id, Object.assign({}, dataUpAttendances));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update attendance successfully',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        //Check existing attendance
        const existingAttendance = yield Attendance_entity_1.Attendance.findOne({
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
        const existingAttendance = yield Attendance_entity_1.Attendance.findOne({
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
