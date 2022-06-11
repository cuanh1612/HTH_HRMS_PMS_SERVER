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
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
const redirectUri = process.env.GOOGLE_REDIRECT_URL;
const gmail = process.env.GMAIL;
const oAuth2client = new googleapis_1.google.auth.OAuth2({
    clientId,
    clientSecret,
    redirectUri,
});
oAuth2client.setCredentials({
    refresh_token: refreshToken,
});
const sendMail = ({ to, subject, text, html, }) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield oAuth2client.getAccessToken();
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: `${gmail}`,
            clientId,
            clientSecret,
            refreshToken,
            accessToken: accessToken,
        },
        secure: true,
    });
    transporter.sendMail({
        from: `${gmail}`,
        subject,
        text,
        html,
        to,
    }, function (err) {
        if (err) {
            console.log('error');
        }
        else {
            console.log('send email success');
        }
    });
});
exports.default = sendMail;
