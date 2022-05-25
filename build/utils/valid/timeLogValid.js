"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeLogValid = void 0;
const helper_1 = require("../helper");
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
            messageError = 'Please enter full field';
            return messageError;
        }
        //Check time
        const resultCheckTime = (0, helper_1.compareDateTime)(new Date(starts_on_date).toLocaleDateString(), new Date(ends_on_date).toLocaleDateString(), starts_on_time, ends_on_time);
        if (resultCheckTime) {
            messageError = 'The end time must be greater than the start time of the time log';
            return messageError;
        }
        return messageError;
    },
};
