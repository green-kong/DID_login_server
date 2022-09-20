export declare class TokensDto {
    DID_ACCESS_TOKEN: string | undefined;
    DID_REFRESH_TOKEN: string | undefined;
    code?: string;
    constructor(code: string, access: string, refresh: string);
}
