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
const Client_1 = require("../entities/Client");
const Company_Logo_1 = require("../entities/Company_Logo");
const Contract_1 = require("../entities/Contract");
const Contract_Type_1 = require("../entities/Contract_Type");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const contractValid_1 = require("../utils/valid/contractValid");
const jsonwebtoken_1 = require("jsonwebtoken");
const Notification_1 = require("../entities/Notification");
const contractController = {
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const contracts = yield Contract_1.Contract.find();
        return res.status(200).json({
            code: 200,
            success: true,
            contracts,
            message: 'Get all contracts successfully',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { contractId } = req.params;
        //Check existing contract
        const existingContract = yield Contract_1.Contract.findOne({
            where: {
                id: Number(contractId),
            },
        });
        if (!existingContract)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            contract: existingContract,
            message: 'Get detail contract successfully',
        });
    })),
    publicLink: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { idContract } = req.body;
        if (!idContract) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract not exist.',
            });
        }
        const contract = yield Contract_1.Contract.findOne({
            where: {
                id: Number(idContract),
            },
        });
        if (!contract)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract does not exists in the system',
            });
        const token = (0, jsonwebtoken_1.sign)({
            id: idContract,
        }, `${process.env.CONTRACT_TOKEN_SECRET}`, {
            expiresIn: '10m',
        });
        return res.status(200).json({
            code: 200,
            success: true,
            token,
            message: 'Created contract token successfully',
        });
    })),
    public: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = req.params;
        try {
            const { id } = (0, jsonwebtoken_1.verify)(token, `${process.env.CONTRACT_TOKEN_SECRET}`);
            const contract = yield Contract_1.Contract.findOne({
                where: {
                    id: Number(id),
                },
            });
            if (!contract)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Contract does not exists in the system',
                });
            return res.status(200).json({
                code: 200,
                success: true,
                contract,
                message: 'Created contract token successfully',
            });
        }
        catch (error) {
            return res.status(403).json({
                code: 403,
                success: false,
                message: 'You not allow to see',
            });
        }
    })),
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewContract = req.body;
        //Check valid
        const messageValid = contractValid_1.contractValid.createOrUpdate(dataNewContract);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check existing client
        const existingClient = yield Client_1.Client.findOne({
            where: {
                id: dataNewContract.client,
            },
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exists in the system',
            });
        //Check exist contract type
        if (dataNewContract.contract_type) {
            const existingContractType = yield Contract_Type_1.Contract_type.findOne({
                where: {
                    id: dataNewContract.contract_type,
                },
            });
            if (!existingContractType)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Contract tpee does not exists in the system',
                });
        }
        //Create new contract
        const newContract = yield Contract_1.Contract.create(Object.assign({}, dataNewContract)).save();
        //create new note for client
        yield Notification_1.Notification.create({
            client: existingClient,
            url: '/contracts',
            content: 'There is a new contract you have just been assigned',
        }).save();
        return res.status(200).json({
            code: 200,
            success: true,
            contract: newContract,
            message: 'Created new contract successfully',
        });
    })),
    importCSV: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { contracts } = req.body;
        let contractNotValid = [];
        //contract not have client or client category
        let contractNotCLCA = [];
        yield Promise.all(contracts.map((contract) => {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                //Check valid
                const messageValid = contractValid_1.contractValid.createOrUpdate(contract);
                if (messageValid && contract.index) {
                    contractNotValid.push(contract.index);
                }
                else {
                    //Check existing client
                    const existingClient = yield Client_1.Client.findOne({
                        where: {
                            id: contract.client,
                        },
                    });
                    const existingContractType = yield Contract_Type_1.Contract_type.findOne({
                        where: {
                            id: contract.contract_type,
                        },
                    });
                    if (!existingClient || !existingContractType) {
                        if (contract.index)
                            contractNotCLCA.push(contract.index);
                    }
                    else {
                        console.log(contract.subject);
                        console.log(contract.subject);
                        console.log(contract.subject);
                        console.log(contract.subject);
                        console.log(contract.subject);
                        console.log(contract.subject);
                        console.log(contract.subject);
                        console.log(contract.subject);
                        console.log(contract.subject);
                        console.log(contract.subject);
                        console.log(contract.subject);
                        console.log(contract.subject);
                        console.log(contract.subject);
                        console.log(contract.subject);
                        console.log(contract.subject);
                        console.log(contract.subject);
                        console.log(contract.subject);
                        //Create new contract
                        yield Contract_1.Contract.create(Object.assign(Object.assign({}, contract), { subject: contract.subject })).save();
                        //create new note for client
                        yield Notification_1.Notification.create({
                            client: existingClient,
                            url: '/contracts',
                            content: 'There is a new contract you have just been assigned',
                        }).save();
                    }
                }
                resolve(true);
            }));
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: `Create contracts by import csv successfully${contractNotValid.length > 0
                ? `. Incorrect lines of data that are not added to the server include index ${contractNotValid.toString()}`
                : ''}${contractNotCLCA.length > 0
                ? `. Contract data not existing client or client category include index ${contractNotCLCA.toString()}`
                : ``}`,
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataUpdateContract = req.body;
        const { contractId } = req.params;
        //Check valid
        const messageValid = contractValid_1.contractValid.createOrUpdate(dataUpdateContract);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check existing contract
        const existingContract = yield Contract_1.Contract.findOne({
            where: {
                id: Number(contractId),
            },
        });
        if (!existingContract)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract does not exist in the system',
            });
        //Check exist contract type
        if (dataUpdateContract.contract_type) {
            const existingContractType = yield Contract_Type_1.Contract_type.findOne({
                where: {
                    id: dataUpdateContract.contract_type.id,
                },
            });
            if (!existingContractType)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Contract does not exists in the system',
                });
        }
        if (dataUpdateContract.client) {
            //Check existing client
            const existingClient = yield Client_1.Client.findOne({
                where: {
                    id: dataUpdateContract.client,
                },
            });
            if (!existingClient)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client does not exist in the system',
                });
        }
        //Check exist and update company avatar
        const { company_logo } = dataUpdateContract, dataUpdateContractBase = __rest(dataUpdateContract, ["company_logo"]);
        let newCompanyLogo = null;
        if (company_logo) {
            if (existingContract.company_logo) {
                const existingCompanyLogo = yield Company_Logo_1.Company_logo.findOne({
                    where: {
                        id: existingContract.company_logo.id,
                    },
                });
                if (existingCompanyLogo) {
                    yield Company_Logo_1.Company_logo.update(existingCompanyLogo.id, Object.assign({}, company_logo));
                }
            }
            else {
                newCompanyLogo = yield Company_Logo_1.Company_logo.create(Object.assign({}, company_logo)).save();
            }
        }
        //Update contract
        yield Contract_1.Contract.update({
            id: existingContract.id,
        }, Object.assign(Object.assign({}, dataUpdateContractBase), (newCompanyLogo
            ? {
                company_logo: newCompanyLogo,
            }
            : {})));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Updated contract successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { contractId } = req.params;
        //Check existing contract
        const existingContract = yield Contract_1.Contract.findOne({
            where: {
                id: Number(contractId),
            },
        });
        if (!existingContract)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract does not exist in the system',
            });
        //Delete contract
        yield existingContract.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete contract successfully',
        });
    })),
    deleteMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { contracts } = req.body;
        if (!contracts || !Array.isArray(contracts))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select many contracts to delete',
            });
        for (let index = 0; index < contracts.length; index++) {
            const contractId = contracts[index];
            //Check existing contract
            const existingContract = yield Contract_1.Contract.findOne({
                where: {
                    id: Number(contractId),
                },
            });
            if (existingContract) {
                //Delete contract
                yield existingContract.remove();
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete contracts successfully',
        });
    })),
};
exports.default = contractController;
