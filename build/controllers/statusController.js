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
const Project_1 = require("../entities/Project");
const Status_1 = require("../entities/Status");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const statusValid_1 = require("../utils/valid/statusValid");
const statusController = {
    //create new status
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { project, title, color } = req.body;
        if (!project || !title || !color) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter full field',
            });
        }
        const laststatus = yield Status_1.Status.findOne({
            where: {
                project: {
                    id: project,
                },
            },
            order: {
                index: 'DESC',
            },
        });
        if (!laststatus)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Status does not exist in the system',
            });
        const existingproject = yield Project_1.Project.findOne({
            where: {
                id: project,
            },
        });
        if (!existingproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        const status_result = yield Status_1.Status.create({
            project: existingproject,
            title: title,
            color: color,
            index: laststatus.index + 1,
        }).save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create status success',
            result: status_result,
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingStatus = yield Status_1.Status.findOne({
            where: {
                id: Number(id)
            }
        });
        if (!existingStatus)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Status does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            status: existingStatus,
            message: 'Get detail of project success',
        });
    })),
    //get all status by project
    getAll: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projectId } = req.params;
        const findbyproject = yield Status_1.Status.find({
            where: {
                project: {
                    id: Number(projectId),
                },
            },
        });
        if (!findbyproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            statuses: findbyproject,
            message: 'Get all status success',
        });
    })),
    //get all status by project (with task)
    getAllWithTask: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projectId } = req.params;
        const findbyproject = yield Status_1.Status.find({
            where: {
                project: {
                    id: Number(projectId),
                },
            },
            relations: {
                tasks: {
                    employees: true
                },
            },
            order: {
                index: 'ASC',
                tasks: {
                    index: 'ASC',
                },
            },
        });
        if (!findbyproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            statuses: findbyproject,
            message: 'Get all status success',
        });
    })),
    //Update status
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateStatus = req.body;
        const existingstatus = yield Status_1.Status.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingstatus)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'status does not existing in the system',
            });
        const messageValid = statusValid_1.statusValid.createOrUpdate(existingstatus, 'update');
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        (existingstatus.title = dataUpdateStatus.title),
            (existingstatus.color = dataUpdateStatus.color);
        yield existingstatus.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update Status success',
        });
    })),
    //Delete status
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingstatus = yield Status_1.Status.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingstatus)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'status does not existing in the system',
            });
        const messageValid = statusValid_1.statusValid.createOrUpdate(existingstatus, 'update');
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        existingstatus.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete status success',
        });
    })),
    //Change position of status
    changeposition: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id1, id2, projectId } = req.body;
        const status1 = yield Status_1.Status.createQueryBuilder('status')
            .where('status.id = :id1', { id1 })
            .getOne();
        const status2 = yield Status_1.Status.createQueryBuilder('status')
            .where('status.id = :id2', { id2 })
            .getOne();
        if (!status1 || !status2)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Either status does not exist in the system',
            });
        if (status1.index > status2.index) {
            const allstatus = yield Status_1.Status.createQueryBuilder('status')
                .where('status.index >= :index and status.projectId = :projectId', {
                index: status2.index,
                projectId,
            })
                .getMany();
            if (allstatus)
                yield Promise.all(allstatus.map((status) => __awaiter(void 0, void 0, void 0, function* () {
                    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                        const result = Status_1.Status.update({
                            id: Number(status.id),
                        }, {
                            index: Number(status.index) + 1,
                        });
                        resolve(result);
                    }));
                })));
        }
        if (status1.index < status2.index) {
            const allstatus = yield Status_1.Status.createQueryBuilder('status')
                .where('status.index > :index and status.index <= :index2 and status.projectId = :projectId', {
                index: status1.index,
                index2: status2.index,
                projectId,
            })
                .getMany();
            if (allstatus)
                yield Promise.all(allstatus.map((status) => __awaiter(void 0, void 0, void 0, function* () {
                    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                        status.index = status.index - 1;
                        resolve(yield status.save());
                    }));
                })));
        }
        status1.index = status2.index;
        yield status1.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'change position of status success',
        });
    })),
};
exports.default = statusController;
