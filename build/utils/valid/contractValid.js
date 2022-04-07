"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractValid = void 0;
const Contract_1 = require("../../entities/Contract");
exports.contractValid = {
    createOrUpdate: ({ subject, start_date, contract_value, currency, client, }) => {
        let messageError = '';
        if (!subject || !start_date || !contract_value || !currency || !client) {
            messageError = 'Please enter full field';
            return messageError;
        }
        if (currency !==
            (Contract_1.enumCurrency.EUR &&
                Contract_1.enumCurrency.GBP &&
                Contract_1.enumCurrency.INR &&
                Contract_1.enumCurrency.USD &&
                Contract_1.enumCurrency.VND)) {
            messageError = 'Currentcy not valid';
            return messageError;
        }
        return messageError;
    },
};
