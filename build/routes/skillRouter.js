"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const skillController_1 = __importDefault(require("../controllers/skillController"));
const skillRouter = express_1.default.Router();
skillRouter.post('/', skillController_1.default.createmany);
skillRouter.delete('/:id', skillController_1.default.delete);
skillRouter.post('/delete-many', skillController_1.default.deletemany);
skillRouter.get('/', skillController_1.default.getAll);
skillRouter.put('/:id', skillController_1.default.update);
exports.default = skillRouter;
