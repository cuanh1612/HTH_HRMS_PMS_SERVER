"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeLogValid = void 0;
exports.timeLogValid = {
    createOrUpdate: ({ project, task, employee, starts_on_date, starts_on_time, ends_on_date, ends_on_time, }) => {
        let messageError = '';
        if (!employee ||
            !project ||
            !task ||
            !starts_on_date ||
            !starts_on_time ||
            !ends_on_date ||
            !ends_on_time) {
            messageError = 'Pleas enter full field';
            return messageError;
        }
        //Check time
        if (new Date(starts_on_date) <= new Date(ends_on_date)) {
            messageError = 'time log end date time must be greater than start date';
            return messageError;
        }
        return messageError;
    },
};
