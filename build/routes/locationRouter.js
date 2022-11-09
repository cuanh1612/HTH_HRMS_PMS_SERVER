"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const location_controller_1 = __importDefault(require("../controllers/location.controller"));
const locationRouter = express_1.default.Router();
locationRouter.post('/', location_controller_1.default.createMany);
locationRouter.delete('/delete-many', location_controller_1.default.deleteMany);
locationRouter.delete('/:id', location_controller_1.default.delete);
locationRouter.get('/', location_controller_1.default.getAll);
locationRouter.get('/:id', location_controller_1.default.getDetail);
locationRouter.put('/:id', location_controller_1.default.update);
exports.default = locationRouter;
