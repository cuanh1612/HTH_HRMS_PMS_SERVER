"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contractType_controller_1 = __importDefault(require("../controllers/contractType.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const contractTypeRouter = express_1.default.Router();
contractTypeRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), contractType_controller_1.default.create);
contractTypeRouter.get('/', contractType_controller_1.default.getAll);
contractTypeRouter.get('/:id', contractType_controller_1.default.getDetail);
contractTypeRouter.delete('/:id', (0, checkAuth_1.checkAuth)(['Admin']), contractType_controller_1.default.delete);
contractTypeRouter.put('/:id', (0, checkAuth_1.checkAuth)(['Admin']), contractType_controller_1.default.update);
exports.default = contractTypeRouter;
