import { Component, OnDestroy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiAuthService } from '../../services/api-auth.service';
import { TokenExpirationService } from '../../services/token-expiration.service';

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
  protected readonly auth = inject(ApiAuthService);
  private readonly router = inject(Router);
  private readonly expiration = inject(TokenExpirationService);
  private readonly subscription: Subscription;
  private intervalId: ReturnType<typeof setInterval> | undefined;
  protected readonly minutesRemaining = signal(999);

  constructor() {
    this.subscription = this.auth.session$.subscribe((session) => {
      this.expiration.setToken(session?.token ?? null);
      this.minutesRemaining.set(this.expiration.getMinutesRemaining());
    });
    this.intervalId = setInterval(() => {
      this.minutesRemaining.set(this.expiration.getMinutesRemaining());
    }, 30_000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.intervalId) clearInterval(this.intervalId);
  }

  protected renew(): void {
    this.auth.renewAuth0Session().subscribe({
      error: () => {
        this.auth.clearSession();
        void this.router.navigate(['/login']);
      },
    });
  }
}
