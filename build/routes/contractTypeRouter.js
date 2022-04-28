"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contractTypeController_1 = __importDefault(require("../controllers/contractTypeController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const contractTypeRouter = express_1.default.Router();
contractTypeRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), contractTypeController_1.default.create);
contractTypeRouter.get('/', contractTypeController_1.default.getAll);
contractTypeRouter.get('/:id', contractTypeController_1.default.getDetail);
contractTypeRouter.delete('/:id', (0, checkAuth_1.checkAuth)(['Admin']), contractTypeController_1.default.delete);
contractTypeRouter.put('/:id', (0, checkAuth_1.checkAuth)(['Admin']), contractTypeController_1.default.update);
exports.default = contractTypeRouter;
