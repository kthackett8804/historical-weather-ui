import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { Favourites } from './favourites';

describe('Favourites', () => {
  it('shows a warning popup for unauthenticated users', () => {
    TestBed.overrideProvider(AuthService, {
      useValue: { isAuthenticated$: of(false), isLoading$: of(false) },
    });
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { snapshot: { queryParamMap: { get: () => 'true' } } },
    });
    const fixture = TestBed.createComponent(Favourites);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alertdialog"]')?.textContent).toContain(
      'authenticated user',
    );
  });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Favourites],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => null } } },
        },
        {
          provide: AuthService,
          useValue: { isAuthenticated$: of(true), isLoading$: of(false) },
        },
      ],
    }).compileComponents();
  });

  it('explains that no favourite locations have been saved', () => {
    const fixture = TestBed.createComponent(Favourites);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Favourites');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'No favourite locations have been saved',
    );
  });
});
