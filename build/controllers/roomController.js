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
const node_fetch_1 = __importDefault(require("node-fetch"));
const jsonwebtoken_1 = require("jsonwebtoken");
const roomController = {
    getByTitle: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { title } = req.params;
        const room = yield Room_1.Room.findOne({
            where: {
                title,
            },
            relations: {
                empl_create: true,
                employees: true,
                clients: true,
            },
        });
        if (!room)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Room does not exist in system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            room,
            message: 'Get room by title successfully',
        });
    })),
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
            rooms: yourRooms,
            another_rooms: anotherRooms,
            message: 'get all rooms successfully',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existRoom = yield Room_1.Room.findOne({
            where: {
                id: Number(id),
            },
            relations: {
                clients: true,
                employees: true,
                empl_create: true,
            },
        });
        if (!existRoom) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Room does not exist in system',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            room: existRoom,
            message: 'Create new Project files successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existRoom = yield Room_1.Room.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existRoom) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Room does not exist in system',
            });
        }
        yield (0, node_fetch_1.default)(`${process.env.ZOOM_URL_API}/${existRoom.title}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.ZOOM_URL_KEY}`,
                Accept: 'application/json',
            },
        }).then((e) => e.json());
        yield Room_1.Room.delete({
            id: Number(id),
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete room successfully',
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { id } = req.params;
        const { clients, employees, title, date, description, start_time, } = req.body;
        //check exist current user
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        const existRoom = yield Room_1.Room.findOne({
            where: {
                id: Number(id),
            },
            relations: {
                empl_create: true,
            },
        });
        if (!existRoom) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Room does not exist in system',
            });
        }
        if (existRoom.empl_create.id != decode.userId) {
            return res.status(400).json({
                code: 403,
                success: false,
                message: 'You are not allow to edit',
            });
        }
        const clientsInfo = [];
        yield Promise.all(clients.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield Client_1.Client.findOne({
                    where: {
                        id,
                    },
                });
                if (data) {
                    clientsInfo.push(data);
                }
                resolve(true);
            }));
        })));
        const employeesInfo = [];
        yield Promise.all(employees.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield Employee_1.Employee.findOne({
                    where: {
                        id,
                    },
                });
                if (data) {
                    employeesInfo.push(data);
                }
                resolve(true);
            }));
        })));
        const oldTitle = existRoom.title;
        existRoom.title = title.replace(/ /g, '-');
        existRoom.date = new Date(new Date(date).toLocaleDateString());
        existRoom.description = description;
        existRoom.start_time = start_time;
        existRoom.clients = clientsInfo;
        existRoom.employees = employeesInfo;
        existRoom.link = `${process.env.URL_CLIENT}/meeting/${title.replace(/ /g, '-')}`;
        yield existRoom.save();
        if (oldTitle != title.replace(/ /g, '-')) {
            yield (0, node_fetch_1.default)(`${process.env.ZOOM_URL_API}/${oldTitle}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.ZOOM_URL_KEY}`,
                    Accept: 'application/json',
                },
            }).then((e) => e.json());
            yield (0, node_fetch_1.default)(`${process.env.ZOOM_URL_API}`, {
                method: 'POST',
                body: JSON.stringify({
                    name: title.replace(/ /g, '-'),
                    properties: {
                        lang: 'env',
                        enable_screenshare: true,
                        enable_chat: true,
                        start_video_off: true,
                        start_audio_off: false,
                    },
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.ZOOM_URL_KEY}`,
                    Accept: 'application/json',
                },
            }).then((e) => e.json());
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update room successfully',
        });
    })),
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { empl_create, clients, employees, title, date, description, start_time, } = req.body;
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
        const clientsInfo = [];
        yield Promise.all(clients.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield Client_1.Client.findOne({
                    where: {
                        id,
                    },
                });
                if (data) {
                    clientsInfo.push(data);
                }
                resolve(true);
            }));
        })));
        const employeesInfo = [];
        yield Promise.all(employees.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const data = yield Employee_1.Employee.findOne({
                    where: {
                        id,
                    },
                });
                if (data) {
                    employeesInfo.push(data);
                }
                resolve(true);
            }));
        })));
        yield Room_1.Room.create({
            title: title.replace(/ /g, '-'),
            date: new Date(new Date(date).toLocaleDateString()),
            description,
            start_time,
            clients: clientsInfo,
            employees: employeesInfo,
            empl_create: existEmployee,
            link: `${process.env.URL_CLIENT}/meeting/${title.replace(/ /g, '-')}`,
        }).save();
        yield (0, node_fetch_1.default)(`${process.env.ZOOM_URL_API}`, {
            method: 'POST',
            body: JSON.stringify({
                name: title.replace(/ /g, '-'),
                properties: {
                    lang: 'env',
                    enable_screenshare: true,
                    enable_chat: true,
                    start_video_off: true,
                    start_audio_off: false,
                },
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.ZOOM_URL_KEY}`,
                Accept: 'application/json',
            },
        }).then((e) => e.json());
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create new room successfully',
        });
    })),
};
exports.default = roomController;
