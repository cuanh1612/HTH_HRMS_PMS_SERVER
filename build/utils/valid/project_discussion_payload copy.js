"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectDiscussionReplyValid = void 0;
exports.projectDiscussionReplyValid = {
    createOrUpdate: ({ project_discussion_room, employee, project, reply }) => {
        let messageError = '';
        //Check exist datas
        if (!reply || !project_discussion_room || !employee || !project) {
            messageError = 'Please enter full field';
            return messageError;
        }
        return messageError;
    },
};
