"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roomController_1 = __importDefault(require("../controllers/roomController"));
const projectRouter = express_1.default.Router();
projectRouter.get('/', roomController_1.default.getAll);
projectRouter.post('/', roomController_1.default.create);
projectRouter.delete('/:id', roomController_1.default.delete);
projectRouter.put('/:id', roomController_1.default.update);
projectRouter.get('/title/:title', roomController_1.default.getByTitle);
projectRouter.get('/:id', roomController_1.default.getDetail);
exports.default = projectRouter;
