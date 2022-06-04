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
exports.StickyNote = exports.enumColor = void 0;
const typeorm_1 = require("typeorm");
const Employee_1 = require("./Employee");
var enumColor;
(function (enumColor) {
    enumColor["RED"] = "#FF0000";
    enumColor["BLUE"] = "#0000FF";
    enumColor["GRAY"] = "#808080";
    enumColor["GREEN"] = "#008000";
    enumColor["PURPLE"] = "#800080";
})(enumColor = exports.enumColor || (exports.enumColor = {}));
let StickyNote = class StickyNote extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StickyNote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumColor, default: enumColor.BLUE }),
    __metadata("design:type", String)
], StickyNote.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StickyNote.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_1.Employee, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinTable)({ name: 'employee' }),
    __metadata("design:type", Employee_1.Employee)
], StickyNote.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], StickyNote.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], StickyNote.prototype, "updatedAt", void 0);
StickyNote = __decorate([
    (0, typeorm_1.Entity)()
], StickyNote);
exports.StickyNote = StickyNote;
