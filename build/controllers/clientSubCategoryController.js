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
const Client_Sub_Category_1 = require("../entities/Client_Sub_Category");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const clientSubCategoryValid_1 = require("../utils/valid/clientSubCategoryValid");
const clientSubCategoryController = {
    //Create new client sub category
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewSubCategory = req.body;
        //Check valid
        const messageValid = clientSubCategoryValid_1.clientSubCategoryValid.createOrUpdate(dataNewSubCategory);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check existing client category
        const existingClientCategory = yield Client_Category_1.Client_Category.findOne({
            where: {
                id: dataNewSubCategory.client_category,
            },
        });
        if (!existingClientCategory)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client category does not exist',
            });
        //Create new client sub category
        const createdSubCategory = yield Client_Sub_Category_1.Client_Sub_Category.create(Object.assign({}, dataNewSubCategory)).save();
        return res.status(200).json({
            code: 200,
            success: true,
            clientSubCategory: createdSubCategory,
            message: 'Created new client sub category successfully',
        });
    })),
    //update client sub category
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateSubCategory = req.body;
        console.log(dataUpdateSubCategory, id);
        //Check valid
        const messageValid = clientSubCategoryValid_1.clientSubCategoryValid.createOrUpdate(dataUpdateSubCategory);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check exist client sub category
        const existingSubCategory = yield Client_Sub_Category_1.Client_Sub_Category.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingSubCategory)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client sub category does not exist in the system',
            });
        //Check exist client
        if (dataUpdateSubCategory.client_category) {
            const existingClientCategory = yield Client_Category_1.Client_Category.findOne({
                where: {
                    id: dataUpdateSubCategory.client_category,
                },
            });
            if (!existingClientCategory)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client category does not exist in the system',
                });
        }
        //Update client sub category
        yield Client_Sub_Category_1.Client_Sub_Category.update(existingSubCategory.id, Object.assign({}, dataUpdateSubCategory));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update client sub category successfully',
        });
    })),
    //Get all client sub category
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const clientSubCategories = yield Client_Sub_Category_1.Client_Sub_Category.find();
        return res.status(200).json({
            code: 200,
            success: true,
            clientSubCategories,
            message: 'Get all client sub categories successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingSubCategory = yield Client_Sub_Category_1.Client_Sub_Category.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingSubCategory)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client sub category does not exist in the system',
            });
        //Delete client category
        yield existingSubCategory.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete client sub category successfully',
        });
    })),
};
exports.default = clientSubCategoryController;
