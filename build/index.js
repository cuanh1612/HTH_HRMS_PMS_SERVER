"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
require("reflect-metadata");
const connectDB_1 = __importDefault(require("./config/connectDB"));
const socketIO_1 = __importDefault(require("./config/socketIO"));
const mainRouter_1 = __importDefault(require("./routes/mainRouter"));
const express_session_1 = __importDefault(require("express-session"));
const PORT = process.env.PORT || 4000;
//Create typeorm connection
(0, connectDB_1.default)();
//Creae and setup express app
const app = (0, express_1.default)();
app.enable('trust proxy');
const httpServer = (0, http_1.createServer)(app);
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: 'somesecret',
    proxy: true,
    cookie: {
        secure: true,
        maxAge: 5184000000,
        sameSite: 'lax',
        path: '/'
    }
}));
app.use((0, cors_1.default)({
    origin: 'https://huprom-hrms-pms-client.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));
//Routes
(0, mainRouter_1.default)(app);
//Setting socket server
(0, socketIO_1.default)(httpServer);
//Server listen PORT
httpServer.listen(PORT, () => {
    console.log(`Server listen at http://localhost:${PORT}, ${process.env.URL_CLIENT}`);
});
