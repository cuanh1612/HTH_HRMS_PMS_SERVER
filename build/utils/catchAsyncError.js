"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Handle catch async error
const handleCatchError = (func) => {
    return (req, res, next) => {
        const asynFunc = new Promise((resolve) => {
            resolve(func(req, res, next));
        });
        asynFunc.catch((error) => {
            console.log(error);
            let statusCode = 500;
            let message = 'Something went wrong';
            //Define error
            //Handle castError
            if (error.code === '22P02') {
                message = `Resource not found.`;
                statusCode = 400;
            }
            // //Handling Mongoose validation Error
            // if (nameError === 'ValidationError') {
            //   const messageError = Object.values(error.errors).map((value) => value.message)[0];
            //   message = messageError;
            //   statusCode = 400;
            // }
            //Hand duplicate key errors
            if (error.code === '23505') {
                const fieldDuplicate = error.detail.split(`"`)[1];
                statusCode = 400;
                message = fieldDuplicate ? `${fieldDuplicate} already exist` : error.detail;
            }
            //Hand delete but have reference to other table
            if (error.code === '23503') {
                statusCode = 400;
                message = `Please delete all ${error.table} before action delete function`;
            }
            //Hand delete but have reference to other table
            if (error.code === '23502') {
                statusCode = 400;
                message = `Please enter full field`;
            }
            //Handling wrong JWT error
            if (error.name === 'JsonWebTokenError') {
                const messageError = `JSON Web Token is invalid. Try Again!!!`;
                statusCode = 400;
                message = messageError;
            }
            //Handling Expored JWT error
            if (error.name === 'TokenExpiredError') {
                const messageError = `JSON Web Token is invalid. Try Again!!!`;
                statusCode = 400;
                message = messageError;
            }
            //Res error
            return res.status(statusCode).json({
                code: statusCode,
                success: false,
                message,
            });
        });
    };
};
exports.default = handleCatchError;
