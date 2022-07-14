"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const locationController_1 = __importDefault(require("../controllers/locationController"));
const locationRouter = express_1.default.Router();
locationRouter.post('/', locationController_1.default.createMany);
locationRouter.delete('/delete-many', locationController_1.default.deleteMany);
locationRouter.delete('/:id', locationController_1.default.delete);
locationRouter.get('/', locationController_1.default.getAll);
locationRouter.get('/:id', locationController_1.default.getDetail);
locationRouter.put('/:id', locationController_1.default.update);
exports.default = locationRouter;
