import { Injectable, Scope } from '@nestjs/common';
export class UserToken {
  id: number;
}
@Injectable({ scope: Scope.REQUEST })
export class UserTokenData {
  private tokenData: UserToken;
  private token: string;

  set(tokenData: UserToken) {
    this.tokenData = tokenData;
  }

  get() {
    return this.tokenData;
  }
  setToken(token: string) {
    this.token = token;
  }
  getToken() {
    return this.token;
  }
}
