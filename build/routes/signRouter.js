"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signController_1 = __importDefault(require("../controllers/signController"));
const signRouter = express_1.default.Router();
signRouter.post('/', signController_1.default.create);
exports.default = signRouter;
