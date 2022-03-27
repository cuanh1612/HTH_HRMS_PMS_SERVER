"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const empoyeeController_1 = __importDefault(require("../controllers/empoyeeController"));
const employeeRouter = express_1.default.Router();
employeeRouter.post('/', empoyeeController_1.default.create);
exports.default = employeeRouter;
