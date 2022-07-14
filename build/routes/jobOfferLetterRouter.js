"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobOfferLetterController_1 = __importDefault(require("../controllers/jobOfferLetterController"));
const jobOfferLetterRouter = express_1.default.Router();
jobOfferLetterRouter.post('/', jobOfferLetterController_1.default.create);
jobOfferLetterRouter.delete('/:id', jobOfferLetterController_1.default.delete);
jobOfferLetterRouter.post('/delete-many', jobOfferLetterController_1.default.deleteMany);
jobOfferLetterRouter.get('/', jobOfferLetterController_1.default.getAll);
jobOfferLetterRouter.get('/:id', jobOfferLetterController_1.default.getDetail);
jobOfferLetterRouter.get('/job/:JobId', jobOfferLetterController_1.default.getByJob);
jobOfferLetterRouter.put('/:id', jobOfferLetterController_1.default.update);
jobOfferLetterRouter.get('/public/:token', jobOfferLetterController_1.default.public);
jobOfferLetterRouter.put('/status/:id', jobOfferLetterController_1.default.updateStatus);
exports.default = jobOfferLetterRouter;
