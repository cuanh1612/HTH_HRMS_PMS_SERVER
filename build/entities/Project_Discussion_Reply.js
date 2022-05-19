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
exports.Project_discussion_reply = void 0;
const typeorm_1 = require("typeorm");
const Employee_1 = require("./Employee");
const Project_Discussion_Room_1 = require("./Project_Discussion_Room");
let Project_discussion_reply = class Project_discussion_reply extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Project_discussion_reply.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_1.Employee, (employee) => employee.project_discussion_replies, {
        onDelete: 'CASCADE',
        eager: true,
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Employee_1.Employee)
], Project_discussion_reply.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_Discussion_Room_1.Project_Discussion_Room, (project_discussion_room) => project_discussion_room.project_discussion_replies, {
        onDelete: 'CASCADE',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Project_Discussion_Room_1.Project_Discussion_Room)
], Project_discussion_reply.prototype, "project_discussion_room", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project_discussion_reply.prototype, "reply", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Project_discussion_reply.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Project_discussion_reply.prototype, "updatedAt", void 0);
Project_discussion_reply = __decorate([
    (0, typeorm_1.Entity)()
], Project_discussion_reply);
exports.Project_discussion_reply = Project_discussion_reply;
