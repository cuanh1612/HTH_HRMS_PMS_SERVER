"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_controller_1 = __importDefault(require("../controllers/event.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const eventRouter = express_1.default.Router();
eventRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), event_controller_1.default.create);
eventRouter.get('/', event_controller_1.default.getAll);
eventRouter.get('/employee/:employeeId', event_controller_1.default.getByEmployee);
eventRouter.get('/:eventId', event_controller_1.default.getDetail);
eventRouter.delete('/:eventId', (0, checkAuth_1.checkAuth)(['Admin']), event_controller_1.default.delete);
eventRouter.put('/:eventId', (0, checkAuth_1.checkAuth)(['Admin']), event_controller_1.default.update);
exports.default = eventRouter;
