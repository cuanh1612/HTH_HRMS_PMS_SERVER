"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contractController_1 = __importDefault(require("../controllers/contractController"));
const contractRouter = express_1.default.Router();
contractRouter.post('/', contractController_1.default.create);
contractRouter.post('/delete-many', contractController_1.default.deleteMany);
contractRouter.get('/', contractController_1.default.getAll);
contractRouter.get('/:contractId', contractController_1.default.getDetail);
contractRouter.delete('/:contractId', contractController_1.default.delete);
contractRouter.put('/:contractId', contractController_1.default.update);
exports.default = contractRouter;
