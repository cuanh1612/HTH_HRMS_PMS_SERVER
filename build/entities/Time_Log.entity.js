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
exports.Time_log = void 0;
const typeorm_1 = require("typeorm");
const Employee_entity_1 = require("./Employee.entity");
const Project_entity_1 = require("./Project.entity");
const Task_entity_1 = require("./Task.entity");
let Time_log = class Time_log extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Time_log.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_entity_1.Project, (project) => project.time_logs, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Project_entity_1.Project)
], Time_log.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Task_entity_1.Task, (task) => task.time_logs, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Task_entity_1.Task)
], Time_log.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_entity_1.Employee, (employee) => employee.time_logs, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Employee_entity_1.Employee)
], Time_log.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Time_log.prototype, "starts_on_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Time_log.prototype, "ends_on_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "time" }),
    __metadata("design:type", String)
], Time_log.prototype, "starts_on_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "time" }),
    __metadata("design:type", String)
], Time_log.prototype, "ends_on_time", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Time_log.prototype, "memo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Time_log.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Time_log.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Time_log.prototype, "total_hours", void 0);
__decorate([
    (0, typeorm_1.Column)('float', { default: 0 }),
    __metadata("design:type", Number)
], Time_log.prototype, "earnings", void 0);
Time_log = __decorate([
    (0, typeorm_1.Entity)()
], Time_log);
exports.Time_log = Time_log;
