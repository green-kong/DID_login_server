"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensDto = void 0;
class TokensDto {
    constructor(code, access, refresh, a_idx) {
        this.DID_ACCESS_TOKEN = access;
        this.DID_REFRESH_TOKEN = refresh;
        this.code = code;
        this.a_idx = a_idx;
    }
}
exports.TokensDto = TokensDto;
//# sourceMappingURL=tokens.dto.js.map