"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventController_1 = __importDefault(require("../controllers/eventController"));
const eventRouter = express_1.default.Router();
eventRouter.post('/', eventController_1.default.create);
eventRouter.get('/', eventController_1.default.getAll);
eventRouter.get('/:enventId', eventController_1.default.getDetail);
eventRouter.delete('/:enventId', eventController_1.default.delete);
eventRouter.put('/:enventId', eventController_1.default.update);
exports.default = eventRouter;
