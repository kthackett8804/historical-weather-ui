import { TestBed } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { TokenExpiration } from './token-expiration';

describe('TokenExpiration', () => {
  it('shows a renewal warning when the ID token expires soon', async () => {
    TestBed.configureTestingModule({
      imports: [TokenExpiration],
      providers: [
        {
          provide: AuthService,
          useValue: {
            idTokenClaims$: of({ exp: Math.floor(Date.now() / 1000) + 120 }),
            getAccessTokenSilently: () => of('renewed'),
            loginWithRedirect: () => undefined,
          },
        },
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
