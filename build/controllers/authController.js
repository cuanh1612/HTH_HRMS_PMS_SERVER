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
const Employee_1 = require("../entities/Employee");
const auth_1 = require("../utils/auth");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const jsonwebtoken_1 = require("jsonwebtoken");
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const authController = {
    login: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const existingUser = yield Employee_1.Employee.findOne({
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
    googleLogin: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { token } = req.body;
        //verify email token
        const user = yield client.verifyIdToken({
            idToken: token,
        });
        //Get email
        const userEmail = (_a = user.getAttributes().payload) === null || _a === void 0 ? void 0 : _a.email;
        //Check existing user
        const existingUser = yield Employee_1.Employee.findOne({
            where: {
                email: userEmail,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Email does not exist in the system',
            });
        //Save cookie refresh token
        (0, auth_1.sendRefreshToken)(res, existingUser);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Logged in successfully',
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
        //Check decode
        try {
            const decodeUser = (0, jsonwebtoken_1.verify)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            console.log(decodeUser);
            const existingUser = yield Employee_1.Employee.findOne({
                where: {
                    id: decodeUser.userId,
                },
            });
            if (!existingUser || existingUser.token_version !== decodeUser.tokenVersion)
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
    logout: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('co ne ');
        const { userId } = req.body;
        const existingUser = yield Employee_1.Employee.findOne({
            where: {
                id: userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Logout false',
            });
        existingUser.token_version += 1;
        yield existingUser.save();
        res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            path: '/api/auth/refresh_token',
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Logout successfully',
        });
    })),
};
exports.default = authController;
