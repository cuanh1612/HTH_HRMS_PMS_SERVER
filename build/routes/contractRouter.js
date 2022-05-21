"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contractController_1 = __importDefault(require("../controllers/contractController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const contractRouter = express_1.default.Router();
contractRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), contractController_1.default.create);
contractRouter.post('/public-link', (0, checkAuth_1.checkAuth)(['Admin']), contractController_1.default.publicLink);
contractRouter.get('/public/:token', contractController_1.default.public);
contractRouter.post('/delete-many', (0, checkAuth_1.checkAuth)(['Admin']), contractController_1.default.deleteMany);
contractRouter.get('/', contractController_1.default.getAll);
contractRouter.get('/:contractId', (0, checkAuth_1.checkAuth)(['Admin', 'Client']), contractController_1.default.getDetail);
contractRouter.delete('/:contractId', (0, checkAuth_1.checkAuth)(['Admin']), contractController_1.default.delete);
contractRouter.put('/:contractId', (0, checkAuth_1.checkAuth)(['Admin']), contractController_1.default.update);
exports.default = contractRouter;
