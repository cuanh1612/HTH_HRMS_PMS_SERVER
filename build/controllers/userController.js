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
const User_1 = require("../entities/User");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const userValid_1 = require("../utils/valid/userValid");
const argon2_1 = __importDefault(require("argon2"));
const employeeController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewEmployee = req.body;
        console.log(dataNewEmployee);
        //Check valid
        const messageValid = userValid_1.userValid.create(dataNewEmployee);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check existing email
        const existingEmployee = yield User_1.User.findOne({
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
        const hashPassword = yield argon2_1.default.hash(dataNewEmployee.password);
        //Create new employee
        const newEmployee = User_1.User.create(Object.assign(Object.assign({}, dataNewEmployee), { password: hashPassword }));
        const createdEmployee = yield newEmployee.save();
        return res.status(200).json({
            code: 200,
            success: true,
            employee: createdEmployee,
            message: 'Created new employee successfully',
        });
    })),
};
exports.default = employeeController;
