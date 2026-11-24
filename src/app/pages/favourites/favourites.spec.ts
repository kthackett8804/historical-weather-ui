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
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
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
    expect(fixture.nativeElement.querySelector('#favourite-country')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#favourite-location')).not.toBeNull();
  });

  it('validates favourite fields locally without claiming they were saved', () => {
    const fixture = TestBed.createComponent(Favourites);
    fixture.detectChanges();

    const country = fixture.nativeElement.querySelector('#favourite-country') as HTMLInputElement;
    const location = fixture.nativeElement.querySelector('#favourite-location') as HTMLInputElement;
    const preferred = fixture.nativeElement.querySelector('#favourite-preferred') as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    expect(country.required).toBe(true);
    expect(location.required).toBe(true);

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.form-feedback')?.textContent).toContain(
      'Enter a country and location name',
    );

    country.value = 'Canada';
    country.dispatchEvent(new Event('input', { bubbles: true }));
    location.value = 'Vancouver';
    location.dispatchEvent(new Event('input', { bubbles: true }));
    preferred.checked = true;
    preferred.dispatchEvent(new Event('change', { bubbles: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.form-feedback')?.textContent).toContain(
      'Your favourite was not saved',
    );
  });
});
