"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientCategory_controller_1 = __importDefault(require("../controllers/clientCategory.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const clientCategoryRouter = express_1.default.Router();
clientCategoryRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), clientCategory_controller_1.default.create);
clientCategoryRouter.put('/:id', (0, checkAuth_1.checkAuth)(['Admin']), clientCategory_controller_1.default.update);
clientCategoryRouter.delete('/:id', (0, checkAuth_1.checkAuth)(['Admin']), clientCategory_controller_1.default.delete);
clientCategoryRouter.get('/', clientCategory_controller_1.default.getAll);
exports.default = clientCategoryRouter;
