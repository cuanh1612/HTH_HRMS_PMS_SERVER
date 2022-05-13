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
const Client_1 = require("../entities/Client");
const Employee_1 = require("../entities/Employee");
const Event_1 = require("../entities/Event");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const eventValid_1 = require("../utils/valid/eventValid");
const eventController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewEvent = req.body;
        const { clientEmails, employeeEmails, repeatEvery, typeRepeat, cycles, isRepeat, starts_on_date, ends_on_date, } = dataNewEvent;
        let eventEmployees = [];
        let eventClients = [];
        //Check valid input create new event
        //Check valid
        const messageValid = eventValid_1.eventValid.createOrUpdate(dataNewEvent);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check exist clients
        for (let index = 0; index < clientEmails.length; index++) {
            const clientEmail = clientEmails[index];
            const existingClient = yield Client_1.Client.findOne({
                where: {
                    email: clientEmail,
                },
            });
            if (!existingClient)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client doest not exist in the system',
                });
            eventClients.push(existingClient);
        }
        //Check exist employee
        for (let index = 0; index < employeeEmails.length; index++) {
            const employeeEmail = employeeEmails[index];
            const existEmployee = yield Employee_1.Employee.findOne({
                where: {
                    email: employeeEmail,
                },
            });
            if (!existEmployee)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Employee doest not exist in the system',
                });
            eventEmployees.push(existEmployee);
        }
        //Repeat event
        if (isRepeat) {
            //Get time start and end event
            const startEventTime = new Date(starts_on_date);
            const endEventTime = new Date(ends_on_date);
            //Create event
            for (let index = 0; index < cycles; index++) {
                if (index != 0) {
                    switch (typeRepeat) {
                        case 'Day':
                            startEventTime.setDate(startEventTime.getDate() + repeatEvery);
                            endEventTime.setDate(endEventTime.getDate() + repeatEvery);
                            break;
                        case 'Week':
                            startEventTime.setDate(startEventTime.getDate() + repeatEvery * 7);
                            endEventTime.setDate(endEventTime.getDate() + repeatEvery * 7);
                            break;
                        case 'Month':
                            startEventTime.setMonth(startEventTime.getDate() + repeatEvery);
                            endEventTime.setMonth(endEventTime.getDate() + repeatEvery);
                            break;
                        case 'Year':
                            startEventTime.setFullYear(startEventTime.getFullYear() + repeatEvery);
                            endEventTime.setFullYear(endEventTime.getFullYear() + repeatEvery);
                            break;
                        default:
                            break;
                    }
                }
                //Create new event
                yield Event_1.Event.create(Object.assign(Object.assign({}, dataNewEvent), { clients: [...eventClients], employees: [...eventEmployees], starts_on_date: startEventTime, ends_on_date: endEventTime })).save();
            }
        }
        else {
            //Create new event
            yield Event_1.Event.create(Object.assign(Object.assign({}, dataNewEvent), { clients: [...eventClients], employees: [...eventEmployees] })).save();
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Created new Events successfully',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const allEvent = yield Event_1.Event.find();
        return res.status(200).json({
            code: 200,
            success: true,
            Events: allEvent,
            message: 'Get all Events successfully',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //get id event
        const { enventId } = req.params;
        const existingEvent = yield Event_1.Event.findOne({
            where: {
                id: Number(enventId),
            },
        });
        if (!existingEvent)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Event doest not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            event: existingEvent,
            message: 'Get deatail Event successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //get id event
        const { enventId } = req.params;
        const existingEvent = yield Event_1.Event.findOne({
            where: {
                id: Number(enventId),
            },
        });
        if (!existingEvent)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Event doest not exist in the system',
            });
        //Delete event
        existingEvent.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Deleted Event successfully',
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //get id event
        const { enventId } = req.params;
        const dataUpdateEvent = req.body;
        const { clientEmails, employeeEmails } = dataUpdateEvent;
        let eventEmployees = [];
        let eventClients = [];
        //Check existing event
        const existingEvent = yield Event_1.Event.findOne({
            where: {
                id: Number(enventId),
            },
        });
        if (!existingEvent)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Event doest not exist in the system',
            });
        //Check valid input update event
        //Check valid
        const messageValid = eventValid_1.eventValid.createOrUpdate(dataUpdateEvent);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check exist clients
        for (let index = 0; index < clientEmails.length; index++) {
            const clientsEmail = clientEmails[index];
            const existingClient = yield Client_1.Client.findOne({
                where: {
                    email: clientsEmail,
                },
            });
            if (!existingClient)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client doest not exist in the system',
                });
            eventClients.push(existingClient);
        }
        //Check exist employee
        for (let index = 0; index < employeeEmails.length; index++) {
            const employeeEmail = employeeEmails[index];
            const existEmployee = yield Employee_1.Employee.findOne({
                where: {
                    email: employeeEmail,
                },
            });
            if (!existEmployee)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Employee doest not exist in the system',
                });
            eventEmployees.push(existEmployee);
        }
        //Update event
        existingEvent.clients = eventClients;
        (existingEvent.name = dataUpdateEvent.name),
            (existingEvent.where = dataUpdateEvent.where),
            (existingEvent.color = dataUpdateEvent.color),
            (existingEvent.description = dataUpdateEvent.description),
            (existingEvent.starts_on_date = dataUpdateEvent.starts_on_date),
            (existingEvent.starts_on_time = dataUpdateEvent.starts_on_time),
            (existingEvent.ends_on_date = dataUpdateEvent.ends_on_date),
            (existingEvent.ends_on_time = dataUpdateEvent.ends_on_time),
            (existingEvent.employees = eventEmployees),
            (existingEvent.clients = eventClients),
            yield existingEvent.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Updated Event successfully',
        });
    })),
};
exports.default = eventController;
