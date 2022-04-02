"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRouter_1 = __importDefault(require("./authRouter"));
const employeeRouter_1 = __importDefault(require("./employeeRouter"));
const departmentRouter_1 = __importDefault(require("./departmentRouter"));
const designationRouter_1 = __importDefault(require("./designationRouter"));
const leaveTypeRouter_1 = __importDefault(require("./leaveTypeRouter"));
const leaveRouter_1 = __importDefault(require("./leaveRouter"));
const mainRouter = (app) => {
    app.use('/api/auth', authRouter_1.default);
    app.use('/api/employees', employeeRouter_1.default);
    app.use('/api/departments', departmentRouter_1.default);
    app.use('/api/designations', designationRouter_1.default);
    app.use('/api/leave-types', leaveTypeRouter_1.default);
    app.use('/api/leaves', leaveRouter_1.default);
};
exports.default = mainRouter;
