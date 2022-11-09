"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const noticeBoard_controller_1 = __importDefault(require("../controllers/noticeBoard.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const noticeBoardRouter = express_1.default.Router();
noticeBoardRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), noticeBoard_controller_1.default.create);
noticeBoardRouter.get('/', (0, checkAuth_1.checkAuth)([]), noticeBoard_controller_1.default.getAll);
noticeBoardRouter.get('/:noticeBoardId', (0, checkAuth_1.checkAuth)([]), noticeBoard_controller_1.default.getDetail);
noticeBoardRouter.get('/notice-to/:noticeTo', (0, checkAuth_1.checkAuth)([]), noticeBoard_controller_1.default.getAllByNoticeTo);
noticeBoardRouter.put('/:noticeBoardId', (0, checkAuth_1.checkAuth)(['Admin']), noticeBoard_controller_1.default.update);
noticeBoardRouter.delete('/:noticeBoardId', (0, checkAuth_1.checkAuth)(['Admin']), noticeBoard_controller_1.default.delete);
noticeBoardRouter.post('/delete-many', (0, checkAuth_1.checkAuth)(['Admin']), noticeBoard_controller_1.default.deleteMany);
exports.default = noticeBoardRouter;
