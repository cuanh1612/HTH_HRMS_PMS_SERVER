"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const skillController_1 = __importDefault(require("../controllers/skillController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const skillRouter = express_1.default.Router();
skillRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), skillController_1.default.createMany);
skillRouter.delete('/:id', (0, checkAuth_1.checkAuth)(['Admin']), skillController_1.default.delete);
skillRouter.post('/delete-many', (0, checkAuth_1.checkAuth)(['Admin']), skillController_1.default.deleteMany);
skillRouter.get('/', skillController_1.default.getAll);
skillRouter.get('/:id', skillController_1.default.getDetail);
skillRouter.put('/:id', (0, checkAuth_1.checkAuth)(['Admin']), skillController_1.default.update);
exports.default = skillRouter;
