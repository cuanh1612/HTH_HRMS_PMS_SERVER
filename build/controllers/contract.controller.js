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
const jsonwebtoken_1 = require("jsonwebtoken");
const typeorm_1 = require("typeorm");
const Client_entity_1 = require("../entities/Client.entity");
const Company_Logo_entity_1 = require("../entities/Company_Logo.entity");
const Contract_entity_1 = require("../entities/Contract.entity");
const Contract_Type_entity_1 = require("../entities/Contract_Type.entity");
const Notification_entity_1 = require("../entities/Notification.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const contractValid_1 = require("../utils/valid/contractValid");
const contractController = {
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const contracts = yield Contract_entity_1.Contract.find();
        return res.status(200).json({
            code: 200,
            success: true,
            contracts,
            message: 'Get all contracts successfully',
        });
    })),
    getAllByClient: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { clientId } = req.params;
        //Check existing client 
        const existingClient = yield Client_entity_1.Client.findOne({
            where: {
                id: Number(clientId)
            }
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Not found client to get contracts',
            });
        const contracts = yield Contract_entity_1.Contract.find({
            where: {
                client: {
                    id: existingClient.id
                }
            }
        });
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
        const existingContract = yield Contract_entity_1.Contract.findOne({
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
                message: 'Contract not exist',
            });
        }
        const contract = yield Contract_entity_1.Contract.findOne({
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
            message: 'Created contract link successfully',
        });
    })),
    public: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = req.params;
        try {
            const { id } = (0, jsonwebtoken_1.verify)(token, `${process.env.CONTRACT_TOKEN_SECRET}`);
            const contract = yield Contract_entity_1.Contract.findOne({
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
        const existingClient = yield Client_entity_1.Client.findOne({
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
            const existingContractType = yield Contract_Type_entity_1.Contract_type.findOne({
                where: {
                    id: dataNewContract.contract_type,
                },
            });
            if (!existingContractType)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Contract type does not exists in the system',
                });
        }
        //Create new contract
        const newContract = yield Contract_entity_1.Contract.create(Object.assign({}, dataNewContract)).save();
        //create new note for client
        yield Notification_entity_1.Notification.create({
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
        const contractNotValid = [];
        //contract not have client or client category
        const contractNotCLCA = [];
        yield Promise.all(contracts.map((contract) => {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                //Check valid
                const messageValid = contractValid_1.contractValid.createOrUpdate(contract);
                if (messageValid && contract.index) {
                    contractNotValid.push(contract.index);
                }
                else {
                    //Check existing client
                    const existingClient = yield Client_entity_1.Client.findOne({
                        where: {
                            id: contract.client,
                        },
                    });
                    const existingContractType = yield Contract_Type_entity_1.Contract_type.findOne({
                        where: {
                            id: contract.contract_type,
                        },
                    });
                    if (!existingClient || !existingContractType) {
                        if (contract.index)
                            contractNotCLCA.push(contract.index);
                    }
                    else {
                        //Create new contract
                        yield Contract_entity_1.Contract.create(Object.assign(Object.assign({}, contract), { subject: contract.subject })).save();
                        //create new note for client
                        yield Notification_entity_1.Notification.create({
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
        const existingContract = yield Contract_entity_1.Contract.findOne({
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
            const existingContractType = yield Contract_Type_entity_1.Contract_type.findOne({
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
            const existingClient = yield Client_entity_1.Client.findOne({
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
                const existingCompanyLogo = yield Company_Logo_entity_1.Company_logo.findOne({
                    where: {
                        id: existingContract.company_logo.id,
                    },
                });
                if (existingCompanyLogo) {
                    yield Company_Logo_entity_1.Company_logo.update(existingCompanyLogo.id, Object.assign({}, company_logo));
                }
            }
            else {
                newCompanyLogo = yield Company_Logo_entity_1.Company_logo.create(Object.assign({}, company_logo)).save();
            }
        }
        //Update contract
        yield Contract_entity_1.Contract.update({
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
        const existingContract = yield Contract_entity_1.Contract.findOne({
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
            const existingContract = yield Contract_entity_1.Contract.findOne({
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
            message: 'Deleted all contracts successfully',
        });
    })),
    countContractSignedEmployee: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { clientId } = req.params;
        //Check existing client
        const existingClient = yield Client_entity_1.Client.findOne({
            where: {
                id: Number(clientId),
            },
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Not Found Client',
            });
        //Get count contrat signed 
        const countContractSigned = yield (0, typeorm_1.getManager)('huprom').query(`SELECT COUNT("public"."contract"."id") FROM "public"."contract" LEFT JOIN "public"."client" ON "public"."contract"."clientId" = "public"."client"."id" WHERE "public"."contract"."signId" IS NOT NULL AND "public"."client"."id" = ${existingClient.id}`);
        return res.status(200).json({
            code: 200,
            success: true,
            countStatusProjects: Number(countContractSigned[0].count) || 0,
            message: 'Get count contract assigned successfully',
        });
    })),
};
exports.default = contractController;
