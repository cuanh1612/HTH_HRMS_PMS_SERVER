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
const Notice_Board_1 = require("../entities/Notice_Board");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const noticeBoardValid_1 = require("../utils/valid/noticeBoardValid");
const noticeBoardController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewNoticeBoard = req.body;
        const { notice_to, heading, details } = dataNewNoticeBoard;
        //Check valid
        const messageValid = noticeBoardValid_1.noticeBoardValid.createOrUpdate(dataNewNoticeBoard);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Create new notice board
        const createNoticeBoard = yield Notice_Board_1.Notice_board.create({
            notice_to,
            heading,
            details,
        }).save();
        return res.status(200).json({
            code: 200,
            success: true,
            noticeBoard: createNoticeBoard,
            message: 'Created leave successfully',
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { noticeBoardId } = req.params;
        const dataUpdateNoticeBoard = req.body;
        //Check valid
        const messageValid = noticeBoardValid_1.noticeBoardValid.createOrUpdate(dataUpdateNoticeBoard);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check existing notice board
        const existingNotice = yield Notice_Board_1.Notice_board.findOne({
            where: {
                id: Number(noticeBoardId),
            },
        });
        if (!existingNotice)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Notice board not already exist in the system',
            });
        //Update notice board
        existingNotice.details = dataUpdateNoticeBoard.details;
        existingNotice.heading = dataUpdateNoticeBoard.heading;
        existingNotice.notice_to = dataUpdateNoticeBoard.notice_to;
        yield existingNotice.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Updated notice board successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { noticeBoardId } = req.params;
        //Check existing notice board
        const existingNotice = yield Notice_Board_1.Notice_board.findOne({
            where: {
                id: Number(noticeBoardId),
            },
        });
        if (!existingNotice)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Notice board not already exist in the system',
            });
        //Delete notice
        yield existingNotice.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Deleted notice board successfully',
        });
    })),
    deleteMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { noticeBoards } = req.body;
        if (!noticeBoards || !Array.isArray(noticeBoards))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please send valid input delete many',
            });
        for (let index = 0; index < noticeBoards.length; index++) {
            const noticeBoardId = noticeBoards[index];
            //Check existing notice board
            const existingNotice = yield Notice_Board_1.Notice_board.findOne({
                where: {
                    id: Number(noticeBoardId),
                },
            });
            if (!existingNotice)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Notice board not already exist in the system',
                });
            //Delete notice
            yield existingNotice.remove();
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Deleted many notice boards successfully',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { noticeBoardId } = req.params;
        //Check existing notice board
        const existingNotice = yield Notice_Board_1.Notice_board.findOne({
            where: {
                id: Number(noticeBoardId),
            },
        });
        if (!existingNotice)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Notice board not already exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            noticeBoard: existingNotice,
            message: 'Get detail notice board successfully',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { select } = req.query;
        let noticeBoards = [];
        switch (select) {
            case 'employees':
                noticeBoards = yield Notice_Board_1.Notice_board.find({
                    where: {
                        notice_to: 'Employees',
                    },
                });
                break;
            case 'clients':
                noticeBoards = yield Notice_Board_1.Notice_board.find({
                    where: {
                        notice_to: 'Clients',
                    },
                });
                break;
            default:
                noticeBoards = yield Notice_Board_1.Notice_board.find();
                break;
        }
        return res.status(200).json({
            code: 200,
            success: true,
            noticeBoards,
            message: 'Get detail notice board successfully',
        });
    })),
    getAllByNoticeTo: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { noticeTo } = req.params;
        //get all notice
        const noticeBoards = yield Notice_Board_1.Notice_board.find({
            where: {
                notice_to: noticeTo
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            noticeBoards: noticeBoards,
            message: 'Get notice boards by notice to successfully',
        });
    })),
};
exports.default = noticeBoardController;
