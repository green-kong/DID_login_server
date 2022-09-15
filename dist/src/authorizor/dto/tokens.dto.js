"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensDto = void 0;
class TokensDto {
    constructor(code, access, refresh) {
        this.DID_ACCESS_TOKEN = access;
        this.DID_REFRESH_TOKEN = refresh;
        this.code = code;
    }
}
exports.TokensDto = TokensDto;
//# sourceMappingURL=tokens.dto.js.map