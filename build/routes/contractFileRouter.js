"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contractFileController_1 = __importDefault(require("../controllers/contractFileController"));
const contractFileRouter = express_1.default.Router();
contractFileRouter.post('/', contractFileController_1.default.create);
contractFileRouter.delete('/:contractFileId/contract/:contractId', contractFileController_1.default.delete);
contractFileRouter.get('/contract/:contractId', contractFileController_1.default.getAll);
exports.default = contractFileRouter;
