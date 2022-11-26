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
const Employee_entity_1 = require("../entities/Employee.entity");
const auth_1 = require("../utils/auth");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const jsonwebtoken_1 = require("jsonwebtoken");
const google_auth_library_1 = require("google-auth-library");
const Client_entity_1 = require("../entities/Client.entity");
const sendNotice_1 = __importDefault(require("../utils/sendNotice"));
const employeeValid_1 = require("../utils/valid/employeeValid");
const templateEmail_1 = require("../utils/templateEmail");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const authController = {
    login: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const existingUser = (yield Employee_entity_1.Employee.findOne({
            where: {
                email,
            },
        })) ||
            (yield Client_entity_1.Client.findOne({
                where: {
                    email,
                },
            }));
        const existingUserPassword = (yield Employee_entity_1.Employee.createQueryBuilder('employee')
            .where('employee.email = :email', { email: email })
            .select('employee.password')
            .getOne()) ||
            (yield Client_entity_1.Client.createQueryBuilder('client')
                .where('client.email = :email', { email: email })
                .select('client.password')
                .getOne());
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Incorrect email or password',
            });
        if (!existingUser || !(existingUserPassword === null || existingUserPassword === void 0 ? void 0 : existingUserPassword.password))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Incorrect email or password',
            });
        if (!existingUser.can_login)
            return res.status(400).json({
                code: 400,
                success: false,
                message: "You can't login to the system",
            });
        const isPasswordValid = yield argon2_1.default.verify(existingUserPassword.password, password);
        if (!isPasswordValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Incorrect email or password',
            });
        //Save cookie refresh token
        // sendRefreshToken(res, existingUser)
        const refreshToken = (0, auth_1.createToken)('refreshToken', existingUser);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Logged in successfully',
            user: existingUser,
            accessToken: (0, auth_1.createToken)('accessToken', existingUser),
            refreshToken,
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
        const existingUser = (yield Employee_entity_1.Employee.findOne({
            where: {
                email: userEmail,
            },
        })) ||
            (yield Client_entity_1.Client.findOne({
                where: {
                    email: userEmail,
                },
            }));
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Email does not exist in the system',
            });
        if (!existingUser.can_login)
            return res.status(400).json({
                code: 400,
                success: false,
                message: "You can't login to the system",
            });
        //Save cookie refresh token
        // sendRefreshToken(res, existingUser)
        const refreshToken = (0, auth_1.createToken)('refreshToken', existingUser);
        return res.status(200).json({
            code: 200,
            success: true,
            user: existingUser,
            message: 'Logged in successfully',
            accessToken: (0, auth_1.createToken)('accessToken', existingUser),
            refreshToken,
        });
    })),
    refreshToken: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const refreshToken = req.cookies[`jwt-auth-cookie`];
        if (!refreshToken)
            return res.status(401).json({
                code: 401,
                success: false,
                message: 'You must login first',
                refreshToken,
            });
        //Check decode
        try {
            const decodeUser = (0, jsonwebtoken_1.verify)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const existingUser = (yield Employee_entity_1.Employee.findOne({
                where: {
                    email: decodeUser.email,
                },
            })) ||
                (yield Client_entity_1.Client.findOne({
                    where: {
                        email: decodeUser.email,
                    },
                }));
            if (!existingUser || existingUser.token_version !== decodeUser.tokenVersion)
                return res.status(401).json({
                    code: 401,
                    success: false,
                    message: 'You must login 1first',
                });
            //Save cookie refresh token
            // sendRefreshToken(res, existingUser)
            const createdRefreshToken = (0, auth_1.createToken)('refreshToken', existingUser);
            return res.status(200).json({
                code: 200,
                success: true,
                message: 'Refresh token successfully',
                accessToken: (0, auth_1.createToken)('accessToken', existingUser),
                refreshToken: createdRefreshToken,
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
        var _b;
        //check exist current user
        const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        const existingUser = (yield Employee_entity_1.Employee.findOne({
            where: {
                email: decode.email,
            },
        })) ||
            (yield Client_entity_1.Client.findOne({
                where: {
                    email: decode.email,
                },
            }));
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Logout failed',
            });
        existingUser.token_version += 1;
        yield existingUser.save();
        // res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, {
        // 	httpOnly: true,
        // 	sameSite: 'lax',
        // 	secure: true,
        // 	path: '/',
        // })
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Logout successfully',
        });
    })),
    currentUser: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = (yield Employee_entity_1.Employee.findOne({
            where: {
                id: decode.userId,
                email: decode.email
            },
        })) ||
            (yield Client_entity_1.Client.findOne({
                where: {
                    id: decode.userId,
                    email: decode.email
                },
            }));
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            user: existingUser,
            message: 'Get current user successfully',
        });
    })),
    askReEnterPassword: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const existingUser = (yield Employee_entity_1.Employee.createQueryBuilder('employee')
            .where('employee.email = :email', { email: email })
            .select('employee.password')
            .getOne()) ||
            (yield Client_entity_1.Client.createQueryBuilder('client')
                .where('client.email = :email', { email: email })
                .select('employee.password')
                .getOne());
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
                message: 'Incorrect email or password 1',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Ask re enter password correct',
        });
    })),
    recoverPass: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please, enter full fields',
            });
        }
        const employee = yield Employee_entity_1.Employee.findOne({
            where: {
                email,
            },
        });
        if (!employee) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This employee does not exist in system',
            });
        }
        const activeToken = (0, auth_1.createActiveToken)(email, employee.id);
        (0, templateEmail_1.templateWEmail)({
            activeToken: `${process.env.CLIENT_URL}/reset-password/${activeToken}`,
            name: employee.name,
            file: '../../views/resetPass.handlebars'
        });
        yield (0, sendNotice_1.default)({
            to: email,
            text: 'reset password',
            subject: 'huprom-reset password',
            template: 'resetPass',
            from: `${process.env.GMAIL}`
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Password recovery link sent to your inbox.',
        });
    })),
    // reset password
    resetPassword: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { activeToken, password, passwordConfirm } = req.body;
        if (!(0, employeeValid_1.validatePassword)(password))
            return res.status(400).json({
                err: 'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
                statusCode: 400,
            });
        if (password != passwordConfirm)
            return res.status(400).json({
                err: 'Password not match',
                statusCode: 400,
            });
        const passwordHash = yield argon2_1.default.hash(password);
        const data = (0, jsonwebtoken_1.verify)(activeToken, process.env.ACTIVE_TOKEN_SECRET, {
            ignoreExpiration: false,
        });
        if (new Date() >= new Date(Number(data.exp) * 1000))
            return res.status(400).json({
                err: 'Some thing went wrong! Please request mail reset password again at login page',
                statusCode: 400,
            });
        // find user by id and update
        const existingUser = (yield Employee_entity_1.Employee.findOne({
            where: {
                email: data.email,
            },
        })) ||
            (yield Client_entity_1.Client.findOne({
                where: {
                    email: data.email,
                },
            }));
        if (!existingUser)
            return res.status(400).json({
                err: 'User does not exist',
                statusCode: 400,
            });
        existingUser.password = passwordHash;
        yield existingUser.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Reset password successfully',
        });
    })),
};
exports.default = authController;
