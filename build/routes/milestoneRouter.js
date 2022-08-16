"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const milestoneController_1 = __importDefault(require("../controllers/milestoneController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
//have check auth in controller
const milestoneRouter = express_1.default.Router();
milestoneRouter.post('/', milestoneController_1.default.create);
milestoneRouter.get('/normal', (0, checkAuth_1.checkAuth)([]), milestoneController_1.default.getAll);
milestoneRouter.put('/:id', milestoneController_1.default.update);
milestoneRouter.get('/normal/:id', (0, checkAuth_1.checkAuth)([]), milestoneController_1.default.getByProject);
milestoneRouter.get('/detail/:id', (0, checkAuth_1.checkAuth)([]), milestoneController_1.default.getDetail);
milestoneRouter.get('/:id', (0, checkAuth_1.checkAuth)([]), milestoneController_1.default.getByProjectWithTask);
milestoneRouter.delete('/:id', milestoneController_1.default.delete);
exports.default = milestoneRouter;
