"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workExperienceController_1 = __importDefault(require("../controllers/workExperienceController"));
const workExperienceRouter = express_1.default.Router();
workExperienceRouter.post('/', workExperienceController_1.default.create);
workExperienceRouter.delete('/:id', workExperienceController_1.default.delete);
workExperienceRouter.get('/', workExperienceController_1.default.getAll);
workExperienceRouter.get('/:id', workExperienceController_1.default.getDetail);
workExperienceRouter.put('/:id', workExperienceController_1.default.update);
exports.default = workExperienceRouter;
