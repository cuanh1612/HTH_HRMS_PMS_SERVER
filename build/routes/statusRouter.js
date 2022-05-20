"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statusController_1 = __importDefault(require("../controllers/statusController"));
const statusRouter = express_1.default.Router();
statusRouter.post('/', statusController_1.default.create);
statusRouter.get('/:projectId', statusController_1.default.getAll);
statusRouter.put('/position', statusController_1.default.changeposition);
statusRouter.put('/:id', statusController_1.default.update);
statusRouter.delete('/:id', statusController_1.default.delete);
exports.default = statusRouter;
