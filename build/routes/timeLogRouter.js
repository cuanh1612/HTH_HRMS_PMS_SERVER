"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const timeLogController_1 = __importDefault(require("../controllers/timeLogController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const TimeLogRouter = express_1.default.Router();
TimeLogRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), timeLogController_1.default.create);
exports.default = TimeLogRouter;
