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
const Employee_1 = require("../entities/Employee");
const StickyNote_1 = require("../entities/StickyNote");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const stickyNoteController = {
    //create note:
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const dataNote = req.body;
        const { note } = dataNote;
        if (!note)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please enter note',
            });
        //check exist current user
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system'
            });
        const createNote = yield StickyNote_1.StickyNote.create(Object.assign(Object.assign({}, dataNote), { employee: existingUser })).save();
        return res.status(200).json({
            code: 200,
            success: true,
            note: createNote,
            message: 'Create note success'
        });
    })),
    //update note
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const { id } = req.params;
        const dataUpdate = req.body;
        const { note } = dataUpdate;
        const existingNote = yield StickyNote_1.StickyNote.findOne({
            where: {
                id: Number(id)
            }
        });
        if (!existingNote)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'The sticky note does not exist in the system'
            });
        if (!note)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter full field'
            });
        //check exist current user
        const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser || existingUser.id != existingNote.employee.id)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system'
            });
        (existingNote.color = dataUpdate.color),
            (existingNote.note = dataUpdate.note);
        yield existingNote.save();
        return res.status(200).json({
            code: 400,
            success: true,
            message: 'Update note success',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const { id } = req.params;
        const existingNote = yield StickyNote_1.StickyNote.findOne({
            where: {
                id: Number(id)
            }
        });
        if (!existingNote)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'The sticky note does not exist in the system'
            });
        //check exist current user
        const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser || existingUser.id != existingNote.employee.id)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system'
            });
        yield existingNote.remove();
        return res.status(200).json({
            code: 400,
            success: true,
            message: 'Delete note success',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        const { id } = req.params;
        const existingNote = yield StickyNote_1.StickyNote.findOne({
            where: {
                id: Number(id)
            }
        });
        if (!existingNote)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'The sticky note does not exist in the system'
            });
        //check exist current user
        const token = (_d = req.headers.authorization) === null || _d === void 0 ? void 0 : _d.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser || existingUser.id != existingNote.employee.id)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system'
            });
        return res.status(200).json({
            code: 200,
            success: true,
            stickynote: existingNote,
            Message: 'Get detail sticky note success'
        });
    })),
    getByEmployee: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        //check exist current user
        const token = (_e = req.headers.authorization) === null || _e === void 0 ? void 0 : _e.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        const stickyNotes = yield StickyNote_1.StickyNote.find({
            where: {
                employee: {
                    id: existingUser === null || existingUser === void 0 ? void 0 : existingUser.id
                }
            },
            order: {
                createdAt: "DESC"
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            stickyNotes,
            Message: 'Get detail sticky note success'
        });
    }))
};
exports.default = stickyNoteController;
