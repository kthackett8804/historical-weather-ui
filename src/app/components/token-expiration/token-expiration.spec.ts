import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ApiAuthService } from '../../services/api-auth.service';
import { TokenExpiration } from './token-expiration';

describe('TokenExpiration', () => {
  it('shows a renewal warning when the application JWT expires soon', async () => {
    const token = btoa(
      JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 120 }),
    );
    TestBed.configureTestingModule({
      imports: [TokenExpiration],
      providers: [
        {
          provide: ApiAuthService,
          useValue: {
            session$: of({ token: `header.${token}.signature` }),
            clearSession: vi.fn(),
            renewAuth0Session: () => of({
              token: 'renewed',
              username: 'weather-user',
              user_id: 'user-id',
              role: 'user',
            }),
          },
        },
        provideRouter([]),
      ],
    });
    const fixture = TestBed.createComponent(TokenExpiration);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
      'expires soon',
    );
  });
});
