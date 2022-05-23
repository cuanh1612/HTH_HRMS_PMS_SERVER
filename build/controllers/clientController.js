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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const Avatar_1 = require("../entities/Avatar");
const Client_1 = require("../entities/Client");
const Client_Category_1 = require("../entities/Client_Category");
const Client_Sub_Category_1 = require("../entities/Client_Sub_Category");
const Employee_1 = require("../entities/Employee");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const clientValid_1 = require("../utils/valid/clientValid");
const clientController = {
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const clients = yield Client_1.Client.find();
        return res.status(200).json({
            code: 200,
            success: true,
            clients: clients || [],
            message: 'Get all clients successfully',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { clientId } = req.params;
        //Check existing client
        const existingClient = yield Client_1.Client.findOne({
            where: {
                id: Number(clientId),
            },
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            client: existingClient,
            message: 'Get detail client successfully',
        });
    })),
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewClient = req.body;
        //Check valid
        const messageValid = clientValid_1.clientValid.createOrUpdate(dataNewClient, 'create');
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check existing email
        const existingEmployee = yield Employee_1.Employee.findOne({
            where: {
                email: dataNewClient.email,
            },
        });
        const existingClient = yield Client_1.Client.findOne({
            where: {
                email: dataNewClient.email,
            },
        });
        if (existingEmployee || existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Email already exists in the system',
            });
        //Check existing client category
        if (dataNewClient.client_category) {
            const existCategory = yield Client_Category_1.Client_Category.findOne({
                where: {
                    id: dataNewClient.client_category,
                },
            });
            if (!existCategory)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client category does not exist',
                });
        }
        //Check existing client sub category
        if (dataNewClient.client_sub_category) {
            const existSubCategory = yield Client_Sub_Category_1.Client_Sub_Category.findOne({
                where: {
                    id: dataNewClient.client_sub_category,
                },
            });
            if (!existSubCategory)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client sub category does not exist',
                });
            //Check parent cateory of sub category is match with input category
            if (existSubCategory.client_category.id !== Number(dataNewClient.client_category))
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client category does not match with the parent of sub-category',
                });
        }
        const hashPassword = yield argon2_1.default.hash(dataNewClient.password);
        //Create new client
        const newClient = Client_1.Client.create(Object.assign(Object.assign({}, dataNewClient), { password: hashPassword, client_category: dataNewClient.client_category
                ? dataNewClient.client_category
                : undefined, client_sub_category: dataNewClient.client_sub_category
                ? dataNewClient.client_sub_category
                : undefined, salutation: dataNewClient.salutation ? dataNewClient.salutation : undefined }));
        const createdClient = yield newClient.save();
        return res.status(200).json({
            code: 200,
            success: true,
            client: createdClient,
            message: 'Created new client successfully',
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataUpdateClient = req.body;
        const { clientId } = req.params;
        //Check valid
        const messageValid = clientValid_1.clientValid.createOrUpdate(dataUpdateClient, 'update');
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check existing client
        const existingClient = yield Client_1.Client.findOne({
            where: {
                id: Number(clientId),
            },
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exist in the system',
            });
        //Check existing email
        if (dataUpdateClient.email !== existingClient.email) {
            const existingClientMail = yield Client_1.Client.findOne({
                where: {
                    email: dataUpdateClient.email,
                },
            });
            const existingEmployeeMail = yield Employee_1.Employee.findOne({
                where: {
                    email: dataUpdateClient.email,
                },
            });
            if (existingClientMail || existingEmployeeMail)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Email already exists in the system',
                });
        }
        //Check existing client category
        if (dataUpdateClient.client_category) {
            const existCategory = yield Client_Category_1.Client_Category.findOne({
                where: {
                    id: dataUpdateClient.client_category,
                },
            });
            if (!existCategory)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client category does not exist',
                });
        }
        //Check existing client sub category
        if (dataUpdateClient.client_sub_category) {
            const existSubCategory = yield Client_Sub_Category_1.Client_Sub_Category.findOne({
                where: {
                    id: dataUpdateClient.client_sub_category,
                },
            });
            if (!existSubCategory)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client sub category does not exist',
                });
            //Check parent cateory of sub category is match with input category
            if (existSubCategory.client_category.id !== Number(dataUpdateClient.client_category))
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client category does not match with the parent of sub-category',
                });
        }
        //Check exist and update avatar
        const { avatar } = dataUpdateClient, dataUpdateClientBase = __rest(dataUpdateClient, ["avatar"]);
        let newAvatar = null;
        if (avatar) {
            if (existingClient.avatar) {
                const existingAvatar = yield Avatar_1.Avatar.findOne({
                    where: {
                        id: existingClient.avatar.id,
                    },
                });
                if (existingAvatar) {
                    yield Avatar_1.Avatar.update(existingAvatar.id, Object.assign({}, avatar));
                }
            }
            else {
                newAvatar = yield Avatar_1.Avatar.create(Object.assign({}, avatar)).save();
            }
        }
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        console.log('sdfgsdfgh dfgdf dfsg');
        //Update client
        yield Client_1.Client.update({
            id: existingClient.id,
        }, Object.assign(Object.assign(Object.assign(Object.assign({}, dataUpdateClientBase), (dataUpdateClientBase.password
            ? { password: yield argon2_1.default.hash(dataUpdateClient.password) }
            : {})), (newAvatar
            ? {
                avatar: newAvatar,
            }
            : {})), { client_category: dataUpdateClient.client_category
                ? dataUpdateClient.client_category
                : undefined, client_sub_category: dataUpdateClient.client_sub_category
                ? dataUpdateClient.client_sub_category
                : undefined, salutation: dataUpdateClient.salutation ? dataUpdateClient.salutation : undefined }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Updated client successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { clientId } = req.params;
        //Check existing client
        const existingClient = yield Client_1.Client.findOne({
            where: {
                id: Number(clientId),
            },
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exist in the system',
            });
        //Delete client
        yield existingClient.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete client successfully',
        });
    })),
    deleteMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { clients } = req.body;
        if (!clients)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select many clients to delete',
            });
        for (let index = 0; index < clients.length; index++) {
            const clientId = clients[index];
            //Check existing client
            const existingClient = yield Client_1.Client.findOne({
                where: {
                    id: Number(clientId),
                },
            });
            if (existingClient) {
                //Delete client
                yield existingClient.remove();
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete clients successfully',
        });
    })),
};
exports.default = clientController;
