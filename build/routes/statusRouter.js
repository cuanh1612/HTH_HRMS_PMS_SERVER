"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statusController_1 = __importDefault(require("../controllers/statusController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
//Check auth in controller
const statusRouter = express_1.default.Router();
statusRouter.post('/', (0, checkAuth_1.checkAuth)([]), statusController_1.default.create);
statusRouter.get('/normal/:projectId', statusController_1.default.getAllPj);
statusRouter.get('/detail/:id', statusController_1.default.getDetail);
statusRouter.get('/:projectId', statusController_1.default.getAllWithTask);
statusRouter.put('/position', (0, checkAuth_1.checkAuth)([]), statusController_1.default.changePosition);
statusRouter.put('/:id', (0, checkAuth_1.checkAuth)([]), statusController_1.default.update);
statusRouter.delete('/:id', (0, checkAuth_1.checkAuth)([]), statusController_1.default.delete);
exports.default = statusRouter;
