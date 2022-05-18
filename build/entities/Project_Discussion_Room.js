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
exports.Project_Discussion_Room = void 0;
const typeorm_1 = require("typeorm");
const Project_1 = require("./Project");
const Project_Discussion_Category_1 = require("./Project_Discussion_Category");
const Project_Discussion_Reply_1 = require("./Project_Discussion_Reply");
let Project_Discussion_Room = class Project_Discussion_Room extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Project_Discussion_Room.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Project_Discussion_Reply_1.Project_discussion_reply, (project_discussion_reply) => project_discussion_reply.project_discussion_room),
    __metadata("design:type", Array)
], Project_Discussion_Room.prototype, "project_discussion_replies", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_Discussion_Category_1.Project_discussion_category, (project_discussion_category) => project_discussion_category.project_discussion_rooms, {
        onDelete: 'CASCADE',
        eager: true,
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Project_Discussion_Category_1.Project_discussion_category)
], Project_Discussion_Room.prototype, "project_discussion_category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, (project) => project.project_discussion_rooms, {
        onDelete: 'CASCADE',
        nullable: true,
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Project_1.Project)
], Project_Discussion_Room.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project_Discussion_Room.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Project_Discussion_Room.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Project_Discussion_Room.prototype, "updatedAt", void 0);
Project_Discussion_Room = __decorate([
    (0, typeorm_1.Entity)()
], Project_Discussion_Room);
exports.Project_Discussion_Room = Project_Discussion_Room;
