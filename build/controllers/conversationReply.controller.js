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
const typeorm_1 = require("typeorm");
const Conversation_entity_1 = require("../entities/Conversation.entity");
const Conversation_Reply_entity_1 = require("../entities/Conversation_Reply.entity");
const Employee_entity_1 = require("../entities/Employee.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const conversationReplyController = {
    //Create new conversation reply
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewConversationReply = req.body;
        const { user, conversation } = dataNewConversationReply;
        //check user exists
        const existingUser = yield Employee_entity_1.Employee.findOne({
            where: {
                id: user,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        //Check conversation exist
        const existingConversation = yield Conversation_entity_1.Conversation.findOne({
            where: {
                id: conversation,
            },
        });
        if (!existingConversation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Conversation does not exist in the system',
            });
        //Check user exist in the conversation
        if (!existingConversation.employees.some((employee) => employee.id === existingUser.id))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the conversation',
            });
        const createdConversationReply = yield Conversation_Reply_entity_1.Conversation_reply.create(Object.assign({}, dataNewConversationReply)).save();
        const reply = yield Conversation_Reply_entity_1.Conversation_reply.findOne({
            where: {
                id: createdConversationReply.id
            },
            relations: {
                user: true
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            reply,
            message: 'Created new conversation reply successfully',
        });
    })),
    getByConversation: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { conversationId } = req.params;
        //check exist current user
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        const existingUser = yield Employee_entity_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        //Check exist conversation
        const existingConversation = yield Conversation_entity_1.Conversation.findOne({
            where: {
                id: Number(conversationId),
            },
        });
        if (!existingConversation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the conversation',
            });
        //Get replies by conversation
        const replies = yield Conversation_Reply_entity_1.Conversation_reply.find({
            where: {
                conversation: { id: existingConversation.id },
            },
            order: {
                createdAt: 'ASC',
            },
        });
        //get messages not read and update already read
        const manager = (0, typeorm_1.getManager)('huprom');
        const messagesNotRead = yield manager.query(`SELECT * FROM "conversation_reply" WHERE "conversation_reply"."conversationId" = ${existingConversation.id} AND "conversation_reply"."userId" != ${existingUser.id} AND "conversation_reply"."read" = FALSE`);
        //Update
        yield Promise.all(messagesNotRead.map(conversationReply => {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                yield Conversation_Reply_entity_1.Conversation_reply.update(conversationReply.id, {
                    read: true
                });
                resolve(true);
            }));
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            replies,
            message: 'Get replies by conversation successfully',
        });
    })),
};
exports.default = conversationReplyController;
