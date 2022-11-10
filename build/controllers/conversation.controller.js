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
const Employee_entity_1 = require("../entities/Employee.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const conversationController = {
    //Create new conversation
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const dataNewConversation = req.body;
        const { user_one, user_two } = dataNewConversation;
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
        //Check same user
        if (user_one === user_two)
            return res.status(400).json({
                code: 400,
                success: false,
                message: "You can't create a conversation with yourself",
            });
        //check user exists
        const existingUserOne = yield Employee_entity_1.Employee.findOne({
            where: {
                id: user_one,
            },
        });
        const existingUserTwo = yield Employee_entity_1.Employee.findOne({
            where: {
                id: user_two,
            },
        });
        if (!existingUserOne || !existingUserTwo)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        //Check employee assign conversation
        const conversations = yield Conversation_entity_1.Conversation.find({
            relations: {
                employees: true,
            },
            where: {
                employees: [{ id: existingUserOne.id }],
            },
        });
        let isExistConversation = false;
        for (let index = 0; index < conversations.length; index++) {
            const conversation = conversations[index];
            if (conversation.employees.some((employee) => employee.id === existingUserTwo.id)) {
                isExistConversation = true;
                break;
            }
        }
        if (isExistConversation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Conversation already exist in the system',
            });
        //Create new conversation
        const createdConversation = yield Conversation_entity_1.Conversation.create({
            employees: [existingUserOne, existingUserTwo],
        }).save();
        return res.status(200).json({
            code: 200,
            success: true,
            conversation: createdConversation,
            message: 'Created new conversation successfully',
        });
    })),
    getByUser: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        //Check exist userId
        const existingUser = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(userId),
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        //Get all conversations of employee
        const conversations = yield Conversation_entity_1.Conversation.find({
            where: {
                employees: [{ id: existingUser.id }],
            },
            select: {
                employees: {
                    id: true,
                    name: true,
                    avatar: {
                        url: true
                    }
                }
            }
        });
        //Get latest message and count messages not read
        const manager = (0, typeorm_1.getManager)('huprom');
        let overrideConversations = [];
        for (let index = 0; index < conversations.length; index++) {
            const ConversationElement = conversations[index];
            //get latest message
            const lastestMessager = yield manager.query(`SELECT * FROM "conversation_reply" WHERE "conversation_reply"."conversationId" = ${ConversationElement.id} ORDER BY("conversation_reply"."created_at") DESC LIMIT 1`);
            //get count message not read
            const queryCountMessagesNotRead = yield manager.query(`SELECT COUNT("conversation_reply"."id") FROM "conversation_reply" WHERE "conversation_reply"."conversationId" = ${ConversationElement.id} AND "conversation_reply"."userId" != ${existingUser.id} AND "conversation_reply"."read" = FALSE`);
            const countMessagesNotRead = queryCountMessagesNotRead && queryCountMessagesNotRead[0]
                ? Number(queryCountMessagesNotRead[0].count)
                : 0;
            overrideConversations.push(Object.assign(Object.assign(Object.assign({}, ConversationElement), (lastestMessager ? { latest_messager: lastestMessager } : {})), { messages_not_read: countMessagesNotRead }));
        }
        return res.status(200).json({
            code: 200,
            success: true,
            conversations: overrideConversations,
            message: 'Get conversations successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { conversationId, userId } = req.params;
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
                message: 'Conversation does not exist in the system',
            });
        //Check exist user
        const existingUser = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(userId),
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        //Check user exist in the conversation
        if (!existingConversation.employees.some((employee) => employee.id === existingUser.id))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the conversation',
            });
        yield existingConversation.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete conversation successfully',
        });
    })),
};
exports.default = conversationController;
