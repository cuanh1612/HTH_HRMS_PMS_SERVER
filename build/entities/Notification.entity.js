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
exports.Notification = void 0;
const typeorm_1 = require("typeorm");
const Client_entity_1 = require("./Client.entity");
const Employee_entity_1 = require("./Employee.entity");
let Notification = class Notification extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_entity_1.Employee, (Employee) => Employee.notifications, {
        onDelete: 'CASCADE',
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Employee_entity_1.Employee)
], Notification.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Client_entity_1.Client, (Client) => Client.notifications, {
        onDelete: 'CASCADE',
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Client_entity_1.Client)
], Notification.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Notification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Notification.prototype, "updatedAt", void 0);
Notification = __decorate([
    (0, typeorm_1.Entity)()
], Notification);
exports.Notification = Notification;
