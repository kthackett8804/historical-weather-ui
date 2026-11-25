import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationService);
  });

  it('accepts a valid email and rejects an incomplete address', () => {
    expect(service.validateEmail('test@example.com').valid).toBe(true);
    expect(service.isEmailValid('test@example.com')).toBe(true);
    expect(service.validateEmail('test@.com').valid).toBe(false);
    expect(service.isEmailValid('testexample.com')).toBe(false);
  });

  it('enforces username length and permitted characters', () => {
    expect(service.validateUsername('user-123_').valid).toBe(true);
    expect(service.validateUsername('ab').valid).toBe(false);
    expect(service.validateUsername('a'.repeat(21)).valid).toBe(false);
    expect(service.validateUsername('user@123').valid).toBe(false);
  });

  it('requires a strong password', () => {
    expect(service.validatePassword('MyP@ssw0rd').valid).toBe(true);
    expect(service.validatePassword('MyPassword0').valid).toBe(false);
    expect(service.validatePassword('MyP@s0').valid).toBe(false);
  });
});
