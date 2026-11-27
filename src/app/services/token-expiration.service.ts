import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const WARNING_WINDOW_MS = 5 * 60_000;

@Injectable({ providedIn: 'root' })
export class TokenExpirationService {
  private expiresAt: number | null = null;

  private warningSubject = new BehaviorSubject(false);
  readonly expirationWarning$ = this.warningSubject.asObservable();

  isTokenExpired(token?: string | null): boolean {
    const expiration = token ? this.getExpiration(token) : this.expiresAt;

    return expiration === null || expiration <= Date.now();
  }

  getTimeUntilExpiration(token?: string | null): number {
    const expiration = token ? this.getExpiration(token) : this.expiresAt;

    if (expiration === null) return 0;

    return Math.max(0, (expiration - Date.now()) / 60_000);
  }

  getMinutesRemaining(): number {
    if (this.expiresAt === null) return 999;

    return Math.max(0, Math.ceil((this.expiresAt - Date.now()) / 60_000));
  }

  setToken(token: string | null): void {
    this.expiresAt = token ? this.getExpiration(token) : null;

    const remaining = this.expiresAt ? this.expiresAt - Date.now() : 0;

    this.warningSubject.next(
      remaining > 0 && remaining <= WARNING_WINDOW_MS,
    );
  }

  dismissWarning(): void {
    this.warningSubject.next(false);
  }

  private getExpiration(token: string): number | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;

      const decoded = JSON.parse(atob(payload)) as { exp?: number };

      return typeof decoded.exp === 'number' ? decoded.exp * 1000 : null;
    } catch {
      return null;
    }
  }
}