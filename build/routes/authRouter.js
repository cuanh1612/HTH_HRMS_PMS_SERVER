"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const autController_1 = __importDefault(require("../controllers/autController"));
const authRouter = express_1.default.Router();
authRouter.get('/', autController_1.default.Hello);
exports.default = authRouter;
