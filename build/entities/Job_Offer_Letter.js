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
exports.Job_offer_letter = exports.enumRate = exports.enumStatus = void 0;
const typeorm_1 = require("typeorm");
const Job_1 = require("./Job");
const Job_Application_1 = require("./Job_Application");
var enumStatus;
(function (enumStatus) {
    enumStatus["PENDING"] = "Pending";
    enumStatus["DRAFT"] = "Draft";
    enumStatus["WITHDRAW"] = "Withdraw";
})(enumStatus = exports.enumStatus || (exports.enumStatus = {}));
var enumRate;
(function (enumRate) {
    enumRate["PER_HOUR"] = "Per Hour";
    enumRate["PER_DAY"] = "Per Day";
    enumRate["PER_WEEK"] = "Per Week";
    enumRate["PER_MONTH"] = "Per Month";
    enumRate["PER_YEAR"] = "Per Year";
})(enumRate = exports.enumRate || (exports.enumRate = {}));
let Job_offer_letter = class Job_offer_letter extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Job_offer_letter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Job_1.Job, (job) => job.job_offer_letters, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Job_1.Job)
], Job_offer_letter.prototype, "job", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Job_Application_1.Job_Application, (job_application) => job_application.job_offer_letters, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Job_Application_1.Job_Application)
], Job_offer_letter.prototype, "job_application", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Job_offer_letter.prototype, "exprise_on", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Job_offer_letter.prototype, "expected_joining_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Job_offer_letter.prototype, "salary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumStatus, default: enumStatus.PENDING }),
    __metadata("design:type", String)
], Job_offer_letter.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumRate, default: enumRate.PER_HOUR }),
    __metadata("design:type", String)
], Job_offer_letter.prototype, "rate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Job_offer_letter.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Job_offer_letter.prototype, "updatedAt", void 0);
Job_offer_letter = __decorate([
    (0, typeorm_1.Entity)()
], Job_offer_letter);
exports.Job_offer_letter = Job_offer_letter;
