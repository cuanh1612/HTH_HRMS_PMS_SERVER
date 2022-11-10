"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.employeeValid = void 0;
const Employee_entity_1 = require("../../entities/Employee.entity");
exports.employeeValid = {
    createOrUpdate: ({ employeeId, name, email, password, joining_date, hourly_rate, role, department, designation, }, type) => {
        let messageError = '';
        if (!employeeId ||
            !name ||
            !email ||
            !joining_date ||
            !hourly_rate ||
            !department ||
            !designation) {
            messageError = 'Please enter full field';
            return messageError;
        }
        if (type === 'create') {
            if (!password) {
                messageError = 'Please enter password';
                return messageError;
            }
        }
        if (role &&
            role !== Employee_entity_1.enumRole.ADMIN &&
            role !== Employee_entity_1.enumRole.EMPLOYEE &&
            role !== Employee_entity_1.enumRole.MANAGER) {
            messageError = 'Role not valid';
            return messageError;
        }
        const validEmail = validateEmail(email);
        if (!validEmail) {
            messageError = 'Email not valid';
            return messageError;
        }
        return messageError;
    },
    changeRole: (employeeId, role) => {
        let messageError = '';
        if (!employeeId || !role) {
            messageError = 'Pleas enter full field';
            return messageError;
        }
        if (role !== Employee_entity_1.enumRole.ADMIN && role !== Employee_entity_1.enumRole.EMPLOYEE && role !== Employee_entity_1.enumRole.MANAGER) {
            messageError = 'Role not valid';
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
//Check valid password
const validatePassword = (password) => {
    const res = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return res.test(String(password).toLowerCase());
};
exports.validatePassword = validatePassword;
