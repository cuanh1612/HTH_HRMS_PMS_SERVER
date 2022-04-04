"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientCategoryController_1 = __importDefault(require("../controllers/clientCategoryController"));
const clientCategoryRouter = express_1.default.Router();
clientCategoryRouter.post('/', clientCategoryController_1.default.create);
clientCategoryRouter.put('/:id', clientCategoryController_1.default.update);
clientCategoryRouter.delete('/:id', clientCategoryController_1.default.delete);
clientCategoryRouter.get('/', clientCategoryController_1.default.getAll);
exports.default = clientCategoryRouter;
