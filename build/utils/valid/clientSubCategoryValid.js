"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientSubCategoryValid = void 0;
exports.clientSubCategoryValid = {
    createOrUpdate: ({ name }) => {
        let messageError = '';
        if (!name) {
            messageError = 'Please enter full field';
            return messageError;
        }
        return messageError;
    },
};
