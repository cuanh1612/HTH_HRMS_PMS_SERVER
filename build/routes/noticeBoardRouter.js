"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const noticeBoardController_1 = __importDefault(require("../controllers/noticeBoardController"));
const noticeBoardRouter = express_1.default.Router();
noticeBoardRouter.post('/', noticeBoardController_1.default.create);
noticeBoardRouter.get('/', noticeBoardController_1.default.getAll);
noticeBoardRouter.get('/:noticeBoardId', noticeBoardController_1.default.getDetail);
noticeBoardRouter.put('/:noticeBoardId', noticeBoardController_1.default.update);
noticeBoardRouter.delete('/:noticeBoardId', noticeBoardController_1.default.delete);
noticeBoardRouter.post('/delete-many', noticeBoardController_1.default.deleteMany);
exports.default = noticeBoardRouter;
