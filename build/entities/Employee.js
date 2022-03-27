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
const Avatar_1 = require("./Avatar");
const Department_1 = require("./Department");
const Designation_1 = require("./Designation");
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
    (0, typeorm_1.Column)(),
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
    __metadata("design:type", String)
], Employee.prototype, "joining_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", String)
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
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Avatar_1.Avatar)
], Employee.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Designation_1.Designation, (designation) => designation.employees),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Designation_1.Designation)
], Employee.prototype, "designation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Department_1.Department, (department) => department.employees),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Department_1.Department)
], Employee.prototype, "department", void 0);
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
