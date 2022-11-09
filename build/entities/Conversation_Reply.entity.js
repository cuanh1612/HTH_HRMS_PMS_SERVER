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
exports.Conversation_reply = void 0;
const typeorm_1 = require("typeorm");
const Conversation_entity_1 = require("./Conversation.entity");
const Employee_entity_1 = require("./Employee.entity");
let Conversation_reply = class Conversation_reply extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Conversation_reply.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_entity_1.Employee, (employee) => employee.conversation_replies, {
        onDelete: 'CASCADE',
        eager: true,
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Employee_entity_1.Employee)
], Conversation_reply.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Conversation_entity_1.Conversation, (conversation) => conversation.conversation_replies, {
        onDelete: 'CASCADE',
        eager: true,
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Conversation_entity_1.Conversation)
], Conversation_reply.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Conversation_reply.prototype, "reply", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: false }),
    __metadata("design:type", Boolean)
], Conversation_reply.prototype, "read", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Conversation_reply.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Conversation_reply.prototype, "updatedAt", void 0);
Conversation_reply = __decorate([
    (0, typeorm_1.Entity)()
], Conversation_reply);
exports.Conversation_reply = Conversation_reply;
