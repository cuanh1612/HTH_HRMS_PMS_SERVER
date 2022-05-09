"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendanceController_1 = __importDefault(require("../controllers/attendanceController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const attendanceRouter = express_1.default.Router();
<<<<<<< HEAD
attendanceRouter.get('/', attendanceController_1.default.getAll);
attendanceRouter.post('/', attendanceController_1.default.create);
attendanceRouter.put('/:id', attendanceController_1.default.update);
=======
attendanceRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), attendanceController_1.default.create);
attendanceRouter.put('/:id', (0, checkAuth_1.checkAuth)(['Admin']), attendanceController_1.default.update);
>>>>>>> 5b4245ec80043f977be9e81dbee71ce78487dd1a
attendanceRouter.get('/:id', attendanceController_1.default.getDetail);
attendanceRouter.delete('/:id', (0, checkAuth_1.checkAuth)(['Admin']), attendanceController_1.default.delete);
exports.default = attendanceRouter;
