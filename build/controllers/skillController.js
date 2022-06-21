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
const Skill_1 = require("../entities/Skill");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const skillController = {
    createmany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { skills } = req.body;
        if (!Array.isArray(skills) || skills.length < 1)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter name of skill',
            });
        yield Promise.all(skills.map((skill) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                yield Skill_1.Skill.create({
                    name: skill,
                }).save();
                resolve(true);
            }));
        })));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Add skills success',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const skills = yield Skill_1.Skill.find();
        return res.status(200).json({
            code: 200,
            success: true,
            skills,
            message: 'get all skills success',
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateSkill = req.body;
        const existingskill = yield Skill_1.Skill.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingskill)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Skill does not existing in the system',
            });
        (existingskill.name = dataUpdateSkill.name), yield existingskill.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update skill success',
        });
    })),
    getdetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingskill = yield Skill_1.Skill.findOne({
            where: {
                id: Number(id)
            }
        });
        if (!existingskill)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Skill does not existing in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            skill: existingskill,
            message: 'Get detail of skill success'
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingskill = yield Skill_1.Skill.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingskill)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Skill does not existing in the system',
            });
        existingskill.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete skill success',
        });
    })),
    deletemany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { skills } = req.body;
        //check array of skill
        if (!Array.isArray(skills) || !skills)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Skill does not exist in the system',
            });
        yield Promise.all(skills.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const existingskill = yield Skill_1.Skill.findOne({
                    where: {
                        id: id,
                    },
                });
                if (existingskill)
                    yield Skill_1.Skill.remove(existingskill);
                resolve(true);
            }));
        })));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete skills success',
        });
    })),
};
exports.default = skillController;
