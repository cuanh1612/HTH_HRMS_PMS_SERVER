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
const Employee_1 = require("../entities/Employee");
const Salary_1 = require("../entities/Salary");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const salaryValid_1 = require("../utils/valid/salaryValid");
const salaryController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewSalary = req.body;
        const { employee } = dataNewSalary;
        //Check valid input create new project
        //Check valid
        const messageValid = salaryValid_1.salaryValid.createOrUpdate(dataNewSalary);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check exist employee
        const existingEmployee = yield Employee_1.Employee.find({
            where: {
                id: employee,
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the system',
            });
        //Create new salary
        const createdSalary = yield Salary_1.Salary.create(Object.assign({}, dataNewSalary)).save();
        return res.status(200).json({
            code: 200,
            success: true,
            salary: createdSalary,
            message: 'Create new Project files successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { salaryId } = req.params;
        //Check exist salary
        const existingSalary = yield Salary_1.Salary.findOne({
            where: {
                id: Number(salaryId),
            },
        });
        if (!existingSalary)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Salary does not exist in the system',
            });
        //Delete salary
        yield existingSalary.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Deleted salary successfully',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const salaries = yield Employee_1.Employee.createQueryBuilder('employee')
            .leftJoinAndSelect('employee.salaries', 'salary')
            .orderBy('salary.date', 'DESC')
            .getMany();
        const listSalaries = salaries.map(salary => {
            if (salary.salaries && Array.isArray(salary.salaries)) {
                let sum = 0;
                salary.salaries.map(salaryItem => {
                    sum += salaryItem.amount;
                });
                return (Object.assign(Object.assign({}, salary), { sumSalaries: sum }));
            }
            else {
                return salary;
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            salaries: listSalaries,
            message: 'Create new Project files success successfully',
        });
    })),
    getHistoryByUser: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check exist employee
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
        //Get salary history of employee
        const historySalary = yield Employee_1.Employee.createQueryBuilder('employee')
            .where('employee.id = :id', {
            id: Number(employeeId),
        })
            .leftJoinAndSelect('employee.salaries', 'salary')
            .orderBy('salary.date', 'DESC')
            .getOne();
        return res.status(200).json({
            code: 200,
            success: true,
            historySalary,
            message: 'Create new Project files successfully',
        });
    })),
};
exports.default = salaryController;
