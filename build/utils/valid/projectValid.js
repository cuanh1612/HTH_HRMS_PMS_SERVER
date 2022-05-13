"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectValid = void 0;
const Project_1 = require("../../entities/Project");
exports.projectValid = {
    createOrUpdate: ({ name, start_date, deadline, employees, currency, }) => {
        let messageError = '';
        //Check exist datas
        if (!name || !start_date || !deadline || !employees) {
            messageError = 'Pleas enter full field 1';
            return messageError;
        }
        //Check valid time
        const StartDateProject = new Date(start_date);
        const EndDateProject = new Date(deadline);
        if (EndDateProject < StartDateProject) {
            messageError = 'Deadline date project must be greater than start date project';
            return messageError;
        }
        //Check enum currency
        if (currency &&
            currency !== Project_1.enumCurrency.EUR &&
            currency !== Project_1.enumCurrency.GBP &&
            currency !== Project_1.enumCurrency.INR &&
            currency !== Project_1.enumCurrency.USD &&
            currency !== Project_1.enumCurrency.VND) {
            messageError = 'Status not valid';
            return messageError;
        }
        return messageError;
    },
};
