"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interview = void 0;
const typeorm_1 = require("typeorm");
const Employee_1 = require("./Employee");
const Job_Application_1 = require("./Job_Application");
var enumType;
(function (enumType) {
    enumType["INPERSON"] = "In Person";
    enumType["VIDEO"] = "Video";
    enumType["PHONE"] = "Phone";
})(enumType || (enumType = {}));
var enumStatus;
(function (enumStatus) {
    enumStatus["PENDING"] = "Pending";
    enumStatus["HIRED"] = "Hired";
    enumStatus["COMPLETED"] = "Completed";
    enumStatus["CANCELED"] = "Canceled";
    enumStatus["REJECTED"] = "Rejected";
})(enumStatus || (enumStatus = {}));
let Interview = class Interview extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Interview.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Interview.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Job_Application_1.Job_Application, (jobApplication) => jobApplication.interviews, {
        cascade: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Job_Application_1.Job_Application)
], Interview.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_1.Employee, (employee) => employee.interviews, {
        cascade: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Employee_1.Employee)
], Interview.prototype, "interviewer", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Interview.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)('time'),
    __metadata("design:type", String)
], Interview.prototype, "start_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumType, default: enumType.INPERSON }),
    __metadata("design:type", String)
], Interview.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumStatus, default: enumStatus.PENDING }),
    __metadata("design:type", String)
], Interview.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Interview.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Interview.prototype, "updatedAt", void 0);
Interview = __decorate([
    (0, typeorm_1.Entity)()
], Interview);
exports.Interview = Interview;
