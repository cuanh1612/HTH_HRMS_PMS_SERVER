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
const salary_1 = require("../entities/salary");
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
        const createdSalary = yield salary_1.Salary.create(Object.assign({}, dataNewSalary)).save();
        return res.status(200).json({
            code: 200,
            success: true,
            salary: createdSalary,
            message: 'Create new Project files success successfully',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const salaries = yield Employee_1.Employee.createQueryBuilder('employee')
            .leftJoinAndSelect('employee.salaries', 'salary')
            .getMany();
        return res.status(200).json({
            code: 200,
            success: true,
            salaries,
            message: 'Create new Project files success successfully',
        });
    })),
};
exports.default = salaryController;
