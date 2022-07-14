"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salaryValid = void 0;
exports.salaryValid = {
    createOrUpdate: ({ amount, type, employee, date }) => {
        let messageError = '';
        if (!employee || !type || !employee || !date) {
            messageError = 'Pleas enter full field';
            return messageError;
        }
        if (amount <= 0) {
            messageError = 'Amount must than 0';
            return messageError;
        }
        return messageError;
    },
};
