"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Contract_entity_1 = require("../entities/Contract.entity");
const Job_Offer_Letter_entity_1 = require("../entities/Job_Offer_Letter.entity");
const Sign_entity_1 = require("../entities/Sign.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const signController = {
    createConTractSign: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const _a = req.body, { contract } = _a, dataNewSign = __rest(_a, ["contract"]);
        //Check exist contract
        const existingContract = yield Contract_entity_1.Contract.findOne({
            where: {
                id: contract
            }
        });
        if (!existingContract)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract does not exist in the system',
            });
        //Check contract signed
        if (existingContract.sign)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract has been signed',
            });
        //Create new sign 
        const newSign = yield Sign_entity_1.Sign.create(Object.assign({}, dataNewSign)).save();
        //Update relationship with contract
        yield Contract_entity_1.Contract.update(existingContract.id, {
            sign: newSign
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Signed contract successfully',
        });
    })),
    createJobOfferSign: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const _b = req.body, { jobOfferLetter } = _b, dataNewSign = __rest(_b, ["jobOfferLetter"]);
        //Check exist job offer letter
        const existingJobOfferLetter = yield Job_Offer_Letter_entity_1.Job_offer_letter.findOne({
            where: {
                id: jobOfferLetter
            }
        });
        if (!existingJobOfferLetter)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job offer letter does not exist in the system',
            });
        //Check job offer letter signed
        if (existingJobOfferLetter.sign)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job offer letter has been signed',
            });
        //Create new sign 
        const newSign = yield Sign_entity_1.Sign.create(Object.assign({}, dataNewSign)).save();
        //Update relationship with job offer letter
        yield Job_Offer_Letter_entity_1.Job_offer_letter.update(existingJobOfferLetter.id, {
            sign: newSign
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Signed job offer letter successfully',
        });
    })),
};
exports.default = signController;
