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
const Client_1 = require("../entities/Client");
const Employee_1 = require("../entities/Employee");
const Room_1 = require("../entities/Room");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const salaryController = {
    getAll: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employee, client } = req.query;
        const existEmployee = yield Employee_1.Employee.findOne({
            where: {
                id: employee,
            },
        });
        const existClient = yield Client_1.Client.findOne({
            where: {
                id: client,
            },
        });
        if (!existEmployee && !existClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Person does not exist in system',
            });
        const yourRooms = yield Room_1.Room.find({
            where: {
                empl_create: {
                    id: (existEmployee === null || existEmployee === void 0 ? void 0 : existEmployee.id) || (existClient === null || existClient === void 0 ? void 0 : existClient.id),
                },
            },
            relations: {
                empl_create: true,
                employees: true,
                clients: true,
            },
        });
        const filter = existEmployee
            ? {
                employees: {
                    id: existEmployee.id,
                },
            }
            : existClient
                ? {
                    clients: {
                        id: existClient.id,
                    },
                }
                : undefined;
        const anotherRooms = yield Room_1.Room.find({
            where: filter,
            relations: {
                empl_create: true,
                employees: true,
                clients: true,
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            your_rooms: yourRooms,
            another_rooms: anotherRooms,
            message: 'Create new Project files successfully',
        });
    })),
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { empl_create, clients, employees, } = req.body;
        const existEmployee = yield Employee_1.Employee.findOne({
            where: {
                id: empl_create,
            },
        });
        if (!existEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create new Project files successfully',
        });
    })),
};
exports.default = salaryController;
