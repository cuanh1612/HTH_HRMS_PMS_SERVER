"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signController_1 = __importDefault(require("../controllers/signController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const signRouter = express_1.default.Router();
signRouter.post('/contract', (0, checkAuth_1.checkAuth)(['Admin']), signController_1.default.createConTractSign);
signRouter.post('/job-offer-letter', (0, checkAuth_1.checkAuth)(['Admin']), signController_1.default.createJobOfferSign);
exports.default = signRouter;
