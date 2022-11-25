"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workExperience_controller_1 = __importDefault(require("../controllers/workExperience.controller"));
const workExperienceRouter = express_1.default.Router();
workExperienceRouter.post('/', workExperience_controller_1.default.create);
workExperienceRouter.delete('/:id', workExperience_controller_1.default.delete);
workExperienceRouter.get('/', workExperience_controller_1.default.getAll);
workExperienceRouter.get('/:id', workExperience_controller_1.default.getDetail);
workExperienceRouter.put('/:id', workExperience_controller_1.default.update);
exports.default = workExperienceRouter;
