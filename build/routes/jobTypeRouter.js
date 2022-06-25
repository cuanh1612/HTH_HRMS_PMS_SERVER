"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobTypeController_1 = __importDefault(require("../controllers/jobTypeController"));
const jobTypeRouter = express_1.default.Router();
jobTypeRouter.post('/', jobTypeController_1.default.create);
jobTypeRouter.delete('/:id', jobTypeController_1.default.delete);
jobTypeRouter.get('/', jobTypeController_1.default.getAll);
jobTypeRouter.get('/:id', jobTypeController_1.default.getdetail);
jobTypeRouter.put('/:id', jobTypeController_1.default.update);
exports.default = jobTypeRouter;
