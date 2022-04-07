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
const clientRouter_1 = __importDefault(require("./clientRouter"));
const clientCategoryRouter_1 = __importDefault(require("./clientCategoryRouter"));
const clientSubCategoryRouter_1 = __importDefault(require("./clientSubCategoryRouter"));
<<<<<<< HEAD
const holidayRouter_1 = __importDefault(require("./holidayRouter"));
=======
const contractRouter_1 = __importDefault(require("./contractRouter"));
>>>>>>> a81939a2f718a8296a4e2fd3da573f1347b4c1d3
const mainRouter = (app) => {
    app.use('/api/auth', authRouter_1.default);
    app.use('/api/employees', employeeRouter_1.default);
    app.use('/api/departments', departmentRouter_1.default);
    app.use('/api/designations', designationRouter_1.default);
    app.use('/api/leave-types', leaveTypeRouter_1.default);
    app.use('/api/leaves', leaveRouter_1.default);
    app.use('/api/clients', clientRouter_1.default);
    app.use('/api/holidays', holidayRouter_1.default);
    app.use('/api/client-categories', clientCategoryRouter_1.default);
    app.use('/api/client-sub-categories', clientSubCategoryRouter_1.default);
    app.use('/api/contracts', contractRouter_1.default);
};
exports.default = mainRouter;
