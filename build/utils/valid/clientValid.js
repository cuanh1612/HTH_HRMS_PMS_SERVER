"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientValid = void 0;
exports.clientValid = {
    createOrUpdate: ({ name, email, password }, type) => {
        let messageError = '';
        if (!name || !email) {
            messageError = 'Please enter full field';
            return messageError;
        }
        if (type === 'create') {
            if (!password) {
                messageError = 'Pleas enter password';
                return messageError;
            }
        }
        const validEmail = validateEmail(email);
        if (!validEmail) {
            messageError = 'Email not valid';
            return messageError;
        }
        return messageError;
    },
};
//Check valid email function
function validateEmail(email) {
    const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
}
