"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientSubCategoryController_1 = __importDefault(require("../controllers/clientSubCategoryController"));
const clientSubCategoryRouter = express_1.default.Router();
clientSubCategoryRouter.post('/', clientSubCategoryController_1.default.create);
clientSubCategoryRouter.put('/:id', clientSubCategoryController_1.default.update);
clientSubCategoryRouter.delete('/:id', clientSubCategoryController_1.default.delete);
clientSubCategoryRouter.get('/', clientSubCategoryController_1.default.getAll);
exports.default = clientSubCategoryRouter;
