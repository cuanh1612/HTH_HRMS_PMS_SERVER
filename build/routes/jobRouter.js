"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobController_1 = __importDefault(require("../controllers/jobController"));
const jobRouter = express_1.default.Router();
jobRouter.post('/', jobController_1.default.create);
jobRouter.delete('/:id', jobController_1.default.delete);
jobRouter.post('/delete-many', jobController_1.default.deleteMany);
jobRouter.get('/', jobController_1.default.getAll);
jobRouter.get('/:id', jobController_1.default.getDetail);
jobRouter.put('/status/:id', jobController_1.default.updateStatus);
jobRouter.put('/:id', jobController_1.default.update);
jobRouter.put('/change-status', jobController_1.default.changeStatusMany);
exports.default = jobRouter;
