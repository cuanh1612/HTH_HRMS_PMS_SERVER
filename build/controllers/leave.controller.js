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
const Employee_entity_1 = require("../entities/Employee.entity");
const Leave_entity_1 = require("../entities/Leave.entity");
const Leave_Type_entity_1 = require("../entities/Leave_Type.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const leaveValid_1 = require("../utils/valid/leaveValid");
const leaveController = {
    getAll: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { date, employee, status, leaveType } = req.query;
        var filter = {};
        if (status)
            filter.status = String(status);
        if (employee)
            filter.employee = {
                id: Number(employee),
            };
        if (leaveType)
            filter.leave_type = {
                id: Number(leaveType),
            };
        let leaves = yield Leave_entity_1.Leave.find({
            where: filter,
            relations: {
                employee: true
            },
            select: {
                employee: {
                    id: true
                }
            }
        });
        if (date) {
            leaves = leaves.filter((leave) => {
                const leaveDate = new Date(leave.date);
                const dateFilter = new Date(date);
                return (leaveDate.getMonth() <= dateFilter.getMonth() &&
                    leaveDate.getFullYear() <= dateFilter.getFullYear());
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            leaves: leaves || [],
            message: 'Get all leaves successfully',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { leaveId } = req.params;
        //Check existing leave
        const existingLeave = yield Leave_entity_1.Leave.findOne({
            where: {
                id: Number(leaveId),
            },
        });
        if (!existingLeave)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Leave does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            leave: existingLeave,
            message: 'Get all leaves successfully',
        });
    })),
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewLeave = req.body;
        //Check valid
        const messageValid = leaveValid_1.leaveValid.createOrUpdate(dataNewLeave);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check exist employee
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: dataNewLeave.employee,
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the system',
            });
        //Check exist leave type
        const existingLeaveType = yield Leave_Type_entity_1.Leave_type.findOne({
            where: {
                id: dataNewLeave.leave_type,
            },
        });
        if (!existingLeaveType)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Leave type does not exist in the system',
            });
        //Check duration date leave
        if (dataNewLeave.dates && Array.isArray(dataNewLeave.dates)) {
            for (let index = 0; index < dataNewLeave.dates.length; index++) {
                const date = new Date(dataNewLeave.dates[index]);
                //Check existing leave date and remove
                const existingLeaveDate = yield Leave_entity_1.Leave.createQueryBuilder('leave')
                    .where('leave.employeeId = :id', {
                    id: dataNewLeave.employee,
                })
                    .andWhere('leave.date = :date', {
                    date,
                })
                    .getOne();
                // Leave already applied for the selected date will update
                if (existingLeaveDate) {
                    yield Leave_entity_1.Leave.update(existingLeaveDate.id, {
                        employee: existingEmployee,
                        leave_type: existingLeaveType,
                        status: dataNewLeave.status,
                        reason: dataNewLeave.reason,
                        duration: dataNewLeave.duration,
                        date,
                    });
                }
                else {
                    //Create new leave
                    yield Leave_entity_1.Leave.create({
                        employee: existingEmployee,
                        leave_type: existingLeaveType,
                        status: dataNewLeave.status,
                        reason: dataNewLeave.reason,
                        duration: dataNewLeave.duration,
                        date,
                    }).save();
                }
            }
        }
        else {
            const date = new Date(dataNewLeave.date);
            //Check existing leave date and remove
            const existingLeaveDate = yield Leave_entity_1.Leave.createQueryBuilder('leave')
                .where('leave.employeeId = :id', {
                id: dataNewLeave.employee,
            })
                .andWhere('leave.date = :date', {
                date,
            })
                .getOne();
            // Leave already applied for the selected date will update
            if (existingLeaveDate) {
                yield Leave_entity_1.Leave.update(existingLeaveDate.id, {
                    employee: existingEmployee,
                    leave_type: existingLeaveType,
                    status: dataNewLeave.status,
                    reason: dataNewLeave.reason,
                    duration: dataNewLeave.duration,
                    date,
                });
            }
            else {
                //Create new leave
                yield Leave_entity_1.Leave.create({
                    employee: existingEmployee,
                    leave_type: existingLeaveType,
                    status: dataNewLeave.status,
                    reason: dataNewLeave.reason,
                    duration: dataNewLeave.duration,
                    date,
                }).save();
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Created leave successfully',
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataUpdateLeave = req.body;
        const { leaveId } = req.params;
        //Check valid
        const messageValid = leaveValid_1.leaveValid.createOrUpdate(dataUpdateLeave);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check existing leave
        const leaveUpdate = yield Leave_entity_1.Leave.findOne({
            where: {
                id: Number(leaveId),
            },
        });
        if (!leaveUpdate)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Leave does not exist in the system',
            });
        //Check leave accepted or rejected`
        if (leaveUpdate.status !== 'Pending')
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This leave has been processed and cannot be updated',
            });
        //Check exist employee
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: leaveUpdate.employee.id,
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the system',
            });
        //Check exist leave type
        const existingLeaveType = yield Leave_Type_entity_1.Leave_type.findOne({
            where: {
                id: dataUpdateLeave.leave_type,
            },
        });
        if (!existingLeaveType)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Leave type does not exist in the system',
            });
        //Check existing leave date and remove
        const existingLeaveDate = yield Leave_entity_1.Leave.createQueryBuilder('leave')
            .where('leave.employeeId = :id', {
            id: leaveUpdate.employee.id,
        })
            .andWhere('leave.date = :date', {
            date: dataUpdateLeave.date,
        })
            .getOne();
        // Leave already applied for the selected date will delete
        if (existingLeaveDate && existingLeaveDate.date !== leaveUpdate.date) {
            yield existingLeaveDate.remove();
        }
        //Update leave
        yield Leave_entity_1.Leave.update(Number(leaveId), {
            date: new Date(dataUpdateLeave.date),
            reason: dataUpdateLeave.reason,
            duration: dataUpdateLeave.duration,
            leave_type: dataUpdateLeave.leave_type,
            status: dataUpdateLeave.status,
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Updated leave successfully',
        });
    })),
    updateStatus: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { leaveId } = req.params;
        const { status } = req.body;
        //Check valid
        const messageValid = leaveValid_1.leaveValid.updateStatus(status);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check existing leave
        const existingLeave = yield Leave_entity_1.Leave.findOne({
            where: {
                id: Number(leaveId),
            },
        });
        if (!existingLeave)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Leave does not exist in the system',
            });
        //Update status leave
        yield Leave_entity_1.Leave.update(leaveId, {
            status,
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Updated leave successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { leaveId } = req.params;
        //Check existing leave
        const existingLeave = yield Leave_entity_1.Leave.findOne({
            where: {
                id: Number(leaveId),
            },
        });
        if (!existingLeave)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Leave does not exist in the system',
            });
        //Delete employee
        yield existingLeave.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete leave successfully',
        });
    })),
    deleteMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { leaves } = req.body;
        if (!leaves)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select many leaves to delete',
            });
        for (let index = 0; index < leaves.length; index++) {
            const leaveId = leaves[index];
            //Check existing leave
            const existingLeave = yield Leave_entity_1.Leave.findOne({
                where: {
                    id: Number(leaveId),
                },
            });
            if (existingLeave) {
                //Delete employee
                yield existingLeave.remove();
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete leaves successfully',
        });
    })),
};
exports.default = leaveController;
