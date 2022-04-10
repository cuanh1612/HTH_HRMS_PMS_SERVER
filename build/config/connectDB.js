"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Avatar_1 = require("../entities/Avatar");
const Client_1 = require("../entities/Client");
const Client_Category_1 = require("../entities/Client_Category");
const Client_Sub_Category_1 = require("../entities/Client_Sub_Category");
const CompanyLogo_1 = require("../entities/CompanyLogo");
const Department_1 = require("../entities/Department");
const Designation_1 = require("../entities/Designation");
const Employee_1 = require("../entities/Employee");
const Holiday_1 = require("../entities/Holiday");
const Leave_1 = require("../entities/Leave");
const LeaveType_1 = require("../entities/LeaveType");
const Sign_1 = require("../entities/Sign");
const Contract_1 = require("../entities/Contract");
const ContractType_1 = require("../entities/ContractType");
const Attendance_1 = require("../entities/Attendance");
const connectDB = () => {
    (0, typeorm_1.createConnection)({
        type: 'postgres',
        database: 'HTH_HRMS_PMS',
        username: process.env.DB_USERNAME_DEV,
        password: process.env.DB_PASSWORD_DEV,
        logging: true,
        synchronize: true,
        entities: [
            Employee_1.Employee,
            Avatar_1.Avatar,
            Designation_1.Designation,
            Department_1.Department,
            Leave_1.Leave,
            LeaveType_1.LeaveType,
            Client_1.Client,
            Client_Category_1.Client_Category,
            Client_Sub_Category_1.Client_Sub_Category,
            Holiday_1.Holiday,
            Contract_1.Contract,
            CompanyLogo_1.Company_logo,
            Sign_1.Sign,
            ContractType_1.ContractType,
            Attendance_1.Attendance
        ],
    })
        .then(() => {
        console.log('Connected DB successfully.');
    })
        .catch((error) => {
        console.log('Connect DB false.', error);
    });
};
exports.default = connectDB;
