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
exports.Discussion = void 0;
const typeorm_1 = require("typeorm");
const Client_entity_1 = require("./Client.entity");
const Contract_entity_1 = require("./Contract.entity");
const Employee_entity_1 = require("./Employee.entity");
let Discussion = class Discussion extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Discussion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Discussion.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_entity_1.Employee, (employee) => employee.discussions, {
        onDelete: 'SET NULL',
        eager: true,
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Employee_entity_1.Employee)
], Discussion.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Client_entity_1.Client, (client) => client.discussions, {
        onDelete: 'SET NULL',
        eager: true,
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Client_entity_1.Client)
], Discussion.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Contract_entity_1.Contract, (contract) => contract.discussions, {
        onDelete: 'SET NULL',
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Contract_entity_1.Contract)
], Discussion.prototype, "contract", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Discussion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Discussion.prototype, "updatedAt", void 0);
Discussion = __decorate([
    (0, typeorm_1.Entity)()
], Discussion);
exports.Discussion = Discussion;
