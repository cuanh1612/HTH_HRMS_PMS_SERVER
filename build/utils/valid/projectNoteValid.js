"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectNoteValid = void 0;
const Project_Note_1 = require("../../entities/Project_Note");
exports.projectNoteValid = {
    createOrUpdate: ({ project, employees, title, note_type, }) => {
        let messageError = '';
        //Check exist datas
        if (!title || !project) {
            messageError = 'Please enter full field';
            return messageError;
        }
        if (note_type === Project_Note_1.enumNoteType.PRIVATE && !employees) {
            messageError = 'Please enter full field';
            return messageError;
        }
        return messageError;
    },
};
