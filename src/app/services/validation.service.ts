import { Injectable } from '@angular/core';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class ValidationService {
  validateEmail(email: string): ValidationResult {
    const valid = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email.trim());
    return { valid, error: valid ? undefined : 'Enter a valid email address.' };
  }

  isEmailValid(email: string): boolean {
    return this.validateEmail(email).valid;
  }

  validateUsername(username: string): ValidationResult {
    const valid = /^[A-Za-z0-9_-]{3,20}$/.test(username);
    return {
      valid,
      error: valid ? undefined : 'Username must be 3–20 characters using letters, numbers, hyphens, or underscores.',
    };
  }

  isUsernameValid(username: string): boolean {
    return this.validateUsername(username).valid;
  }

  validatePassword(password: string): ValidationResult {
    const valid =
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password);
    return {
      valid,
      error: valid
        ? undefined
        : 'Password must be at least 8 characters and include uppercase, lowercase, number, and special characters.',
    };
  }

  isPasswordValid(password: string): boolean {
    return this.validatePassword(password).valid;
  }
}
