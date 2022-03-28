"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const authRouter = express_1.default.Router();
authRouter.post('/login', authController_1.default.login);
authRouter.post('/login-google', authController_1.default.googleLogin);
authRouter.get('/refresh_token', authController_1.default.refreshToken);
authRouter.post('/logout', authController_1.default.logout);
exports.default = authRouter;
