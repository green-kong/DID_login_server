export class TokensDto {
  DID_ACCESS_TOKEN: string | undefined;
  DID_REFRESH_TOKEN: string | undefined;
  a_idx?: number;
  code?: string;
  constructor(code: string, access: string, refresh: string, a_idx: number) {
    this.DID_ACCESS_TOKEN = access;
    this.DID_REFRESH_TOKEN = refresh;
    this.code = code;
    this.a_idx = a_idx;
  }
}
