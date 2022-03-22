"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const connectDB_1 = __importDefault(require("./config/connectDB"));
const mainRouter_1 = __importDefault(require("./routes/mainRouter"));
require("reflect-metadata");
const PORT = process.env.PORT || 4000;
//Create typeorm connection
(0, connectDB_1.default)();
//Creae and setup express app
const app = (0, express_1.default)();
app.use(express_1.default.json());
//Routes
(0, mainRouter_1.default)(app);
app.listen(PORT, () => {
    console.log(`Server listen at http://localhost:${PORT}`);
});
