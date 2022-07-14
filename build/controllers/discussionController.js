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
const Client_1 = require("../entities/Client");
const Contract_1 = require("../entities/Contract");
const Discussion_1 = require("../entities/Discussion");
const Employee_1 = require("../entities/Employee");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const discussionValid_1 = require("../utils/valid/discussionValid");
const discussionController = {
    //Create new discussion
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewDiscussion = req.body;
        const { client, employee, contract } = dataNewDiscussion;
        //Check valid input
        const messageValid = discussionValid_1.discussionValid.createOrUpdate(dataNewDiscussion);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check exist client
        const existingAuthor = client
            ? yield Client_1.Client.findOne({
                where: {
                    id: client,
                },
            })
            : yield Employee_1.Employee.findOne({
                where: {
                    id: employee,
                },
            });
        if (!existingAuthor)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        //Check exist contract
        const existingContract = yield Contract_1.Contract.findOne({
            where: {
                id: contract,
            },
        });
        if (!existingContract)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract doest not exist in the system',
            });
        //Create new discussion
        const createdDiscussion = yield Discussion_1.Discussion.create(Object.assign(Object.assign({}, (client
            ? {
                client: existingAuthor,
            }
            : { employee: existingAuthor })), { contract: existingContract, content: dataNewDiscussion.content })).save();
        return res.status(200).json({
            code: 200,
            success: true,
            discussion: createdDiscussion,
            message: 'Created new discussion successfully',
        });
    })),
    getByContract: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { contractId } = req.params;
        //Check exist contract
        const existingContract = yield Contract_1.Contract.findOne({
            where: {
                id: Number(contractId),
            },
        });
        if (!existingContract)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract doest not exist in the system',
            });
        //Get all discussion
        const discussions = yield Discussion_1.Discussion.find({
            where: {
                contract: { id: Number(contractId) },
            },
            order: {
                createdAt: 'DESC',
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            discussions,
            message: 'Get discussions by contract successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { discussionId } = req.params;
        //Check exist discussion
        const existingDiscussion = yield Discussion_1.Discussion.findOne({
            where: {
                id: Number(discussionId),
            },
        });
        if (!existingDiscussion)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Discussion doest not exist in the system',
            });
        //Delete discussion
        yield existingDiscussion.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Deleted discussion successfully',
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { discussionId } = req.params;
        const { email_author, content } = req.body;
        if (!content || !email_author)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter full field',
            });
        //Check exist discussion
        const existingDiscussion = yield Discussion_1.Discussion.findOne({
            where: {
                id: Number(discussionId),
            },
        });
        if (!existingDiscussion)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Discussion doest not exist in the system',
            });
        //Check author
        const getMailAuthor = ((_a = existingDiscussion.client) === null || _a === void 0 ? void 0 : _a.email)
            ? existingDiscussion.client.email
            : ((_b = existingDiscussion.employee) === null || _b === void 0 ? void 0 : _b.email)
                ? existingDiscussion.employee.email
                : '';
        if (getMailAuthor === email_author) {
            //update discussion
            yield Discussion_1.Discussion.update(Number(discussionId), {
                content,
            });
        }
        else {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You are not authorized to perform this action',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Updated discussion successfully',
        });
    })),
};
exports.default = discussionController;
