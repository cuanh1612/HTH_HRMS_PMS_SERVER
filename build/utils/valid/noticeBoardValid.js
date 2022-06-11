"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noticeBoardValid = void 0;
exports.noticeBoardValid = {
    createOrUpdate: ({ notice_to, heading, details }) => {
        let messageError = '';
        if (!notice_to || !heading || !details) {
            messageError = 'Pleas enter full field';
            return messageError;
        }
        return messageError;
    },
};
