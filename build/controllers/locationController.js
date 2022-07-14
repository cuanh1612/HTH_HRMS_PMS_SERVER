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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const Location_1 = require("../entities/Location");
const locationController = {
    createMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { locations } = req.body;
        if (!Array.isArray(locations) || locations.length < 1)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter name of location'
            });
        yield Promise.all(locations.map((location) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                yield Location_1.Location.create({
                    name: location
                }).save();
                resolve(true);
            }));
        })));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Add location success',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const locations = yield Location_1.Location.find();
        return res.status(200).json({
            code: 200,
            success: true,
            locations,
            message: 'get all locations success'
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateLocation = req.body;
        const existingLocation = yield Location_1.Location.findOne({
            where: {
                id: Number(id),
            }
        });
        if (!existingLocation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Location does not existing in the system',
            });
        (existingLocation.name = dataUpdateLocation.name),
            yield existingLocation.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update location success',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingLocation = yield Location_1.Location.findOne({
            where: {
                id: Number(id)
            }
        });
        if (!existingLocation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'location does not existing in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            location: existingLocation,
            message: 'Get detail of location success'
        });
    })),
    deleteMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { locations } = req.body;
        //check array of location
        if (!Array.isArray(locations) || !locations)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Location does not exist in the system',
            });
        yield Promise.all(locations.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const existinglocation = yield Location_1.Location.findOne({
                    where: {
                        id: id,
                    },
                });
                if (existinglocation)
                    yield Location_1.Location.remove(existinglocation);
                resolve(true);
            }));
        })));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete Location success',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingLocation = yield Location_1.Location.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingLocation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Location does not existing in the system',
            });
        yield existingLocation.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete location success',
        });
    })),
};
exports.default = locationController;
