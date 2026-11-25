import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiTokenStore {
  private token: string | null = null;

  get currentToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
  }

  clear(): void {
    this.token = null;
  }
}
