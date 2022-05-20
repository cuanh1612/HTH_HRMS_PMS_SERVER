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
exports.Salary = exports.enumTypeSalary = void 0;
const typeorm_1 = require("typeorm");
const Employee_1 = require("./Employee");
var enumTypeSalary;
(function (enumTypeSalary) {
    enumTypeSalary["INCREMENT"] = "Increment";
    enumTypeSalary["DECREMENT"] = "Decrement";
})(enumTypeSalary = exports.enumTypeSalary || (exports.enumTypeSalary = {}));
let Salary = class Salary extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Salary.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Salary.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Salary.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_1.Employee, (Employee) => Employee.salaries, {
        onDelete: 'CASCADE',
        eager: true
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Employee_1.Employee)
], Salary.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumTypeSalary, default: enumTypeSalary.INCREMENT }),
    __metadata("design:type", String)
], Salary.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Salary.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Salary.prototype, "updatedAt", void 0);
Salary = __decorate([
    (0, typeorm_1.Entity)()
], Salary);
exports.Salary = Salary;
