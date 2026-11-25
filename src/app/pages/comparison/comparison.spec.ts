import { TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ApiAuthService } from '../../services/api-auth.service';
import { ApiService } from '../../services/api.service';
import { Comparison } from './comparison';

describe('Comparison', () => {
  let apiServiceSpy: {
    getComparisonAreas: ReturnType<typeof vi.fn>;
    createComparisonArea: ReturnType<typeof vi.fn>;
    compareCountries: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    apiServiceSpy = {
      getComparisonAreas: vi.fn().mockReturnValue(of({
        comparison_areas: [
          { _id: 'area-1', country: 'Canada', location_name: 'Vancouver', label: 'Home' },
          { _id: 'area-2', country: 'Iceland', location_name: 'Reykjavik', label: 'Trip' },
        ],
      })),
      createComparisonArea: vi.fn().mockReturnValue(of({
        location: { _id: 'area-3', country: 'Japan', location_name: 'Tokyo', label: 'Trip 2' },
      })),
      compareCountries: vi.fn().mockReturnValue(of({
        requested: ['Canada', 'Iceland'],
        countries: [{ country: 'Canada', avg_temperature: 12, records: 5 }],
      })),
    };

    await TestBed.configureTestingModule({
      imports: [Comparison],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => null } } },
        },
        {
          provide: ApiAuthService,
          useValue: {
            isAuthenticated$: of(true),
            isLoading$: of(false),
            currentSession: { user_id: 'user-1' },
          },
        },
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    }).compileComponents();
  });

  it('loads the user’s comparison areas and retrieves comparison results', () => {
    const fixture = TestBed.createComponent(Comparison);
    fixture.detectChanges();

    expect(apiServiceSpy.getComparisonAreas).toHaveBeenCalledWith('user-1');
    expect(fixture.nativeElement.textContent).toContain('Vancouver, Canada');
    expect(fixture.nativeElement.querySelector('button').disabled).toBe(false);

    (fixture.nativeElement.querySelector('[data-compare]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(apiServiceSpy.compareCountries).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Canada');
    expect(fixture.nativeElement.textContent).toContain('12');
  });

  it('saves a comparison area through the API', () => {
    const fixture = TestBed.createComponent(Comparison);
    fixture.detectChanges();

    const country = fixture.nativeElement.querySelector('#comparison-country') as HTMLInputElement;
    const location = fixture.nativeElement.querySelector('#comparison-location') as HTMLInputElement;
    const label = fixture.nativeElement.querySelector('#comparison-label') as HTMLInputElement;
    country.value = 'Japan';
    country.dispatchEvent(new Event('input'));
    location.value = 'Tokyo';
    location.dispatchEvent(new Event('input'));
    label.value = 'Trip 2';
    label.dispatchEvent(new Event('input'));
    (fixture.nativeElement.querySelector('form') as HTMLFormElement)
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(apiServiceSpy.createComparisonArea).toHaveBeenCalledWith('user-1', {
      country: 'Japan',
      location_name: 'Tokyo',
      label: 'Trip 2',
    });
    expect(fixture.nativeElement.textContent).toContain('Comparison area saved.');
    expect(fixture.nativeElement.textContent).toContain('Tokyo, Japan');
  });
});
