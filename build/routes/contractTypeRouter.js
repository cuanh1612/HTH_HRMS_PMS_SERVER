"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contractTypeController_1 = __importDefault(require("../controllers/contractTypeController"));
const contractTypeRouter = express_1.default.Router();
contractTypeRouter.post('/', contractTypeController_1.default.create);
contractTypeRouter.get('/', contractTypeController_1.default.getAll);
contractTypeRouter.get('/:id', contractTypeController_1.default.getDetail);
contractTypeRouter.delete('/:id', contractTypeController_1.default.delete);
contractTypeRouter.put('/:id', contractTypeController_1.default.update);
exports.default = contractTypeRouter;
