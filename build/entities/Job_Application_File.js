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
exports.Job_application_file = void 0;
const typeorm_1 = require("typeorm");
const Job_Application_1 = require("./Job_Application");
let Job_application_file = class Job_application_file extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Job_application_file.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Job_application_file.prototype, "public_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Job_application_file.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Job_application_file.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Job_Application_1.Job_Application, (Job_Application) => Job_Application.job_application_files, {
        onDelete: 'CASCADE',
        eager: true,
        nullable: false
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Job_Application_1.Job_Application)
], Job_application_file.prototype, "job_application", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Job_application_file.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Job_application_file.prototype, "updatedAt", void 0);
Job_application_file = __decorate([
    (0, typeorm_1.Entity)()
], Job_application_file);
exports.Job_application_file = Job_application_file;
