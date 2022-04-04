"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientController_1 = __importDefault(require("../controllers/clientController"));
const clientRouter = express_1.default.Router();
clientRouter.post('/', clientController_1.default.create);
clientRouter.post('/delete_may', clientController_1.default.deleteMany);
clientRouter.put('/:clientId', clientController_1.default.update);
clientRouter.get('/', clientController_1.default.getAll);
clientRouter.get('/:clientId', clientController_1.default.getDetail);
clientRouter.delete('/:clientId', clientController_1.default.delete);
exports.default = clientRouter;
