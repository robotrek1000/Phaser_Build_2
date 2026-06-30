export interface ExchangeSeamlessTokenRequest {
  clientId: string;
  seamlessToken: string;
  fingerPrint: string;
}

export interface ExchangeSeamlessTokenResponse {
  access_token: string;
  refresh_token?: string;
}
