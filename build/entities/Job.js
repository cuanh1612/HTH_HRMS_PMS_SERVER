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
exports.Job = void 0;
const typeorm_1 = require("typeorm");
const Department_1 = require("./Department");
const Skill_1 = require("./Skill");
const Location_1 = require("./Location");
const Job_Type_1 = require("./Job_Type");
const Employee_1 = require("./Employee");
const Work_Experience_1 = require("./Work_Experience");
let Job = class Job extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Job.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Job.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Job.prototype, "starts_on_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Job.prototype, "ends_on_date", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Skill_1.Skill),
    (0, typeorm_1.JoinTable)({ name: 'job_skill' }),
    __metadata("design:type", Array)
], Job.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Location_1.Location, (location) => location.jobs, {
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Job.prototype, "locations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Department_1.Department, (department) => department.jobs, {
        onDelete: "SET NULL"
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Department_1.Department
    //status column has true = "open" & false = "close"
    )
], Job.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: false }),
    __metadata("design:type", Boolean)
], Job.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Job.prototype, "total_openings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Job_Type_1.Job_Type, (job_type) => job_type.jobs, {
        onDelete: "SET NULL"
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Job_Type_1.Job_Type)
], Job.prototype, "job_type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Work_Experience_1.Work_Experience, (work_experience) => work_experience.jobs, {
        onDelete: "SET NULL"
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Work_Experience_1.Work_Experience)
], Job.prototype, "work_experience", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Employee_1.Employee, (employee) => employee.jobs, {
        onDelete: "SET NULL"
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Employee_1.Employee)
], Job.prototype, "recruiter", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Job.prototype, "starting_salary_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "job_description", void 0);
Job = __decorate([
    (0, typeorm_1.Entity)()
], Job);
exports.Job = Job;
