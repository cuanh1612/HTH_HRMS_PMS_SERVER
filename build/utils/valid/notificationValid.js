"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationValid = void 0;
exports.notificationValid = {
    createOrUpdate: ({ content, url }) => {
        let messageError = '';
        if (!content || !url) {
            messageError = 'Pleas enter full field';
            return messageError;
        }
        return messageError;
    },
};
