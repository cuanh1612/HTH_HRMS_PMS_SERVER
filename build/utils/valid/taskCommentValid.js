"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskCommentValid = void 0;
exports.taskCommentValid = {
    createOrUpdate: ({ project, content }) => {
        let messageError = '';
        if (!project || !content) {
            messageError = 'Pleas enter full field';
            return messageError;
        }
        return messageError;
    },
};
