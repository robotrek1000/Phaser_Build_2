export interface RefreshAccessTokenRequest {
  refreshToken: string;
  clientId: string;
}

export interface RefreshAccessTokenResponse {
  access_token: string;
  refresh_token?: string;
}
