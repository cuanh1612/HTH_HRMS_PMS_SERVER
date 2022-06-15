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
const Client_Category_1 = require("../entities/Client_Category");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const clientCategoryController = {
    //Create new client category
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewClientCategory = req.body;
        const createdClientCategory = yield Client_Category_1.Client_Category.create(dataNewClientCategory).save();
        return res.status(200).json({
            code: 200,
            success: true,
            clientCategory: createdClientCategory,
            message: 'Created new client category successfully',
        });
    })),
    //update client category
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateCategory = req.body;
        const existingClientCategory = yield Client_Category_1.Client_Category.findOne({
            where: {
                id: Number(id),
            },
        });
        //check existed client category
        if (!existingClientCategory)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client category does not exist in the system',
            });
        yield Client_Category_1.Client_Category.update(existingClientCategory.id, Object.assign({}, dataUpdateCategory));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update client category successfully',
        });
    })),
    //Get all client category
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const clientCategories = yield Client_Category_1.Client_Category.find();
        return res.status(200).json({
            code: 200,
            success: true,
            clientCategories,
            message: 'Get all client categories successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingClientCategory = yield Client_Category_1.Client_Category.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingClientCategory)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client category does not exist in the system',
            });
        //Delete client category
        yield existingClientCategory.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete client category successfully',
        });
    })),
};
exports.default = clientCategoryController;
