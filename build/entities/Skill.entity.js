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
exports.Skill = void 0;
const typeorm_1 = require("typeorm");
const Job_entity_1 = require("./Job.entity");
const Job_Application_entity_1 = require("./Job_Application.entity");
let Skill = class Skill extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Skill.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Skill.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Job_entity_1.Job),
    (0, typeorm_1.JoinTable)({ name: 'job_skill' }),
    __metadata("design:type", Array)
], Skill.prototype, "jobs", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Job_Application_entity_1.Job_Application, { onDelete: 'CASCADE', nullable: true }),
    (0, typeorm_1.JoinTable)({ name: 'job_application_skill' }),
    __metadata("design:type", Array)
], Skill.prototype, "job_applications", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Skill.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Skill.prototype, "updatedAt", void 0);
Skill = __decorate([
    (0, typeorm_1.Entity)()
], Skill);
exports.Skill = Skill;
