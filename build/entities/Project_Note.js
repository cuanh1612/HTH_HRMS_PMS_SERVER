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
exports.Project_note = exports.enumNoteType = void 0;
const typeorm_1 = require("typeorm");
const Employee_1 = require("./Employee");
const Project_1 = require("./Project");
var enumNoteType;
(function (enumNoteType) {
    enumNoteType["PUBLIC"] = "Public";
    enumNoteType["PRIVATE"] = "Private";
})(enumNoteType = exports.enumNoteType || (exports.enumNoteType = {}));
let Project_note = class Project_note extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Project_note.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project_note.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumNoteType, default: enumNoteType.PUBLIC }),
    __metadata("design:type", String)
], Project_note.prototype, "note_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], Project_note.prototype, "visible_to_client", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], Project_note.prototype, "ask_re_password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Project_note.prototype, "detail", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Project_note.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Employee_1.Employee, { eager: true, onDelete: 'CASCADE', nullable: true }),
    (0, typeorm_1.JoinTable)({ name: 'project_note_employee' }),
    __metadata("design:type", Array)
], Project_note.prototype, "employees", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, (project) => project.project_notes, {
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Project_1.Project)
], Project_note.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Project_note.prototype, "updatedAt", void 0);
Project_note = __decorate([
    (0, typeorm_1.Entity)()
], Project_note);
exports.Project_note = Project_note;
