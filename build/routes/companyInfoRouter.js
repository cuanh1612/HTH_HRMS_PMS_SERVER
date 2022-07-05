"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyInfoController_1 = __importDefault(require("../controllers/companyInfoController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const companyInfoRouter = express_1.default.Router();
companyInfoRouter.put('/', (0, checkAuth_1.checkAuth)(['Admin']), companyInfoController_1.default.update);
companyInfoRouter.get('/', (0, checkAuth_1.checkAuth)([]), companyInfoController_1.default.getInfo);
exports.default = companyInfoRouter;
