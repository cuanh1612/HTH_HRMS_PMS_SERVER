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
exports.Status = void 0;
const typeorm_1 = require("typeorm");
const Project_entity_1 = require("./Project.entity");
const Task_entity_1 = require("./Task.entity");
let Status = class Status extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Status.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Status.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Status.prototype, "index", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_entity_1.Project, (project) => project.status, {
        onDelete: 'CASCADE',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Project_entity_1.Project)
], Status.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Status.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Task_entity_1.Task, (task) => task.status, {
        onDelete: 'SET NULL',
        nullable: true
    }),
    __metadata("design:type", Task_entity_1.Task)
], Status.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Status.prototype, "root", void 0);
Status = __decorate([
    (0, typeorm_1.Entity)()
], Status);
exports.Status = Status;
