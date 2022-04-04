"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientSubCategoryValid = void 0;
exports.clientSubCategoryValid = {
    createOrUpdate: ({ name, client_category }) => {
        let messageError = '';
        if (!name || !client_category) {
            messageError = 'Please enter full field';
            return messageError;
        }
        return messageError;
    },
};
