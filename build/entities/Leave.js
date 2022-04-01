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
exports.Leave = exports.enumDuration = exports.enumStatus = void 0;
const typeorm_1 = require("typeorm");
const Employee_1 = require("./Employee");
const LeaveType_1 = require("./LeaveType");
var enumStatus;
(function (enumStatus) {
    enumStatus["APPROVED"] = "Approved";
    enumStatus["PENDING"] = "Pending";
    enumStatus["REJECTED"] = "Rejected";
})(enumStatus = exports.enumStatus || (exports.enumStatus = {}));
var enumDuration;
(function (enumDuration) {
    enumDuration["SINGLE"] = "Single";
    enumDuration["HALF_DAY"] = "Half Day";
})(enumDuration = exports.enumDuration || (exports.enumDuration = {}));
let Leave = class Leave extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Leave.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_1.Employee, (employee) => employee.leaves, {
        onDelete: 'CASCADE',
        nullable: false,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Employee_1.Employee)
], Leave.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumStatus, default: enumStatus.PENDING }),
    __metadata("design:type", String)
], Leave.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumDuration, default: enumDuration.SINGLE }),
    __metadata("design:type", String)
], Leave.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Leave.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => LeaveType_1.LeaveType, (leaveType) => leaveType.leaves, { nullable: false }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", LeaveType_1.LeaveType)
], Leave.prototype, "leave_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Leave.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Leave.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Leave.prototype, "updatedAt", void 0);
Leave = __decorate([
    (0, typeorm_1.Entity)()
], Leave);
exports.Leave = Leave;
