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
exports.Contract = exports.enumCurrency = void 0;
const typeorm_1 = require("typeorm");
const Client_1 = require("./Client");
const Company_Logo_1 = require("./Company_Logo");
const Contract_File_1 = require("./Contract_File");
const Contract_Type_1 = require("./Contract_Type");
const Discussion_1 = require("./Discussion");
const Sign_1 = require("./Sign");
var enumCurrency;
(function (enumCurrency) {
    enumCurrency["USD"] = "USD";
    enumCurrency["GBP"] = "GBP";
    enumCurrency["EUR"] = "EUR";
    enumCurrency["INR"] = "INR";
    enumCurrency["VND"] = "VND";
})(enumCurrency = exports.enumCurrency || (exports.enumCurrency = {}));
let Contract = class Contract extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Contract.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Contract.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Contract.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Contract.prototype, "contract_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumCurrency, default: enumCurrency.USD }),
    __metadata("design:type", String)
], Contract.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Client_1.Client, (client) => client.contracts, {
        onDelete: 'CASCADE',
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Client_1.Client)
], Contract.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "cell", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "office_phone_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "postal_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "alternate_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Company_Logo_1.Company_logo, {
        cascade: true,
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Company_Logo_1.Company_logo)
], Contract.prototype, "company_logo", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Sign_1.Sign, {
        cascade: true,
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Sign_1.Sign)
], Contract.prototype, "sign", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Contract_Type_1.Contract_type, (Contract_type) => Contract_type.contracts, {
        onDelete: 'SET NULL',
        eager: true,
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Contract_Type_1.Contract_type)
], Contract.prototype, "contract_type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Discussion_1.Discussion, (discussion) => discussion.employee),
    __metadata("design:type", Array)
], Contract.prototype, "discussions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Contract_File_1.Contract_file, (contract_file) => contract_file.contract),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Contract.prototype, "contract_files", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Contract.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Contract.prototype, "updatedAt", void 0);
Contract = __decorate([
    (0, typeorm_1.Entity)()
], Contract);
exports.Contract = Contract;
