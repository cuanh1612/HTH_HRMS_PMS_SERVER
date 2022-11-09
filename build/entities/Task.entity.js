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
var Task_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.enumPriority = void 0;
const typeorm_1 = require("typeorm");
const Employee_entity_1 = require("./Employee.entity");
const Milestone_entity_1 = require("./Milestone.entity");
const Project_entity_1 = require("./Project.entity");
const Status_entity_1 = require("./Status.entity");
const Task_Category_entity_1 = require("./Task_Category.entity");
const Task_Comment_entity_1 = require("./Task_Comment.entity");
const Task_File_entity_1 = require("./Task_File.entity");
const Time_Log_entity_1 = require("./Time_Log.entity");
var enumPriority;
(function (enumPriority) {
    enumPriority["LOW"] = "Low";
    enumPriority["MEDIUM"] = "Medium";
    enumPriority["HIGH"] = "High";
})(enumPriority = exports.enumPriority || (exports.enumPriority = {}));
let Task = Task_1 = class Task extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Task.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Task.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Task.prototype, "deadline", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Task.prototype, "index", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Task_Category_entity_1.Task_Category, (task_Category) => task_Category.tasks, {
        onDelete: 'SET NULL',
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Task_Category_entity_1.Task_Category)
], Task.prototype, "task_category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_entity_1.Project, (project) => project.tasks, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Project_entity_1.Project)
], Task.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Employee_entity_1.Employee, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinTable)({ name: 'task_employee' }),
    __metadata("design:type", Array)
], Task.prototype, "employees", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumPriority, default: enumPriority.LOW }),
    __metadata("design:type", String)
], Task.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Task_1, (task) => task.tasks, {
        onDelete: "SET NULL"
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Task)
], Task.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Task_1, (task) => task.task),
    __metadata("design:type", Array)
], Task.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Task_Comment_entity_1.Task_comment, (task_comment) => task_comment.task),
    __metadata("design:type", Array)
], Task.prototype, "task_comments", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Milestone_entity_1.Milestone, (milestone) => milestone.tasks, {
        onDelete: 'SET NULL',
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Milestone_entity_1.Milestone)
], Task.prototype, "milestone", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Task_File_entity_1.Task_file, (task_file) => task_file.task, {
        onDelete: 'SET NULL',
        nullable: true
    }),
    __metadata("design:type", Array)
], Task.prototype, "task_files", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_entity_1.Employee, (employee) => employee.tasksAssignBy, {
        onDelete: 'CASCADE',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Employee_entity_1.Employee)
], Task.prototype, "assignBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Status_entity_1.Status, (status) => status.tasks, {
        onDelete: 'CASCADE',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Status_entity_1.Status)
], Task.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Time_Log_entity_1.Time_log, (time_log) => time_log.task, {
        nullable: true,
    }),
    __metadata("design:type", Array)
], Task.prototype, "time_logs", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Task.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Task.prototype, "updatedAt", void 0);
Task = Task_1 = __decorate([
    (0, typeorm_1.Entity)()
], Task);
exports.Task = Task;
