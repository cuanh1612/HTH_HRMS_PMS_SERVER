"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskValid = void 0;
const Task_1 = require("../../entities/Task");
const Task_2 = require("../../entities/Task");
exports.taskValid = {
    createOrUpdate: ({ name, start_date, deadline, employees, status, priority }) => {
        let messageError = '';
        //Check exist datas
        if (!name || !start_date || !deadline || !employees) {
            messageError = 'Pleas enter full field';
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
        if (status &&
            status !== Task_1.enumStatus.COMPLETED &&
            status !== Task_1.enumStatus.DOING &&
            status !== Task_1.enumStatus.INCOMPLETE &&
            status !== Task_1.enumStatus.TO_DO) {
            messageError = 'Status not valid';
            return messageError;
        }
        //Check enum currency
        if (priority &&
            priority !== Task_2.enumPriority.HIGH &&
            priority !== Task_2.enumPriority.LOW &&
            priority !== Task_2.enumPriority.MEDIUM) {
            messageError = 'Priority not valid';
            return messageError;
        }
        return messageError;
    },
};
