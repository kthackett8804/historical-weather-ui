import { TestBed } from '@angular/core/testing';
import { TokenExpirationService } from './token-expiration.service';

const createToken = (expirationSeconds: number): string => {
  const payload = btoa(JSON.stringify({ exp: expirationSeconds }));
  return `header.${payload}.signature`;
};

describe('TokenExpirationService', () => {
  let service: TokenExpirationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenExpirationService);
  });

  it('treats a missing, malformed, or expired token as expired', () => {
    expect(service.isTokenExpired()).toBe(true);
    expect(service.isTokenExpired('not-a-jwt')).toBe(true);
    expect(service.isTokenExpired(createToken(Math.floor(Date.now() / 1000) - 60))).toBe(true);
  });

  it('returns the remaining time for a valid token', () => {
    const expiresInSeconds = Math.floor(Date.now() / 1000) + 60 * 45;
    const token = createToken(expiresInSeconds);

    expect(service.isTokenExpired(token)).toBe(false);
    expect(service.getTimeUntilExpiration(token)).toBeCloseTo(45, 0);
  });

  it('updates and dismisses the expiry warning', () => {
    const warningStates: boolean[] = [];
    service.expirationWarning$.subscribe((warning) => warningStates.push(warning));

    service.setToken(createToken(Math.floor(Date.now() / 1000) + 4 * 60));
    service.dismissWarning();

    expect(warningStates).toEqual([false, true, false]);
  });
});
