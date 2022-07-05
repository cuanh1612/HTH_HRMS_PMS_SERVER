"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hourlyRateController_1 = __importDefault(require("../controllers/hourlyRateController"));
const hourlyRateRouter = express_1.default.Router();
hourlyRateRouter.put('/', hourlyRateController_1.default.update);
exports.default = hourlyRateRouter;
