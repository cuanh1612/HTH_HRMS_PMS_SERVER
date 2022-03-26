"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const authRouter = express_1.default.Router();
authRouter.post('/register', (0, checkAuth_1.checkAuth)(['admin']), authController_1.default.register);
authRouter.post('/login', authController_1.default.login);
authRouter.get('/refresh_token', authController_1.default.refreshToken);
authRouter.post('/logout', authController_1.default.logout);
exports.default = authRouter;
