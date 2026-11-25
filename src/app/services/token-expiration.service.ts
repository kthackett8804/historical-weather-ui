import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const WARNING_WINDOW_MS = 5 * 60_000;

@Injectable({ providedIn: 'root' })
export class TokenExpirationService {
  private readonly expirationWarningSubject = new BehaviorSubject(false);
  readonly expirationWarning$ = this.expirationWarningSubject.asObservable();
  private expiresAt: number | null = null;

  isTokenExpired(token?: string | null): boolean {
    const expiration = this.resolveExpiration(token);
    return expiration === null || expiration <= Date.now();
  }

  getTimeUntilExpiration(token?: string | null): number {
    const expiration = this.resolveExpiration(token);
    if (expiration === null) return 0;
    return Math.max(0, (expiration - Date.now()) / 60_000);
  }

  getMinutesRemaining(): number {
    if (this.expiresAt === null) return 999;
    return Math.max(-1, Math.ceil((this.expiresAt - Date.now()) / 60_000));
  }

  setExpirationTimestamp(expiresAt: number | null): void {
    this.expiresAt = expiresAt !== null && Number.isFinite(expiresAt) ? expiresAt : null;
    this.updateWarning();
  }

  setToken(token: string | null): void {
    this.setExpirationTimestamp(token ? this.getTokenExpiration(token) : null);
  }

  dismissWarning(): void {
    this.expirationWarningSubject.next(false);
  }

  private resolveExpiration(token?: string | null): number | null {
    return token === undefined ? this.expiresAt : this.getTokenExpiration(token);
  }

  private getTokenExpiration(token: string | null): number | null {
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as {
        exp?: unknown;
      };
      return typeof decoded.exp === 'number' && Number.isFinite(decoded.exp)
        ? decoded.exp * 1000
        : null;
    } catch {
      return null;
    }
  }

  private updateWarning(): void {
    const remaining = this.expiresAt === null ? 0 : this.expiresAt - Date.now();
    this.expirationWarningSubject.next(remaining > 0 && remaining <= WARNING_WINDOW_MS);
  }
}
