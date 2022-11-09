"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contractFile_controller_1 = __importDefault(require("../controllers/contractFile.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const contractFileRouter = express_1.default.Router();
contractFileRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), contractFile_controller_1.default.create);
contractFileRouter.delete('/:contractFileId/contract/:contractId', (0, checkAuth_1.checkAuth)(['Admin']), contractFile_controller_1.default.delete);
contractFileRouter.get('/contract/:contractId', (0, checkAuth_1.checkAuth)(['Admin', 'Client']), contractFile_controller_1.default.getAll);
exports.default = contractFileRouter;
