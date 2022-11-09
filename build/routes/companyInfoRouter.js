"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyInfo_controller_1 = __importDefault(require("../controllers/companyInfo.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const companyInfoRouter = express_1.default.Router();
companyInfoRouter.put('/', (0, checkAuth_1.checkAuth)(['Admin']), companyInfo_controller_1.default.update);
companyInfoRouter.get('/', companyInfo_controller_1.default.getInfo);
exports.default = companyInfoRouter;
