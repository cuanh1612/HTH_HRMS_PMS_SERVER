"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobType_controller_1 = __importDefault(require("../controllers/jobType.controller"));
const jobTypeRouter = express_1.default.Router();
jobTypeRouter.post('/', jobType_controller_1.default.create);
jobTypeRouter.delete('/:id', jobType_controller_1.default.delete);
jobTypeRouter.get('/', jobType_controller_1.default.getAll);
jobTypeRouter.get('/:id', jobType_controller_1.default.getDetail);
jobTypeRouter.put('/:id', jobType_controller_1.default.update);
exports.default = jobTypeRouter;
