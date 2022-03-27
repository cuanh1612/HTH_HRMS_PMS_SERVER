"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRouter_1 = __importDefault(require("./authRouter"));
const mainRouter = (app) => {
    app.use('/api/auth', authRouter_1.default);
};
exports.default = mainRouter;
