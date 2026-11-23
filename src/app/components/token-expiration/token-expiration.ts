import { Component, OnDestroy, inject, signal } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-token-expiration',
  template: `
    @if (minutesRemaining() >= 0 && minutesRemaining() <= 5) {
        <aside class="expiry-banner" role="alert" aria-live="polite">
          <span>{{ minutesRemaining() === 0 ? 'Your session is expired.' : 'Your session expires soon.' }}</span>
          <button type="button" (click)="renew()">Renew session</button>
        </aside>
    }
  `,
  styles: `
    .expiry-banner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.75rem 1rem; border-bottom: 1px solid #e0b84b; color: #4f3b00; background: #fff7d6; }
    button { min-height: 2.5rem; border: 1px solid #806000; border-radius: 0.25rem; color: #4f3b00; background: white; font: inherit; font-weight: 700; cursor: pointer; }
  `,
})
export class TokenExpiration implements OnDestroy {
  protected readonly auth = inject(AuthService);
  private readonly subscription: Subscription;
  private expiresAt = 0;
  private intervalId: ReturnType<typeof setInterval> | undefined;
  protected readonly minutesRemaining = signal(999);

  constructor() {
    this.subscription = (this.auth.idTokenClaims$ ?? of(null)).subscribe((claims) => {
      this.expiresAt = claims?.exp ? claims.exp * 1000 : 0;
      this.minutesRemaining.set(this.remainingMinutes());
    });
    this.intervalId = setInterval(() => {
      this.minutesRemaining.set(this.remainingMinutes());
    }, 30_000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.intervalId) clearInterval(this.intervalId);
  }

  protected renew(): void {
    this.auth.getAccessTokenSilently().subscribe({
      error: () => this.auth.loginWithRedirect(),
    });
  }

  private remainingMinutes(): number {
    if (!this.expiresAt) return 999;
    return Math.max(-1, Math.ceil((this.expiresAt - Date.now()) / 60_000));
  }
}
