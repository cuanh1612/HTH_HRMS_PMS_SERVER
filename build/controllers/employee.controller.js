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
const jsonwebtoken_1 = require("jsonwebtoken");
const typeorm_1 = require("typeorm");
const Attendance_entity_1 = require("../entities/Attendance.entity");
const Avatar_entity_1 = require("../entities/Avatar.entity");
const Client_entity_1 = require("../entities/Client.entity");
const Department_entity_1 = require("../entities/Department.entity");
const Designation_entity_1 = require("../entities/Designation.entity");
const Employee_entity_1 = require("../entities/Employee.entity");
const Leave_entity_1 = require("../entities/Leave.entity");
const Salary_entity_1 = require("../entities/Salary.entity");
const Task_entity_1 = require("../entities/Task.entity");
const Time_Log_entity_1 = require("../entities/Time_Log.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const employeeValid_1 = require("../utils/valid/employeeValid");
const employeeController = {
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const employees = yield Employee_entity_1.Employee.find();
        return res.status(200).json({
            code: 200,
            success: true,
            employees: employees,
            message: 'Get all employees successfully',
        });
    })),
    getNormal: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const employees = yield Employee_entity_1.Employee.find({
            select: {
                id: true,
                name: true,
                email: true,
                avatar: {
                    url: true,
                },
            },
        });
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
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
            relations: {
                avatar: true
            }
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
        //Check valid
        const messageValid = employeeValid_1.employeeValid.createOrUpdate(dataNewEmployee, 'create');
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check existing email
        const existingEmployee = (yield Employee_entity_1.Employee.findOne({
            where: {
                email: dataNewEmployee.email,
            },
        })) ||
            (yield Client_entity_1.Client.findOne({
                where: {
                    email: dataNewEmployee.email,
                },
            }));
        if (existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Email already exists in the system',
            });
        //Check existing department
        if (dataNewEmployee.department) {
            const existingDepartment = yield Department_entity_1.Department.findOne({
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
            const existingDesignation = yield Designation_entity_1.Designation.findOne({
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
        const newEmployee = Employee_entity_1.Employee.create(Object.assign(Object.assign({}, dataNewEmployee), { password: hashPassword }));
        const createdEmployee = yield newEmployee.save();
        //Create initial salary
        yield Salary_entity_1.Salary.create({
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
    importCSV: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employees } = req.body;
        let employeeNotValid = [];
        let employeeExistingEmailOrID = [];
        //employee not have department or designation
        let employeeNotExistDPDS = [];
        yield Promise.all(employees.map((employee) => {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                //Check valid
                const messageValid = employeeValid_1.employeeValid.createOrUpdate(employee, 'create');
                if (messageValid && employee.index) {
                    employeeNotValid.push(employee.index);
                }
                else {
                    //Check existing email
                    const existingEmployee = (yield Employee_entity_1.Employee.findOne({
                        where: {
                            email: employee.email,
                        },
                    })) ||
                        (yield Client_entity_1.Client.findOne({
                            where: {
                                email: employee.email,
                            },
                        }));
                    //Check existing employee-id
                    const existingEmployeeID = yield Employee_entity_1.Employee.findOne({
                        where: {
                            employeeId: employee.employeeId,
                        },
                    });
                    //Check existing department
                    const existingDepartment = yield Department_entity_1.Department.findOne({
                        where: {
                            id: employee.department,
                        },
                    });
                    //Check existing designation
                    const existingDesignation = yield Designation_entity_1.Designation.findOne({
                        where: {
                            id: employee.designation,
                        },
                    });
                    if ((existingEmployee || existingEmployeeID) && employee.index) {
                        employeeExistingEmailOrID.push(employee.index);
                    }
                    else if ((!existingDepartment || !existingDesignation) &&
                        employee.index) {
                        employeeNotExistDPDS.push(employee.index);
                    }
                    else {
                        const hashPassword = yield argon2_1.default.hash(employee.password);
                        //Create new employee
                        yield Employee_entity_1.Employee.create(Object.assign(Object.assign({}, employee), { can_receive_email: true, can_login: true, password: hashPassword })).save();
                    }
                }
                resolve(true);
            }));
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: `Create employees by import csv successfully${employeeNotValid.length > 0
                ? `. Incorrect lines of data that are not added to the server include index ${employeeNotValid.toString()}`
                : ''}${employeeExistingEmailOrID.length > 0
                ? `. Employee existing email or employeeID lines of data that are not added to the server include index ${employeeExistingEmailOrID.toString()}`
                : ''}${employeeNotExistDPDS.length > 0
                ? `. Employee not existing department or designation lines of data that are not added to the server include index ${employeeNotExistDPDS.toString()}`
                : ''}`,
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
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
        //check exist current user
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        const existingUser = yield Employee_entity_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        //Check if employee edit profile
        if (existingUser.role != "Admin" && !((existingUser.role == "Employee") && (existingUser.id == Number(employeeId)))) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'No permission to perform this function.',
            });
        }
        //Check existing employee
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
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
        //Check root
        if (existingEmployee.root === true)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Can not edit account root',
            });
        //Check duplicate email
        const existingEmployeeEmail = yield Employee_entity_1.Employee.findOne({
            where: {
                email: dataUpdateEmployee.email,
            },
        });
        const existingClientEmail = yield Client_entity_1.Client.findOne({
            where: {
                email: dataUpdateEmployee.email,
            },
        });
        if (existingClientEmail ||
            (existingEmployeeEmail && existingEmployeeEmail.email !== existingEmployee.email)) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Email already exist in the system 1',
            });
        }
        //Check existing department
        if (dataUpdateEmployee.department) {
            const existingDepartment = yield Department_entity_1.Department.findOne({
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
            const existingDesignation = yield Designation_entity_1.Designation.findOne({
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
                const existingAvatar = yield Avatar_entity_1.Avatar.findOne({
                    where: {
                        id: existingEmployee.avatar.id,
                    },
                });
                if (existingAvatar) {
                    yield Avatar_entity_1.Avatar.update(existingAvatar.id, Object.assign({}, avatar));
                }
            }
            else {
                newAvatar = yield Avatar_entity_1.Avatar.create(Object.assign({}, avatar)).save();
            }
        }
        const hashPassword = dataUpdateEmployee.password
            ? yield argon2_1.default.hash(dataUpdateEmployee.password)
            : null;
        //Update employee
        yield Employee_entity_1.Employee.update({
            id: existingEmployee.id,
        }, Object.assign(Object.assign(Object.assign({}, dataUpdateEmployeeBase), (hashPassword ? { password: hashPassword } : {})), (newAvatar
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
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
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
        //Check root
        if (existingEmployee.root === true)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Can not change role account root',
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
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
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
        //Check root
        if (existingEmployee.root === true)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Can not delete account root',
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
            const existingEmployee = yield Employee_entity_1.Employee.findOne({
                where: {
                    id: Number(employeeId),
                },
            });
            if (existingEmployee && existingEmployee.root === false) {
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
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Not found employee',
            });
        //Get count open task
        const countOpenTask = yield (0, typeorm_1.getManager)('huprom').query(`SELECT COUNT(task_employee."employeeId") from task_employee WHERE task_employee."employeeId" = ${employeeId}`);
        return res.status(200).json({
            code: 200,
            success: true,
            countOpentasks: Number(countOpenTask[0].count) || 0,
            message: 'Get count open tasks successfully',
        });
    })),
    getCountProjects: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Not found employee',
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
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Not found employee',
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
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Not found employee',
            });
        //Get late attendance
        const lateAttendance = yield Attendance_entity_1.Attendance.createQueryBuilder('attendance')
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
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Not found employee',
            });
        //Get countLeavesTaken
        const countLeavesTaken = yield Leave_entity_1.Leave.createQueryBuilder('leave')
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
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Not found employee',
            });
        //Get sum task by status task
        const countTasksStatus = yield (0, typeorm_1.getManager)('huprom').query(`SELECT status.title, COUNT(task.id), status.color FROM status LEFT JOIN task on status.id = task."statusId" LEFT JOIN task_employee on task.id = task_employee."taskId" WHERE task_employee."employeeId" = ${employeeId} GROUP BY (status.title, status.color)`);
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
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Not found employee',
            });
        //Get tasks
        const tasks = yield Task_entity_1.Task.find({
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
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Not found employee',
            });
        //Get Leaves
        const leaves = yield Leave_entity_1.Leave.find({
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
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Not found employee',
            });
        //Get Time Log
        const timeLogs = yield Time_Log_entity_1.Time_log.find({
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
    getCountPendingTasks: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Not found employee',
            });
        //Get count pending task
        const countPendingTasks = yield (0, typeorm_1.getManager)('huprom').query(`SELECT COUNT("public"."task"."id") FROM "public"."task_employee" LEFT JOIN "public"."task" on "public"."task_employee"."taskId" = "public"."task"."id" LEFT JOIN "public"."status" ON "public"."status"."id" = "public"."task"."statusId" WHERE "public"."task_employee"."employeeId" = ${employeeId} AND "public"."status"."title" = 'Incomplete' GROUP BY "public"."status"."title"`);
        return res.status(200).json({
            code: 200,
            success: true,
            countPendingTasks: countPendingTasks && countPendingTasks[0] ? Number(countPendingTasks[0].count) : 0,
            message: 'Get count pending task successfully',
        });
    })),
    getCountCompleteTasks: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
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
        //Get count complete task
        const countCompleteTasks = yield (0, typeorm_1.getManager)('huprom').query(`SELECT COUNT("public"."task"."id") FROM "public"."task_employee" LEFT JOIN "public"."task" on "public"."task_employee"."taskId" = "public"."task"."id" LEFT JOIN "public"."status" ON "public"."status"."id" = "public"."task"."statusId" WHERE "public"."task_employee"."employeeId" = ${employeeId} AND "public"."status"."title" = 'Complete' GROUP BY "public"."status"."title"`);
        return res.status(200).json({
            code: 200,
            success: true,
            countCompleteTasks: countCompleteTasks && countCompleteTasks[0]
                ? Number(countCompleteTasks[0].count)
                : 0,
            message: 'Get count complete task successfully',
        });
    })),
    getProject: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
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
        //Get count complete task
        const countCompleteTasks = yield (0, typeorm_1.getManager)('huprom').query(`SELECT COUNT("public"."task"."id") FROM "public"."task_employee" LEFT JOIN "public"."task" on "public"."task_employee"."taskId" = "public"."task"."id" LEFT JOIN "public"."status" ON "public"."status"."id" = "public"."task"."statusId" WHERE "public"."task_employee"."employeeId" = ${employeeId} AND "public"."status"."title" = 'Complete' GROUP BY "public"."status"."title"`);
        return res.status(200).json({
            code: 200,
            success: true,
            countCompleteTasks: Number(countCompleteTasks[0].count) || 0,
            message: 'Get count complete task successfully',
        });
    })),
    CountStatusProjects: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
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
        //Get count status Projects
        const countStatusProjects = yield (0, typeorm_1.getManager)('huprom').query(`SELECT "project"."project_status", COUNT("project"."id") FROM "project_employee" LEFT JOIN "project" ON "project"."id" = "project_employee"."projectId" WHERE "project_employee"."employeeId" = ${employeeId} GROUP BY "project"."project_status"`);
        return res.status(200).json({
            code: 200,
            success: true,
            countStatusProjects: countStatusProjects,
            message: 'Get count status projects successfully',
        });
    })),
};
exports.default = employeeController;
