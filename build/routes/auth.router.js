"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const authRouter = express_1.default.Router();
authRouter.post('/login', auth_controller_1.default.login);
authRouter.post('/login-google', auth_controller_1.default.googleLogin);
authRouter.post('/ask-re-enter-password', auth_controller_1.default.askReEnterPassword);
authRouter.get('/refresh_token', auth_controller_1.default.refreshToken);
authRouter.get('/me', auth_controller_1.default.currentUser);
authRouter.post('/logout', auth_controller_1.default.logout);
authRouter.post('/recover-password', auth_controller_1.default.recoverPass);
authRouter.post('/reset-password', auth_controller_1.default.resetPassword);
exports.default = authRouter;
