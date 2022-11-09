"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const room_controller_1 = __importDefault(require("../controllers/room.controller"));
const projectRouter = express_1.default.Router();
projectRouter.get('/', room_controller_1.default.getAll);
projectRouter.post('/', room_controller_1.default.create);
projectRouter.delete('/:id', room_controller_1.default.delete);
projectRouter.put('/:id', room_controller_1.default.update);
projectRouter.get('/title/:title', room_controller_1.default.getByTitle);
projectRouter.get('/:id', room_controller_1.default.getDetail);
exports.default = projectRouter;
