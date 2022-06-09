"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
require("reflect-metadata");
const connectDB_1 = __importDefault(require("./config/connectDB"));
const socketIO_1 = __importDefault(require("./config/socketIO"));
const mainRouter_1 = __importDefault(require("./routes/mainRouter"));
const PORT = process.env.PORT || 4000;
//Create typeorm connection
(0, connectDB_1.default)();
//Creae and setup express app
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: `${process.env.URL_CLIENT}`,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
}));
//Routes
(0, mainRouter_1.default)(app);
//Setting socket server
(0, socketIO_1.default)(httpServer);
//Server listen PORT
httpServer.listen(PORT, () => {
    console.log(`Server listen at http://localhost:${PORT}`);
});
