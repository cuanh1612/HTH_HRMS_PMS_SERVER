"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectCategory_controller_1 = __importDefault(require("../controllers/projectCategory.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const projectCategoryRouter = express_1.default.Router();
projectCategoryRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), projectCategory_controller_1.default.create);
projectCategoryRouter.put('/:id', (0, checkAuth_1.checkAuth)(['Admin']), projectCategory_controller_1.default.update);
projectCategoryRouter.get('/', projectCategory_controller_1.default.getAll);
projectCategoryRouter.get('/:id', projectCategory_controller_1.default.getDetail);
projectCategoryRouter.delete('/:id', (0, checkAuth_1.checkAuth)(['Admin']), projectCategory_controller_1.default.delete);
exports.default = projectCategoryRouter;
