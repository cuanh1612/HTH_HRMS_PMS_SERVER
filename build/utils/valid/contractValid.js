"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractValid = void 0;
const Contract_entity_1 = require("../../entities/Contract.entity");
exports.contractValid = {
    createOrUpdate: ({ subject, start_date, contract_value, currency, client, }) => {
        let messageError = '';
        if (!subject || !start_date || !contract_value || !currency || !client) {
            messageError = 'Please enter full field';
            return messageError;
        }
        if (currency !== Contract_entity_1.enumCurrency.EUR &&
            currency !== Contract_entity_1.enumCurrency.GBP &&
            currency !== Contract_entity_1.enumCurrency.INR &&
            currency !== Contract_entity_1.enumCurrency.USD &&
            currency !== Contract_entity_1.enumCurrency.VND) {
            messageError = 'Currentcy not valid';
            return messageError;
        }
        return messageError;
    },
};
