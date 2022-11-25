"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobOfferLetter_controller_1 = __importDefault(require("../controllers/jobOfferLetter.controller"));
const jobOfferLetterRouter = express_1.default.Router();
jobOfferLetterRouter.post('/', jobOfferLetter_controller_1.default.create);
jobOfferLetterRouter.delete('/:id', jobOfferLetter_controller_1.default.delete);
jobOfferLetterRouter.post('/delete-many', jobOfferLetter_controller_1.default.deleteMany);
jobOfferLetterRouter.get('/', jobOfferLetter_controller_1.default.getAll);
jobOfferLetterRouter.get('/:id', jobOfferLetter_controller_1.default.getDetail);
jobOfferLetterRouter.get('/job/:JobId', jobOfferLetter_controller_1.default.getByJob);
jobOfferLetterRouter.put('/:id', jobOfferLetter_controller_1.default.update);
jobOfferLetterRouter.get('/public/:token', jobOfferLetter_controller_1.default.public);
jobOfferLetterRouter.put('/status/:id', jobOfferLetter_controller_1.default.updateStatus);
exports.default = jobOfferLetterRouter;
