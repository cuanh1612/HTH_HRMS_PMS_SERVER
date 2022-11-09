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
exports.Client_Category = void 0;
const typeorm_1 = require("typeorm");
const Client_entity_1 = require("./Client.entity");
const Client_Sub_Category_entity_1 = require("./Client_Sub_Category.entity");
let Client_Category = class Client_Category extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Client_Category.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Client_Category.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Client_entity_1.Client, (client) => client.client_category),
    __metadata("design:type", Array)
], Client_Category.prototype, "clients", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Client_Sub_Category_entity_1.Client_Sub_Category, (client_sub_category) => client_sub_category.client_category),
    __metadata("design:type", Array)
], Client_Category.prototype, "client_sub_category", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Client_Category.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Client_Category.prototype, "updatedAt", void 0);
Client_Category = __decorate([
    (0, typeorm_1.Entity)()
], Client_Category);
exports.Client_Category = Client_Category;
