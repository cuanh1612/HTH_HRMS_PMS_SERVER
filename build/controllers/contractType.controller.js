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
const Contract_entity_1 = require("../entities/Contract.entity");
const Contract_Type_entity_1 = require("../entities/Contract_Type.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const contractTypeController = {
    //Create new contract type
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewContractType = req.body;
        const { name } = dataNewContractType;
        //check if the name of the contract type already exists
        const existingContractType = yield Contract_Type_entity_1.Contract_type.findOne({
            where: {
                name: String(name),
            },
        });
        if (existingContractType)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract type already exist in the system',
            });
        const createdContractType = yield Contract_Type_entity_1.Contract_type.create(dataNewContractType).save();
        return res.status(200).json({
            code: 200,
            success: true,
            contractType: createdContractType,
            message: 'Created new contract type successfully',
        });
    })),
    //update contract type
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpContractType = req.body;
        const { name } = dataUpContractType;
        const existingContractType = yield Contract_Type_entity_1.Contract_type.findOne({
            where: {
                id: Number(id),
            },
        });
        //check existed contract type
        if (!existingContractType)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract type does not exist in the system',
            });
        //Check exist name
        if (name !== existingContractType.name) {
            const existingName = yield Contract_Type_entity_1.Contract_type.findOne({
                where: {
                    name
                }
            });
            if (existingName)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Contract type already exist in the system',
                });
        }
        yield Contract_Type_entity_1.Contract_type.update(existingContractType.id, Object.assign({}, dataUpContractType));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update contract type successfully',
        });
    })),
    //Get all contract types
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const contractTypes = yield Contract_Type_entity_1.Contract_type.find();
        return res.status(200).json({
            code: 200,
            success: true,
            contractTypes,
            message: 'Get all designation successfully',
        });
    })),
    //Get detail contract type
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingContractType = yield Contract_Type_entity_1.Contract_type.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingContractType)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract type does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            contractType: existingContractType,
            message: 'Get detail of contract type successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingContractType = yield Contract_entity_1.Contract.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingContractType)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract type does not exist in the system',
            });
        //Delete contract type
        yield existingContractType.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete contract type successfully',
        });
    })),
};
exports.default = contractTypeController;
