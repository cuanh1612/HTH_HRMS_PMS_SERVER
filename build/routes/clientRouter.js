"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientController_1 = __importDefault(require("../controllers/clientController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const clientRouter = express_1.default.Router();
clientRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), clientController_1.default.create);
clientRouter.post('/delete-many', (0, checkAuth_1.checkAuth)(['Admin']), clientController_1.default.deleteMany);
clientRouter.put('/:clientId', (0, checkAuth_1.checkAuth)(['Admin']), clientController_1.default.update);
clientRouter.get('/', clientController_1.default.getAll);
clientRouter.get('/:clientId', (0, checkAuth_1.checkAuth)([]), clientController_1.default.getDetail);
clientRouter.delete('/:clientId', (0, checkAuth_1.checkAuth)(['Admin']), clientController_1.default.delete);
exports.default = clientRouter;
