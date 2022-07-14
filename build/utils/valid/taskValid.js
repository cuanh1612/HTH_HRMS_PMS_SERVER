"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskValid = void 0;
const Task_1 = require("../../entities/Task");
exports.taskValid = {
    createOrUpdate: ({ name, start_date, deadline, employees, priority }) => {
        let messageError = '';
        //Check exist datas
        if (!name || !start_date || !deadline || !Array.isArray(employees)) {
            messageError = 'Please enter full field';
            return messageError;
        }
        //Check valid time
        const StartDatetask = new Date(start_date);
        const EndDatetask = new Date(deadline);
        if (EndDatetask < StartDatetask) {
            messageError = 'Deadline date task must be greater than start date task';
            return messageError;
        }
        //Check enum currency
        if (priority &&
            priority !== Task_1.enumPriority.HIGH &&
            priority !== Task_1.enumPriority.LOW &&
            priority !== Task_1.enumPriority.MEDIUM) {
            messageError = 'Priority not valid';
            return messageError;
        }
        return messageError;
    },
};
