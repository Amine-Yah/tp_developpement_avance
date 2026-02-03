"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoMatchModule = void 0;
const common_1 = require("@nestjs/common");
const auto_match_service_1 = require("./auto-match.service");
const auto_match_controller_1 = require("./auto-match.controller");
const player_module_1 = require("../player/player.module");
const match_module_1 = require("../match/match.module");
let AutoMatchModule = class AutoMatchModule {
};
exports.AutoMatchModule = AutoMatchModule;
exports.AutoMatchModule = AutoMatchModule = __decorate([
    (0, common_1.Module)({
        imports: [player_module_1.PlayerModule, match_module_1.MatchModule],
        providers: [auto_match_service_1.AutoMatchService],
        controllers: [auto_match_controller_1.AutoMatchController],
        exports: [auto_match_service_1.AutoMatchService],
    })
], AutoMatchModule);
//# sourceMappingURL=auto-match.module.js.map