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
});
