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
const Designation_1 = require("../entities/Designation");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const designationController = {
    //Create new designation
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewdesignation = req.body;
        const { name } = req.body;
        const createddesignation = yield Designation_1.Designation.create(dataNewdesignation).save();
        //check if the name of the designation already exists
        const existingName = yield Designation_1.Designation.findOne({
            where: {
                name: String(name)
            }
        });
        if (existingName)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            designation: createddesignation,
            message: 'Created new designation successfully'
        });
    })),
    //update designation
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { name } = req.body;
        const dataUpdatedesignation = req.body;
        //check if the name of the designation already exists
        const existingName = yield Designation_1.Designation.findOne({
            where: {
                name: String(name)
            }
        });
        if (existingName)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            });
        const existingdesignation = yield Designation_1.Designation.findOne({
            where: {
                id: Number(id),
            },
        });
        //check existed designation
        if (!existingdesignation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'designation does not exist in the system',
            });
        yield Designation_1.Designation.update(existingdesignation.id, Object.assign({}, dataUpdatedesignation));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update designation successfully'
        });
    })),
    //Get all designation
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const designations = yield Designation_1.Designation.find();
        return res.status(200).json({
            code: 200,
            success: true,
            designations: designations,
            message: 'Get all designation successfully',
        });
    })),
    //Get detail designation
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingdesignation = yield Designation_1.Designation.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingdesignation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'designation does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            designations: existingdesignation,
            message: 'Get detail of designation successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingdesignation = yield Designation_1.Designation.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingdesignation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'designation does not exist in the system',
            });
        //Delete designation
        yield existingdesignation.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete designation successfully',
        });
    })),
};
exports.default = designationController;
