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
const Leave_Type_entity_1 = require("../entities/Leave_Type.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const leaveTypeController = {
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const leaveTypes = yield Leave_Type_entity_1.Leave_type.find();
        return res.status(200).json({
            code: 200,
            success: true,
            leaveTypes,
            message: 'Get all employees successfully',
        });
    })),
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewLeaveType = req.body;
        //Create new data new leave type
        const createLeaveType = Leave_Type_entity_1.Leave_type.create(dataNewLeaveType);
        const createdLeaveType = yield createLeaveType.save();
        return res.status(200).json({
            code: 200,
            success: true,
            leaveType: createdLeaveType,
            message: 'Created leave successfully',
        });
    })),
};
exports.default = leaveTypeController;
