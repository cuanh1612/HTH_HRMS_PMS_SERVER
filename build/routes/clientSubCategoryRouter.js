"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientSubCategory_controller_1 = __importDefault(require("../controllers/clientSubCategory.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const clientSubCategoryRouter = express_1.default.Router();
clientSubCategoryRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), clientSubCategory_controller_1.default.create);
clientSubCategoryRouter.put('/:id', (0, checkAuth_1.checkAuth)(['Admin']), clientSubCategory_controller_1.default.update);
clientSubCategoryRouter.delete('/:id', (0, checkAuth_1.checkAuth)(['Admin']), clientSubCategory_controller_1.default.delete);
clientSubCategoryRouter.get('/', clientSubCategory_controller_1.default.getAll);
exports.default = clientSubCategoryRouter;
