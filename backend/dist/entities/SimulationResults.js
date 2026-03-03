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
exports.SimulationResults = void 0;
const typeorm_1 = require("typeorm");
const SimulationParameters_1 = require("./SimulationParameters");
let SimulationResults = class SimulationResults {
};
exports.SimulationResults = SimulationResults;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SimulationResults.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SimulationParameters_1.SimulationParameters, {
        nullable: false,
        onDelete: "CASCADE",
    }),
    __metadata("design:type", SimulationParameters_1.SimulationParameters)
], SimulationResults.prototype, "parameters", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "float" }),
    __metadata("design:type", Number)
], SimulationResults.prototype, "totalEnergyCharged", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "float" }),
    __metadata("design:type", Number)
], SimulationResults.prototype, "peakPower", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "float" }),
    __metadata("design:type", Number)
], SimulationResults.prototype, "concurrencyFactor", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-json"),
    __metadata("design:type", Array)
], SimulationResults.prototype, "exemplaryDay", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-json"),
    __metadata("design:type", Array)
], SimulationResults.prototype, "chargepointPower", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], SimulationResults.prototype, "chargingEventsYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], SimulationResults.prototype, "chargingEventsMonth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], SimulationResults.prototype, "chargingEventsWeek", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], SimulationResults.prototype, "chargingEventsDay", void 0);
exports.SimulationResults = SimulationResults = __decorate([
    (0, typeorm_1.Entity)()
], SimulationResults);
