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
exports.Location = void 0;
const typeorm_1 = require("typeorm");
const Job_entity_1 = require("./Job.entity");
const Job_Application_entity_1 = require("./Job_Application.entity");
let Location = class Location extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Location.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Location.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Job_entity_1.Job, (job) => job.locations, {
        onDelete: 'SET NULL'
    }),
    __metadata("design:type", Job_entity_1.Job)
], Location.prototype, "jobs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Job_Application_entity_1.Job_Application, (job_application) => job_application.location, {
        onDelete: 'SET NULL'
    }),
    __metadata("design:type", Job_Application_entity_1.Job_Application)
], Location.prototype, "job_application", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Location.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Location.prototype, "updatedAt", void 0);
Location = __decorate([
    (0, typeorm_1.Entity)()
], Location);
exports.Location = Location;
