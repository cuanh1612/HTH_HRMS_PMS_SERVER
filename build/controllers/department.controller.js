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
const Department_entity_1 = require("../entities/Department.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const departmentController = {
    //Create new department
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewDepartment = req.body;
        const { name } = dataNewDepartment;
        //Check existing name
        const existingName = yield Department_entity_1.Department.findOne({
            where: {
                name: String(name),
            },
        });
        if (existingName)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department already exist in the system',
            });
        const createdDepartment = yield Department_entity_1.Department.create(dataNewDepartment).save();
        return res.status(200).json({
            code: 200,
            success: true,
            department: createdDepartment,
            message: 'Created new Department successfully',
        });
    })),
    //update department
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateDepartment = req.body;
        const { name } = dataUpdateDepartment;
        const existingDepartment = yield Department_entity_1.Department.findOne({
            where: {
                id: Number(id),
            },
        });
        //check existed Department
        if (!existingDepartment)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            });
        if (name !== existingDepartment.name) {
            const existingName = yield Department_entity_1.Department.findOne({
                where: {
                    name: String(name),
                },
            });
            if (existingName)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Department already exist in the system',
                });
        }
        yield Department_entity_1.Department.update(existingDepartment.id, Object.assign({}, dataUpdateDepartment));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update Department successfully',
        });
    })),
    //Get all department
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const departments = yield Department_entity_1.Department.find();
        return res.status(200).json({
            code: 200,
            success: true,
            departments: departments,
            message: 'Get all department successfully',
        });
    })),
    //Get detail department
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingDepartment = yield Department_entity_1.Department.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingDepartment)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            department: existingDepartment,
            message: 'Get detail of Department successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingDepartment = yield Department_entity_1.Department.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingDepartment)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            });
        //Delete Department
        yield existingDepartment.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete Department successfully',
        });
    })),
};
exports.default = departmentController;
