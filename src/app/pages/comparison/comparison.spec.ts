import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { Comparison } from './comparison';

describe('Comparison', () => {
  it('shows a warning popup for unauthenticated users', () => {
    TestBed.overrideProvider(AuthService, {
      useValue: { isAuthenticated$: of(false), isLoading$: of(false) },
    });
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { snapshot: { queryParamMap: { get: () => 'true' } } },
    });
    const fixture = TestBed.createComponent(Comparison);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alertdialog"]')?.textContent).toContain(
      'authenticated user',
    );
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
  });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comparison],
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

  it('explains that no weather records are selected for comparison', () => {
    const fixture = TestBed.createComponent(Comparison);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Comparison');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'No weather records are selected',
    );
  });

  it('keeps the comparison action disabled until records are selected', () => {
    const fixture = TestBed.createComponent(Comparison);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('Compare selected records');
  });

  it('provides a locally validated form for a comparison area', () => {
    const fixture = TestBed.createComponent(Comparison);
    fixture.detectChanges();

    const country = fixture.nativeElement.querySelector('#comparison-country') as HTMLInputElement;
    const location = fixture.nativeElement.querySelector('#comparison-location') as HTMLInputElement;
    const label = fixture.nativeElement.querySelector('#comparison-label') as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    expect(country.required).toBe(true);
    expect(location.required).toBe(true);
    expect(label.required).toBe(true);

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.form-feedback')?.textContent).toContain(
      'Enter a country, location name, and label',
    );

    country.value = 'Iceland';
    country.dispatchEvent(new Event('input', { bubbles: true }));
    location.value = 'Reykjavik';
    location.dispatchEvent(new Event('input', { bubbles: true }));
    label.value = 'Winter trip';
    label.dispatchEvent(new Event('input', { bubbles: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.form-feedback')?.textContent).toContain(
      'Your comparison area was not saved',
    );
  });
});
