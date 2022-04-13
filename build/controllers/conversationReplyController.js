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
const Conversation_1 = require("../entities/Conversation");
const ConversationReply_1 = require("../entities/ConversationReply");
const Employee_1 = require("../entities/Employee");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const conversationReplyController = {
    //Create new conversation reply
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewConversationReply = req.body;
        const { user, conversation } = dataNewConversationReply;
        //check user exists
        const existingUser = yield Employee_1.Employee.findOne({
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
        const existingConversation = yield Conversation_1.Conversation.findOne({
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
        if (!existingConversation.employees.includes(existingUser))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the conversation',
            });
        const createdConversationReply = yield ConversationReply_1.Conversation_reply.create(Object.assign({}, dataNewConversationReply)).save();
        return res.status(200).json({
            code: 200,
            success: true,
            conversationReply: createdConversationReply,
            message: 'Created new conversation reply successfully',
        });
    })),
    getByConversation: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { conversationId } = req.params;
        //Check exist conversation
        const existingConversation = yield Conversation_1.Conversation.findOne({
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
        const replies = yield ConversationReply_1.Conversation_reply.createQueryBuilder('conversation_reply')
            .where('conversation_reply.conversationId = :conversationId', { conversationId })
            .orderBy('created_at', 'ASC')
            .getMany();
        return res.status(200).json({
            code: 200,
            success: true,
            replies,
            message: 'Get replies by conversation successfully',
        });
    })),
};
exports.default = conversationReplyController;
