"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectDiscussionRoomValid = void 0;
exports.projectDiscussionRoomValid = {
    createOrUpdate: ({ title, description, project_discussion_category, project }) => {
        let messageError = '';
        //Check exist datas
        if (!title || !description || !project_discussion_category || !project) {
            messageError = 'Please enter full field';
            return messageError;
        }
        return messageError;
    },
};
