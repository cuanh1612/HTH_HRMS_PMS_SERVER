"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discussionValid = void 0;
exports.discussionValid = {
    createOrUpdate: ({ employee, client, contract, content }) => {
        let messageError = '';
        if (!(employee || client) || !contract || !content) {
            messageError = 'Pleas enter full field';
            return messageError;
        }
        return messageError;
    },
};
