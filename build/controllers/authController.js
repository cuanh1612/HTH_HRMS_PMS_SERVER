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
const argon2_1 = __importDefault(require("argon2"));
const User_1 = require("../entities/User");
const auth_1 = require("../utils/auth");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const jsonwebtoken_1 = require("jsonwebtoken");
const authController = {
    register: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, email, password } = req.body;
        const existingUser = yield User_1.User.findOne({
            where: {
                email,
            },
        });
        if (existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Duplicated email',
            });
        const hashedPassword = yield argon2_1.default.hash(password);
        const newUser = User_1.User.create({
            email,
            password: hashedPassword,
            username,
        });
        const createdUser = yield newUser.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'User registration successfully',
            user: createdUser,
        });
    })),
    login: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const existingUser = yield User_1.User.findOne({
            where: {
                email,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Incorrect email or password',
            });
        const isPasswordValid = yield argon2_1.default.verify(existingUser.password, password);
        if (!isPasswordValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Incorrect email or password',
            });
        //Save cookie refresh token
        (0, auth_1.sendRefreshToken)(res, existingUser);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Logged in successfully',
            user: existingUser,
            accessToken: (0, auth_1.createToken)('accessToken', existingUser),
        });
    })),
    refreshToken: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME];
        if (!refreshToken)
            return res.status(401).json({
                code: 401,
                success: false,
                message: 'You must login first',
            });
        console.log(process.env.REFRESH_TOKEN_SECRET);
        //Check decode
        try {
            const decodeUser = (0, jsonwebtoken_1.verify)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            console.log(decodeUser);
            const existingUser = yield User_1.User.findOne({
                where: {
                    id: decodeUser.userId,
                },
            });
            if (!existingUser)
                return res.status(401).json({
                    code: 401,
                    success: false,
                    message: 'You must login first',
                });
            (0, auth_1.sendRefreshToken)(res, existingUser);
            return res.status(200).json({
                code: 200,
                success: true,
                message: 'Refresh token success',
                accessToken: (0, auth_1.createToken)('accessToken', existingUser),
            });
        }
        catch (error) {
            return res.status(403).json({
                code: 403,
                success: false,
                message: 'You must login first',
            });
        }
    })),
};
exports.default = authController;
