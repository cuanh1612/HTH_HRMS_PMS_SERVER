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
exports.Employee = exports.enumRole = exports.enumGender = void 0;
const typeorm_1 = require("typeorm");
const Attendance_1 = require("./Attendance");
const Avatar_1 = require("./Avatar");
const Conversation_1 = require("./Conversation");
const Conversation_Reply_1 = require("./Conversation_Reply");
const Department_1 = require("./Department");
const Designation_1 = require("./Designation");
const Discussion_1 = require("./Discussion");
const Event_1 = require("./Event");
const Hourly_rate_project_1 = require("./Hourly_rate_project");
const Job_1 = require("./Job");
const Leave_1 = require("./Leave");
const Notification_1 = require("./Notification");
const Project_1 = require("./Project");
const Project_Discussion_Reply_1 = require("./Project_Discussion_Reply");
const Project_Discussion_Room_1 = require("./Project_Discussion_Room");
const Project_File_1 = require("./Project_File");
const Project_Note_1 = require("./Project_Note");
const Room_1 = require("./Room");
const Salary_1 = require("./Salary");
const StickyNote_1 = require("./StickyNote");
const Task_1 = require("./Task");
const Time_Log_1 = require("./Time_Log");
var enumGender;
(function (enumGender) {
    enumGender["MALE"] = "Male";
    enumGender["FEMAILE"] = "Female";
    enumGender["OTHER"] = "Others";
})(enumGender = exports.enumGender || (exports.enumGender = {}));
var enumRole;
(function (enumRole) {
    enumRole["ADMIN"] = "Admin";
    enumRole["EMPLOYEE"] = "Employee";
    enumRole["MANAGER"] = "Manager";
})(enumRole = exports.enumRole || (exports.enumRole = {}));
let Employee = class Employee extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Employee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employee.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        select: false
    }),
    __metadata("design:type", String)
], Employee.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "mobile", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumGender }),
    __metadata("design:type", String)
], Employee.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Employee.prototype, "joining_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Employee.prototype, "date_of_birth", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Employee.prototype, "can_login", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Employee.prototype, "can_receive_email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Employee.prototype, "hourly_rate", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    __metadata("design:type", Array)
], Employee.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumRole, default: enumRole.EMPLOYEE }),
    __metadata("design:type", String)
], Employee.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Avatar_1.Avatar, {
        cascade: true,
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Avatar_1.Avatar)
], Employee.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Designation_1.Designation, (designation) => designation.employees, {
        onDelete: 'SET NULL',
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Designation_1.Designation)
], Employee.prototype, "designation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Room_1.Room, (room) => room.empl_create),
    __metadata("design:type", Array)
], Employee.prototype, "rooms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Job_1.Job, (job) => job.recruiter),
    __metadata("design:type", Job_1.Job)
], Employee.prototype, "jobs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Project_1.Project, (project) => project.project_Admin),
    __metadata("design:type", Array)
], Employee.prototype, "projects_management", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Project_File_1.Project_file, (project) => project.assignBy),
    __metadata("design:type", Array)
], Employee.prototype, "project_file", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StickyNote_1.Sticky_note, (Sticky_note) => Sticky_note.employee),
    __metadata("design:type", Array)
], Employee.prototype, "stickyNotes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Department_1.Department, (department) => department.employees, {
        onDelete: 'SET NULL',
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Department_1.Department)
], Employee.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Leave_1.Leave, (leave) => leave.employee),
    __metadata("design:type", Array)
], Employee.prototype, "leaves", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Attendance_1.Attendance, (attendance) => attendance.employee, {
        eager: true
    }),
    __metadata("design:type", Array)
], Employee.prototype, "attendances", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Task_1.Task, (task) => task.assignBy),
    __metadata("design:type", Array)
], Employee.prototype, "tasksAssignBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Conversation_Reply_1.Conversation_reply, (conversation_reply) => conversation_reply.user),
    __metadata("design:type", Array)
], Employee.prototype, "conversation_replies", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Conversation_1.Conversation),
    (0, typeorm_1.JoinTable)({ name: 'conversation_employee' }),
    __metadata("design:type", Array)
], Employee.prototype, "conversations", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Project_Note_1.Project_note),
    (0, typeorm_1.JoinTable)({ name: 'project_note_employee' }),
    __metadata("design:type", Array)
], Employee.prototype, "project_notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Project_Discussion_Reply_1.Project_discussion_reply, (project_discussion_reply) => project_discussion_reply.employee),
    __metadata("design:type", Array)
], Employee.prototype, "project_discussion_replies", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Event_1.Event),
    (0, typeorm_1.JoinTable)({ name: 'event_employee' }),
    __metadata("design:type", Array)
], Employee.prototype, "events", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Project_1.Project),
    (0, typeorm_1.JoinTable)({ name: 'project_employee' }),
    __metadata("design:type", Array)
], Employee.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Discussion_1.Discussion, (discussion) => discussion.employee),
    __metadata("design:type", Array)
], Employee.prototype, "discussions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Project_1.Project, (Project) => Project.Added_by),
    __metadata("design:type", Array)
], Employee.prototype, "Projects", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Task_1.Task),
    (0, typeorm_1.JoinTable)({ name: 'task_employee' }),
    __metadata("design:type", Array)
], Employee.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Salary_1.Salary, (salary) => salary.employee),
    __metadata("design:type", Array)
], Employee.prototype, "salaries", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Project_Discussion_Room_1.Project_Discussion_Room, (project_discussion_room) => project_discussion_room.assigner),
    __metadata("design:type", Array)
], Employee.prototype, "project_discussion_rooms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Hourly_rate_project_1.Hourly_rate_project, hourly_rate_project => hourly_rate_project.employee),
    __metadata("design:type", Array)
], Employee.prototype, "hourly_rate_projects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Time_Log_1.Time_log, (time_log) => time_log.employee, {
        nullable: true,
    }),
    __metadata("design:type", Array)
], Employee.prototype, "time_logs", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Room_1.Room),
    (0, typeorm_1.JoinTable)({ name: 'room_employee' }),
    __metadata("design:type", Array)
], Employee.prototype, "meeting_rooms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Notification_1.Notification, (Notification) => Notification.employee),
    __metadata("design:type", Array)
], Employee.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Employee.prototype, "token_version", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Employee.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Employee.prototype, "updatedAt", void 0);
Employee = __decorate([
    (0, typeorm_1.Entity)()
], Employee);
exports.Employee = Employee;
