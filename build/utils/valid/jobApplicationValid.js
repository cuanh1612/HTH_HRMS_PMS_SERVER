"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobApplicationValid = void 0;
exports.jobApplicationValid = {
    createOrUpdate: ({ name, jobs, email, mobile, location, picture }) => {
        let messageError = '';
        //check exist data
        if (!name || !jobs || !email || !mobile || !location || !picture) {
            messageError = 'Please enter full field';
        }
        return messageError;
    }
};
