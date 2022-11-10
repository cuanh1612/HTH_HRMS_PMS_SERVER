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
const Contract_entity_1 = require("../entities/Contract.entity");
const Contract_File_entity_1 = require("../entities/Contract_File.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const contractFileController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { files, contract } = req.body;
        //Check exist contract
        const existingContract = yield Contract_entity_1.Contract.findOne({
            where: {
                id: contract,
            },
        });
        if (!existingContract)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract does not exist in the system',
            });
        //Create new contract file
        if (Array.isArray(files)) {
            files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                yield Contract_File_entity_1.Contract_file.create(Object.assign(Object.assign({}, file), { contract: existingContract })).save();
            }));
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create new contract files success successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { contractFileId, contractId } = req.params;
        //auth Header here is "Bearer accessToken"
        const authHeader = req.header('Authorization');
        const accessToken = authHeader && authHeader.split(' ')[1];
        if (!accessToken)
            return res.status(401).json({
                code: 401,
                success: false,
                message: 'Not authenticated to perform operations',
            });
        //Decode user
        const decodeUser = (0, jsonwebtoken_1.verify)(accessToken, process.env.ACCESS_TOKEN_SECRET);
        //Check exist contract
        const existingContract = yield Contract_entity_1.Contract.findOne({
            where: {
                id: Number(contractId),
            },
        });
        if (!existingContract)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract does not exist in the system',
            });
        //Check auth
        if ((decodeUser.role !== 'Admin' && decodeUser.role !== 'Client') ||
            (decodeUser.role === 'Client' && decodeUser.email !== existingContract.client.email))
            return res.status(400).json({
                code: 403,
                success: false,
                message: 'You are not authorized to take this action',
            });
        //Check exist contract file
        const existingContractFile = yield Contract_File_entity_1.Contract_file.findOne({
            where: {
                id: Number(contractFileId),
                contract: {
                    id: Number(contractId),
                },
            },
        });
        if (!existingContractFile)
            return res.status(400).json({
                code: 400,
                success: false,
                message: `Contract file does not exist in the system ${contractFileId} ${contractId}`,
            });
        //Delete contract file
        yield existingContractFile.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete contract file success successfully',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { contractId } = req.params;
        //Check exist contract
        const existingContract = yield Contract_entity_1.Contract.findOne({
            where: {
                id: Number(contractId),
            },
        });
        if (!existingContract)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract does not exist in the system',
            });
        //Get all contract file 
        const contractFiles = yield Contract_File_entity_1.Contract_file.find({
            where: {
                contract: {
                    id: Number(contractId)
                }
            },
            order: {
                createdAt: "DESC"
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            contractFiles,
            message: 'Get all contract files success successfully',
        });
    })),
};
exports.default = contractFileController;
