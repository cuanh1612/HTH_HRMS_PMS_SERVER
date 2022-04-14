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
exports.Conversation = void 0;
const typeorm_1 = require("typeorm");
const ConversationReply_1 = require("./ConversationReply");
const Employee_1 = require("./Employee");
let Conversation = class Conversation extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Conversation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Employee_1.Employee, { eager: true }),
    (0, typeorm_1.JoinTable)({ name: 'conversation_employee' }),
    __metadata("design:type", Array)
], Conversation.prototype, "employees", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ConversationReply_1.Conversation_reply, (conversation_reply) => conversation_reply.user),
    __metadata("design:type", Array)
], Conversation.prototype, "conversation_replies", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Conversation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Conversation.prototype, "updatedAt", void 0);
Conversation = __decorate([
    (0, typeorm_1.Entity)()
], Conversation);
exports.Conversation = Conversation;
