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
exports.Project = exports.enumStatus = exports.enumCurrency = void 0;
const typeorm_1 = require("typeorm");
const Client_1 = require("./Client");
const Department_1 = require("./Department");
const Employee_1 = require("./Employee");
const Project_Category_1 = require("./Project_Category");
const Project_File_1 = require("./Project_File");
const Task_1 = require("./Task");
var enumCurrency;
(function (enumCurrency) {
    enumCurrency["USD"] = "USD";
    enumCurrency["GBP"] = "GBP";
    enumCurrency["EUR"] = "EUR";
    enumCurrency["INR"] = "INR";
    enumCurrency["VND"] = "VND";
})(enumCurrency = exports.enumCurrency || (exports.enumCurrency = {}));
var enumStatus;
(function (enumStatus) {
    enumStatus["NOT_STARTED"] = "Not Started";
    enumStatus["IN_PROGRESS"] = "In Progress";
    enumStatus["ON_HOLD"] = "On Hold";
    enumStatus["CANCELED"] = "Canceled";
    enumStatus["FINISHED"] = "Finished";
})(enumStatus = exports.enumStatus || (exports.enumStatus = {}));
let Project = class Project extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Project.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Project.prototype, "deadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "project_summary", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "project_budget", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "hours_estimate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Project.prototype, "send_task_noti", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_Category_1.Project_Category, (project_Category) => project_Category.projects, {
        onDelete: 'SET NULL',
        nullable: true,
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Project_Category_1.Project_Category)
], Project.prototype, "project_category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Department_1.Department, (department) => department.projects, {
        onDelete: 'SET NULL',
        nullable: true,
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Department_1.Department)
], Project.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Client_1.Client, (client) => client.projects, {
        onDelete: 'SET NULL',
        nullable: true,
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Client_1.Client)
], Project.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Employee_1.Employee, { onDelete: 'CASCADE', eager: true }),
    (0, typeorm_1.JoinTable)({ name: 'project_employee' }),
    __metadata("design:type", Array)
], Project.prototype, "employees", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumStatus, default: enumStatus.NOT_STARTED }),
    __metadata("design:type", String)
], Project.prototype, "project_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumCurrency, default: enumCurrency.USD }),
    __metadata("design:type", String)
], Project.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Project.prototype, "Progress", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_1.Employee, (Employee) => Employee.projects, {
        onDelete: 'SET NULL',
        eager: true
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Employee_1.Employee)
], Project.prototype, "Added_by", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Project_File_1.Project_file, (project_file) => project_file.project, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Project.prototype, "project_files", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Task_1.Task, (task) => task.project, {
        onDelete: "SET NULL"
    }),
    __metadata("design:type", Array)
], Project.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
Project = __decorate([
    (0, typeorm_1.Entity)()
], Project);
exports.Project = Project;
