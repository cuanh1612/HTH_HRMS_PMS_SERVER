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
exports.templateInterview = exports.templateWEmail = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const Company_Info_entity_1 = require("../entities/Company_Info.entity");
const templateBasic = ({ file, handleBody, name, }) => __awaiter(void 0, void 0, void 0, function* () {
    const companyInfo = (yield Company_Info_entity_1.Company_Info.find({}))[0];
    fs_1.default.writeFileSync((0, path_1.resolve)(__dirname, file), '');
    fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/header.txt'))
        .toString()
        .split('\n')
        .forEach(function (line) {
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
    });
    // set link to go main page
    fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), `href="${process.env.CLIENT_URL}"` + '\n');
    fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element2.txt'))
        .toString()
        .split('\n')
        .forEach(function (line) {
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
    });
    fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), `src = '${companyInfo.logo_url ||
        'https://res.cloudinary.com/hoang161201/image/upload/v1661758934/image/icon-192x192_gfnav2.png'}'` + '\n');
    fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element3.txt'))
        .toString()
        .split('\n')
        .forEach(function (line) {
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
    });
    fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), `${companyInfo.name}` + '\n');
    fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element4.txt'))
        .toString()
        .split('\n')
        .forEach(function (line) {
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
    });
    fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), `${name}` + '\n');
    fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element5.txt'))
        .toString()
        .split('\n')
        .forEach(function (line) {
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
    });
    handleBody();
    fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element8.txt'))
        .toString()
        .split('\n')
        .forEach(function (line) {
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
    });
    fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), `${companyInfo.name}` + '\n');
    fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element9.txt'))
        .toString()
        .split('\n')
        .forEach(function (line) {
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
    });
    fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), `href="https://www.facebook.com/hoang.nguyenquang.395454/"` + '\n');
    fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element10.txt'))
        .toString()
        .split('\n')
        .forEach(function (line) {
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
    });
    fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), `href="https://www.facebook.com/profile.php?id=100014461876748"` + '\n');
    fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element11.txt'))
        .toString()
        .split('\n')
        .forEach(function (line) {
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
    });
    fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), `href="https://www.facebook.com/profile.php?id=100006706506739"` + '\n');
    fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element12.txt'))
        .toString()
        .split('\n')
        .forEach(function (line) {
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
    });
});
const templateWEmail = ({ activeToken, name, file, }) => __awaiter(void 0, void 0, void 0, function* () {
    const handleBody = () => {
        fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element13.txt'))
            .toString()
            .split('\n')
            .forEach(function (line) {
            fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
        });
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), `href="${activeToken}"` + '\n');
        fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element6.txt'))
            .toString()
            .split('\n')
            .forEach(function (line) {
            fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
        });
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), `href="${activeToken}"` + '\n');
        fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element7.txt'))
            .toString()
            .split('\n')
            .forEach(function (line) {
            fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
        });
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), activeToken + '\n');
    };
    templateBasic({
        file,
        handleBody,
        name,
    });
});
exports.templateWEmail = templateWEmail;
const templateInterview = ({ position, name, file, time, }) => __awaiter(void 0, void 0, void 0, function* () {
    const companyInfo = (yield Company_Info_entity_1.Company_Info.find({}))[0];
    const handleBody = () => __awaiter(void 0, void 0, void 0, function* () {
        fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element14.txt'))
            .toString()
            .split('\n')
            .forEach(function (line) {
            fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
        });
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), position + '\n');
        fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element15.txt'))
            .toString()
            .split('\n')
            .forEach(function (line) {
            fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
        });
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), companyInfo.name + '\n');
        fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element16.txt'))
            .toString()
            .split('\n')
            .forEach(function (line) {
            fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
        });
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), companyInfo.name + '\n');
        fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element17.txt'))
            .toString()
            .split('\n')
            .forEach(function (line) {
            fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
        });
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), time + '\n');
        fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element18.txt'))
            .toString()
            .split('\n')
            .forEach(function (line) {
            fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
        });
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), companyInfo.name + '\n');
        fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element19.txt'))
            .toString()
            .split('\n')
            .forEach(function (line) {
            fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
        });
        fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), name + '\n');
        fs_1.default.readFileSync((0, path_1.resolve)(__dirname, '../../views/common/element20.txt'))
            .toString()
            .split('\n')
            .forEach(function (line) {
            fs_1.default.appendFileSync((0, path_1.resolve)(__dirname, file), line.toString() + '\n');
        });
    });
    templateBasic({
        file: file,
        handleBody,
        name,
    });
});
exports.templateInterview = templateInterview;
