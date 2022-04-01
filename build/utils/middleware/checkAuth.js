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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const checkAuth = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(roles);
            //auth Header here is "Bearer accessToken"
            const authHeader = req.header('Authorization');
            const accessToken = authHeader && authHeader.split(' ')[1];
            console.log(accessToken);
            if (!accessToken)
                return res.status(401).json({
                    code: 401,
                    success: false,
                    message: 'Not authenticated to perform operations',
                });
            //Decode user
            const decodeUser = (0, jsonwebtoken_1.verify)(accessToken, process.env.ACCESS_TOKEN_SECRET);
            //Check role
            if (decodeUser) {
                if (roles && Array.isArray(roles) && roles.includes(decodeUser.role)) {
                    return res.status(401).json({
                        code: 401,
                        success: false,
                        message: 'No permission to perform this function',
                    });
                }
            }
            return next();
        }
        catch (error) {
            return res.status(401).json({
                code: 401,
                success: false,
                message: 'Error authenticating user',
            });
        }
    });
};
exports.checkAuth = checkAuth;
