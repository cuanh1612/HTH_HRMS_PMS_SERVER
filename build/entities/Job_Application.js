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
exports.Job_Application = exports.enumSource = exports.enumStatus = void 0;
const Interview_1 = require("./Interview");
const typeorm_1 = require("typeorm");
const Job_1 = require("./Job");
const Job_Application_Picture_1 = require("./Job_Application_Picture");
const Location_1 = require("./Location");
const Skill_1 = require("./Skill");
const Job_Application_File_1 = require("./Job_Application_File");
const Job_Offer_Letter_1 = require("./Job_Offer_Letter");
var enumStatus;
(function (enumStatus) {
    enumStatus["APPLIED"] = "Applied";
    enumStatus["PHONESCREEN"] = "Phone screen";
    enumStatus["INTERVIEW"] = "Interview";
    enumStatus["HIRED"] = "Hired";
    enumStatus["REJECTED"] = "Rejected";
})(enumStatus = exports.enumStatus || (exports.enumStatus = {}));
var enumSource;
(function (enumSource) {
    enumSource["LINKEDIN"] = "Linkedin";
    enumSource["FACEBOOK"] = "Facebook";
    enumSource["INSTAGRAM"] = "Instagram";
    enumSource["TWITTER"] = "Twitter";
    enumSource["OTHER"] = "Other";
})(enumSource = exports.enumSource || (exports.enumSource = {}));
let Job_Application = class Job_Application extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Job_Application.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Job_Application.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Job_Application.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Job_Application.prototype, "mobile", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Job_Application_Picture_1.Job_application_picture, {
        eager: true,
        cascade: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Job_Application_Picture_1.Job_application_picture)
], Job_Application.prototype, "picture", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Job_Application.prototype, "cover_leter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumStatus, default: enumStatus.APPLIED }),
    __metadata("design:type", String)
], Job_Application.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumSource, nullable: true }),
    __metadata("design:type", String)
], Job_Application.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Job_1.Job, (job) => job.job_application, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Job_1.Job)
], Job_Application.prototype, "jobs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Job_Offer_Letter_1.Job_offer_letter, (Job_offer_letter) => Job_offer_letter.job, {
        onDelete: 'SET NULL'
    }),
    __metadata("design:type", Array)
], Job_Application.prototype, "job_offer_letters", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Location_1.Location, (location) => location.job_application, {
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Location_1.Location)
], Job_Application.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Interview_1.Interview, (interview) => interview.candidate),
    __metadata("design:type", Array)
], Job_Application.prototype, "interviews", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Skill_1.Skill, { eager: true, onDelete: 'CASCADE', nullable: true }),
    (0, typeorm_1.JoinTable)({ name: 'job_application_skill' }),
    __metadata("design:type", Array)
], Job_Application.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Job_Application_File_1.Job_application_file, (Job_application_file) => Job_application_file.job_application, {
        onDelete: 'SET NULL',
        nullable: true
    }),
    __metadata("design:type", Array)
], Job_Application.prototype, "job_application_files", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Job_Application.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Job_Application.prototype, "updatedAt", void 0);
Job_Application = __decorate([
    (0, typeorm_1.Entity)()
], Job_Application);
exports.Job_Application = Job_Application;
