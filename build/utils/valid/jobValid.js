"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobValid = void 0;
exports.jobValid = {
    createOrUpdate: ({ title, skills, locations, starts_on_date, ends_on_date, department, recruiter, job_type, work_experience, total_openings, }) => {
        let messageError = '';
        //check exist data
        if (!title ||
            !Array.isArray(skills) ||
            !Array.isArray(locations) ||
            !starts_on_date ||
            !ends_on_date ||
            !department ||
            !recruiter ||
            !job_type ||
            !work_experience ||
            !total_openings) {
            messageError = 'Please enter full field';
        }
        //Check valid time
        const StartDatejob = new Date(starts_on_date);
        const EndDatejob = new Date(ends_on_date);
        if (EndDatejob < StartDatejob) {
            messageError = 'End date job must be greater than start date project';
        }
        return messageError;
    },
};
