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
exports.Notice_board = exports.enumNoticeTo = void 0;
const typeorm_1 = require("typeorm");
var enumNoticeTo;
(function (enumNoticeTo) {
    enumNoticeTo["CLIENTS"] = "Clients";
    enumNoticeTo["EMPLOYEES"] = "Employees";
})(enumNoticeTo = exports.enumNoticeTo || (exports.enumNoticeTo = {}));
let Notice_board = class Notice_board extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Notice_board.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumNoticeTo, default: enumNoticeTo.CLIENTS }),
    __metadata("design:type", String)
], Notice_board.prototype, "notice_to", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notice_board.prototype, "heading", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notice_board.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Notice_board.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Notice_board.prototype, "updatedAt", void 0);
Notice_board = __decorate([
    (0, typeorm_1.Entity)()
], Notice_board);
exports.Notice_board = Notice_board;
