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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const typeorm_1 = require("typeorm");
const Attendance_1 = require("../entities/Attendance");
const Avatar_1 = require("../entities/Avatar");
const Department_1 = require("../entities/Department");
const Designation_1 = require("../entities/Designation");
const Employee_1 = require("../entities/Employee");
const Leave_1 = require("../entities/Leave");
const Salary_1 = require("../entities/Salary");
const Task_1 = require("../entities/Task");
const Time_Log_1 = require("../entities/Time_Log");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const employeeValid_1 = require("../utils/valid/employeeValid");
const employeeController = {
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const employees = yield Employee_1.Employee.find();
        return res.status(200).json({
            code: 200,
            success: true,
            employees: employees,
            message: 'Get all employees successfully',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            employee: existingEmployee,
            message: 'Get detail employee successfully',
        });
    })),
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewEmployee = req.body;
        console.log(dataNewEmployee);
        //Check valid
        const messageValid = employeeValid_1.employeeValid.createOrUpdate(dataNewEmployee, 'create');
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check existing email
        const existingEmployee = yield Employee_1.Employee.findOne({
            where: {
                email: dataNewEmployee.email,
            },
        });
        if (existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Email already exists in the system',
            });
        //Check existing department
        if (dataNewEmployee.department) {
            const existingDepartment = yield Department_1.Department.findOne({
                where: {
                    id: dataNewEmployee.department,
                },
            });
            if (!existingDepartment)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Department does not exist in the system',
                });
        }
        //Check existing designation
        if (dataNewEmployee.designation) {
            const existingDesignation = yield Designation_1.Designation.findOne({
                where: {
                    id: dataNewEmployee.designation,
                },
            });
            if (!existingDesignation)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Designation does not exist in the system',
                });
        }
        const hashPassword = yield argon2_1.default.hash(dataNewEmployee.password);
        //Create new employee
        const newEmployee = Employee_1.Employee.create(Object.assign(Object.assign({}, dataNewEmployee), { password: hashPassword }));
        const createdEmployee = yield newEmployee.save();
        //Create initial salary
        yield Salary_1.Salary.create({
            date: new Date(),
            amount: 0,
            employee: createdEmployee,
        }).save();
        return res.status(200).json({
            code: 200,
            success: true,
            employee: createdEmployee,
            message: 'Created new Employee successfully',
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataUpdateEmployee = req.body;
        const { employeeId } = req.params;
        //Check valid
        const messageValid = employeeValid_1.employeeValid.createOrUpdate(dataUpdateEmployee, 'update');
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check existing employee
        const existingEmployee = yield Employee_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the system',
            });
        //Check existing department
        if (dataUpdateEmployee.department) {
            const existingDepartment = yield Department_1.Department.findOne({
                where: {
                    id: dataUpdateEmployee.department,
                },
            });
            if (!existingDepartment)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Department does not exist in the system',
                });
        }
        //Check existing designation
        if (dataUpdateEmployee.designation) {
            const existingDesignation = yield Designation_1.Designation.findOne({
                where: {
                    id: dataUpdateEmployee.designation,
                },
            });
            if (!existingDesignation)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Designation does not exist in the system',
                });
        }
        //Check exist and update avatar
        const { avatar } = dataUpdateEmployee, dataUpdateEmployeeBase = __rest(dataUpdateEmployee, ["avatar"]);
        let newAvatar = null;
        if (avatar) {
            if (existingEmployee.avatar) {
                const existingAvatar = yield Avatar_1.Avatar.findOne({
                    where: {
                        id: existingEmployee.avatar.id,
                    },
                });
                if (existingAvatar) {
                    yield Avatar_1.Avatar.update(existingAvatar.id, Object.assign({}, avatar));
                }
            }
            else {
                newAvatar = yield Avatar_1.Avatar.create(Object.assign({}, avatar)).save();
            }
        }
        //Update employee
        yield Employee_1.Employee.update({
            id: existingEmployee.id,
        }, Object.assign(Object.assign(Object.assign({}, dataUpdateEmployeeBase), (dataUpdateEmployeeBase.password
            ? { password: yield argon2_1.default.hash(dataUpdateEmployee.password) }
            : {})), (newAvatar
            ? {
                avatar: newAvatar,
            }
            : {})));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Updated employee successfully',
        });
    })),
    changeRole: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId, role } = req.body;
        //Check valid
        const messageValid = employeeValid_1.employeeValid.changeRole(employeeId, role);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check existing employee
        const existingEmployee = yield Employee_1.Employee.findOne({
            where: {
                id: employeeId,
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the system',
            });
        //Update role employee
        existingEmployee.role = role;
        yield existingEmployee.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Updated role employee successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the system',
            });
        //Delete employee
        yield existingEmployee.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete employee successfully',
        });
    })),
    deleteMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employees } = req.body;
        if (!employees)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select many employees to delete',
            });
        for (let index = 0; index < employees.length; index++) {
            const employeeId = employees[index];
            //Check existing employee
            const existingEmployee = yield Employee_1.Employee.findOne({
                where: {
                    id: Number(employeeId),
                },
            });
            if (existingEmployee) {
                //Delete employee
                yield existingEmployee.remove();
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete employee successfully',
        });
    })),
    getOpenTasks: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select many employees to delete',
            });
        //Get count open task
        const countOpentask = yield (0, typeorm_1.getManager)('huprom').query(`SELECT COUNT(task_employee."employeeId") from task_employee WHERE task_employee."employeeId" = ${employeeId}`);
        return res.status(200).json({
            code: 200,
            success: true,
            countOpentasks: Number(countOpentask[0].count) || 0,
            message: 'Get count open tasks successfully',
        });
    })),
    getCountProjects: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select many employees to delete',
            });
        //Get count project assigned
        const countProjects = yield (0, typeorm_1.getManager)('huprom').query(`SELECT  COUNT(project_employee."projectId") FROM project_employee WHERE project_employee."employeeId" = ${employeeId}`);
        return res.status(200).json({
            code: 200,
            success: true,
            countProjects: Number(countProjects[0].count) || 0,
            message: 'Get count projects successfully',
        });
    })),
    getHoursLogged: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select many employees to delete',
            });
        //Get sum logged of employee
        const hoursLogged = yield (0, typeorm_1.getManager)('huprom').query(`SELECT  SUM(time_log.total_hours) FROM time_log WHERE time_log."employeeId" = ${employeeId}`);
        return res.status(200).json({
            code: 200,
            success: true,
            hoursLogged: Number(hoursLogged[0].sum) || 0,
            message: 'Get hours logged successfully',
        });
    })),
    getLateAttendance: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select many employees to delete',
            });
        //Get late attendance
        const lateAttendance = yield Attendance_1.Attendance.createQueryBuilder('attendance')
            .leftJoinAndSelect('attendance.employee', 'employee')
            .where('employee.id = :employeeId', { employeeId })
            .andWhere('attendance.late = :late', { late: true })
            .getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            lateAttendance,
            message: 'Get late attendance successfully',
        });
    })),
    countLeavesTaken: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select many employees to delete',
            });
        //Get countLeavesTaken
        const countLeavesTaken = yield Leave_1.Leave.createQueryBuilder('leave')
            .leftJoinAndSelect('leave.employee', 'employee')
            .where('employee.id = :employeeId', { employeeId })
            .getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            countLeavesTaken,
            message: 'Get count leaves taken successfully',
        });
    })),
    countTasksStatus: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select many employees to delete',
            });
        //Get sum task by status task
        const countTasksStatus = yield (0, typeorm_1.getManager)('huprom').query(`SELECT status.title, COUNT(task.id) FROM status LEFT JOIN task on status.id = task."statusId" LEFT JOIN task_employee on task.id = task_employee."taskId" WHERE task_employee."employeeId" = ${employeeId} GROUP BY status.title`);
        return res.status(200).json({
            code: 200,
            success: true,
            countTasksStatus,
            message: 'Get count tasks status successfully',
        });
    })),
    getTasks: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select many employees to delete',
            });
        //Get tasks
        const tasks = yield Task_1.Task.find({
            where: {
                employees: {
                    id: existingEmployee.id,
                },
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            tasks,
            message: 'Get tasks successfully',
        });
    })),
    getLeaves: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select many employees to delete',
            });
        //Get Leaves
        const leaves = yield Leave_1.Leave.find({
            where: {
                employee: {
                    id: existingEmployee.id,
                },
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            leaves,
            message: 'Get leaves successfully',
        });
    })),
    getTimeLogs: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select many employees to delete',
            });
        //Get Time Log
        const timeLogs = yield Time_Log_1.Time_log.find({
            where: {
                employee: {
                    id: existingEmployee.id,
                },
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            timeLogs,
            message: 'Get timeLogs successfully',
        });
    })),
    // getCountPendingTasks: handleCatchError(async (req: Request, res: Response) => {
    // 	const { employeeId } = req.params
    // 	//Check existing employee
    // 	const existingEmployee = await Employee.findOne({
    // 		where: {
    // 			id: Number(employeeId),
    // 		},
    // 	})
    // 	if (!existingEmployee)
    // 		return res.status(400).json({
    // 			code: 400,
    // 			success: false,
    // 			message: 'Please select many employees to delete',
    // 		})
    // 	//Get count pending task
    // 	const countPendingTasks = await getManager('huprom').query(
    // 		`SELECT COUNT(task.id) FROM task_employee LEFT JOIN task on task_employee."taskId" = task.id WHERE task_employee."employeeId" = ${employeeId} AND task.deadline >= CURRENT_DATE`
    // 	)
    // 	return res.status(200).json({
    // 		code: 200,
    // 		success: true,
    // 		countPendingTasks: Number(countPendingTasks[0].count) || 0,
    // 		message: 'Get count pending task successfully',
    // 	})
    // }),
    // getCountOverdueTasks: handleCatchError(async (req: Request, res: Response) => {
    // 	const { employeeId } = req.params
    // 	//Check existing employee
    // 	const existingEmployee = await Employee.findOne({
    // 		where: {
    // 			id: Number(employeeId),
    // 		},
    // 	})
    // 	if (!existingEmployee)
    // 		return res.status(400).json({
    // 			code: 400,
    // 			success: false,
    // 			message: 'Please select many employees to delete',
    // 		})
    // 	//Get count overdue task
    // 	const countOverdueTasks = await getManager('huprom').query(
    // 		`SELECT COUNT(task.id) FROM task_employee LEFT JOIN task on task_employee."taskId" = task.id WHERE task_employee."employeeId" = ${employeeId} AND task.deadline < CURRENT_DATE`
    // 	)
    // 	return res.status(200).json({
    // 		code: 200,
    // 		success: true,
    // 		countOverdueTasks: Number(countOverdueTasks[0].count) || 0,
    // 		message: 'Get count pending task successfully',
    // 	})
    // }),
};
exports.default = employeeController;
