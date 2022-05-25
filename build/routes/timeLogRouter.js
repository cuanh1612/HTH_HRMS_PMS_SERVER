"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const timeLogController_1 = __importDefault(require("../controllers/timeLogController"));
const TimeLogRouter = express_1.default.Router();
TimeLogRouter.post('/', timeLogController_1.default.create);
exports.default = TimeLogRouter;
