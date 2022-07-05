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
const jsonwebtoken_1 = require("jsonwebtoken");
const Client_1 = require("../entities/Client");
const Employee_1 = require("../entities/Employee");
const Notification_1 = require("../entities/Notification");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const notificationValid_1 = require("../utils/valid/notificationValid");
const notificationController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const dataNewNotification = req.body;
        const { content, url } = dataNewNotification;
        //check exist current user
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        const existingUser = decode.role === 'Client'
            ? yield Client_1.Client.findOne({
                where: {
                    id: decode.userId,
                },
            })
            : yield Employee_1.Employee.findOne({
                where: {
                    id: decode.userId,
                },
            });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        //Check valid
        const messageValid = notificationValid_1.notificationValid.createOrUpdate(dataNewNotification);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Create new notification
        const createNotification = yield Notification_1.Notification.create(Object.assign({ url,
            content }, (existingUser.role === 'Client'
            ? { client: existingUser }
            : { employee: existingUser }))).save();
        return res.status(200).json({
            code: 200,
            success: true,
            notification: createNotification,
            message: 'Created notification successfully',
        });
    })),
    getAllByCurrentUser: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        //check exist current user
        const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        const existingUser = decode.role === 'Client'
            ? yield Client_1.Client.findOne({
                where: {
                    id: decode.userId,
                },
            })
            : yield Employee_1.Employee.findOne({
                where: {
                    id: decode.userId,
                },
            });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        //Get all notifications
        const allNotifications = yield Notification_1.Notification.find({
            where: Object.assign({}, (existingUser.role === 'Client'
                ? { client: { id: existingUser.id } }
                : { employee: { id: existingUser.id } })),
            order: {
                createdAt: "DESC"
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            notifications: allNotifications,
            message: 'Get all notifications by current user successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const { notificationId } = req.params;
        //check exist current user
        const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        const existingUser = decode.role === 'Client'
            ? yield Client_1.Client.findOne({
                where: {
                    id: decode.userId,
                },
            })
            : yield Employee_1.Employee.findOne({
                where: {
                    id: decode.userId,
                },
            });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        //Check existing notification
        const exisingNotification = yield Notification_1.Notification.findOne({
            where: {
                id: Number(notificationId),
            },
            relations: {
                employee: true,
                client: true
            }
        });
        if (!exisingNotification)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Notification does not exist in the system',
            });
        //Check author
        if (!(existingUser.role === 'Client' && existingUser.id === exisingNotification.client.id) &&
            !(existingUser.id === exisingNotification.employee.id))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You are not authorized to perform this action',
            });
        //Remove notification
        yield exisingNotification.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Remove notification successfully',
        });
    })),
};
exports.default = notificationController;
