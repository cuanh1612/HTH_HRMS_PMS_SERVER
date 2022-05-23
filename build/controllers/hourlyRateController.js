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
const Hourly_rate_project_1 = require("../entities/Hourly_rate_project");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const hourlyRateController = {
    //update holiday
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { idProject, idEmployee, hourly_rate } = req.body;
        if (!idProject || !idEmployee || !hourly_rate) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter full fieererlds',
            });
        }
        const existHourlyRate = yield Hourly_rate_project_1.Hourly_rate_project.findOne({
            where: {
                project: {
                    id: Number(idProject)
                },
                employee: {
                    id: Number(idEmployee)
                }
            }
        });
        if (!existHourlyRate) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This employee is not involved in this project',
            });
        }
        existHourlyRate.hourly_rate = Number(hourly_rate);
        yield existHourlyRate.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update hourly rate successfully',
        });
    })),
};
exports.default = hourlyRateController;
