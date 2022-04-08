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
const Holiday_1 = require("../entities/Holiday");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const holidayController = {
    //Create new holiday
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { holidays } = req.body;
        for (let index = 0; index < holidays.length; index++) {
            const itemHoliday = holidays[index];
            const existingName = yield Holiday_1.Holiday.findOne({
                where: {
                    holiday_date: itemHoliday.holiday_date,
                    occasion: itemHoliday.occasion,
                },
            });
            if (!existingName) {
                yield Holiday_1.Holiday.create({
                    occasion: itemHoliday.occasion,
                    holiday_date: itemHoliday.holiday_date,
                }).save();
            }
            console.log('tjhvg hjkhkhbk');
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Created new holidays successfully',
        });
    })),
    //update holiday
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateholiday = req.body;
        const existingholiday = yield Holiday_1.Holiday.findOne({
            where: {
                id: Number(id),
            },
        });
        //check existed holiday
        if (!existingholiday)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'holiday does not exist in the system',
            });
        yield Holiday_1.Holiday.update(existingholiday.id, Object.assign({}, dataUpdateholiday));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update holiday successfully',
        });
    })),
    //Get all holiday
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const holidays = yield Holiday_1.Holiday.find();
        return res.status(200).json({
            code: 200,
            success: true,
            holidays: holidays,
            message: 'Get all holiday successfully',
        });
    })),
    //Get detail holiday
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingholiday = yield Holiday_1.Holiday.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingholiday)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'holiday does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            holiday: existingholiday,
            message: 'Get detail of holiday successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingholiday = yield Holiday_1.Holiday.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingholiday)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Holiday does not exist in the system',
            });
        //Delete holiday
        yield existingholiday.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete holiday successfully',
        });
    })),
    deletemany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { holidays } = req.body;
        //check array of holidays
        if (!Array.isArray(holidays) || !holidays)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Holiday does not exist in the system',
            });
        for (let index = 0; index < holidays.length; index++) {
            const itemHoliday = holidays[index];
            const existingholiday = yield Holiday_1.Holiday.findOne({
                where: {
                    id: itemHoliday.id,
                },
            });
            if (existingholiday) {
                yield existingholiday.remove();
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete holidays successfully',
        });
    })),
};
exports.default = holidayController;
