"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeValid = void 0;
exports.employeeValid = {
    create: ({ employeeId, name, email, password, joining_date, can_login, can_receive_email, hourly_rate, }) => {
        let messageError = '';
        if (!employeeId ||
            !name ||
            !email ||
            !password ||
            !joining_date ||
            !can_login ||
            !can_receive_email ||
            !hourly_rate) {
            messageError = 'Pleas enter full field';
        }
        const validEmail = validateEmail(email);
        if (!validEmail) {
            messageError = 'Email not valid';
        }
        return messageError;
    },
};
const validateEmail = (email) => {
    return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};
