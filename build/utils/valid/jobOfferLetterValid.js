"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobOfferLetterValid = void 0;
exports.jobOfferLetterValid = {
    createOrUpdate: ({ job, job_application, salary, expected_joining_date, exprise_on, rate }) => {
        let messageError = '';
        //check exist data
        if (!job || !job_application || !salary || !expected_joining_date || !exprise_on || !rate) {
            messageError = 'Please enter full field 1';
            return messageError;
        }
        return messageError;
    },
};
