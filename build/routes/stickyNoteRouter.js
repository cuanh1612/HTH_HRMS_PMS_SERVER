"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stickyNoteController_1 = __importDefault(require("../controllers/stickyNoteController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const stickyNoteRouter = express_1.default.Router();
<<<<<<< HEAD
stickyNoteRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), stickyNoteController_1.default.create);
stickyNoteRouter.put('/:id', (0, checkAuth_1.checkAuth)(['Admin']), stickyNoteController_1.default.update);
stickyNoteRouter.get('/:id', stickyNoteController_1.default.getDetail);
stickyNoteRouter.get('/', stickyNoteController_1.default.getByEmployee);
stickyNoteRouter.delete('/:id', (0, checkAuth_1.checkAuth)(['Admin']), stickyNoteController_1.default.delete);
=======
stickyNoteRouter.post('/', (0, checkAuth_1.checkAuth)([]), stickyNoteController_1.default.create);
stickyNoteRouter.put('/:id', (0, checkAuth_1.checkAuth)([]), stickyNoteController_1.default.update);
stickyNoteRouter.get('/:id', stickyNoteController_1.default.getDetail);
stickyNoteRouter.get('/', stickyNoteController_1.default.getByEmployee);
stickyNoteRouter.delete('/:id', (0, checkAuth_1.checkAuth)([]), stickyNoteController_1.default.delete);
>>>>>>> 90d4c00e7f45b3d8435ed972de31b5d43d918012
exports.default = stickyNoteRouter;
