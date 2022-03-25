"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const userRouter = express_1.default.Router();
userRouter.get('/', (0, checkAuth_1.checkAuth)([]), userController_1.default.getAll);
exports.default = userRouter;
