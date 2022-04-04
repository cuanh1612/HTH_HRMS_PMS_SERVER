"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Avatar_1 = require("../entities/Avatar");
const Client_1 = require("../entities/Client");
const Client_Category_1 = require("../entities/Client_Category");
const Client_Sub_Category_1 = require("../entities/Client_Sub_Category");
const Department_1 = require("../entities/Department");
const Designation_1 = require("../entities/Designation");
const Employee_1 = require("../entities/Employee");
const Leave_1 = require("../entities/Leave");
const LeaveType_1 = require("../entities/LeaveType");
const connectDB = () => {
    (0, typeorm_1.createConnection)({
        type: 'postgres',
        database: 'hth_hrms_pms',
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
