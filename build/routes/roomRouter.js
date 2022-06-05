"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roomController_1 = __importDefault(require("../controllers/roomController"));
const projectRouter = express_1.default.Router();
projectRouter.get('/', roomController_1.default.getAll);
exports.default = projectRouter;
