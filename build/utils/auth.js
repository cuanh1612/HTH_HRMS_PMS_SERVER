"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = exports.createAc = exports.createActiveToken = exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createToken = (type, user) => (0, jsonwebtoken_1.sign)(Object.assign({ userId: user.id, role: user.role, email: user.email }, (type === 'refreshToken' ? { tokenVersion: user.token_version } : {})), type === 'accessToken'
    ? process.env.ACCESS_TOKEN_SECRET
    : process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: type === 'accessToken' ? '5m' : '7h',
});
exports.createToken = createToken;
const createActiveToken = (email, id) => (0, jsonwebtoken_1.sign)({
    email,
    id
}, process.env.ACTIVE_TOKEN_SECRET, {
    expiresIn: '10m'
});
exports.createActiveToken = createActiveToken;
const createAc = (type, user) => (0, jsonwebtoken_1.sign)(Object.assign({ userId: user.id, role: user.role, email: user.email }, (type === 'refreshToken' ? { tokenVersion: user.token_version } : {})), type === 'accessToken'
    ? process.env.ACCESS_TOKEN_SECRET
    : process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: type === 'accessToken' ? '5m' : '7h',
});
exports.createAc = createAc;
const sendRefreshToken = (res, user) => {
    console.log(res, user);
    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, (0, exports.createToken)('refreshToken', user), {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        path: '/',
    });
};
exports.sendRefreshToken = sendRefreshToken;
