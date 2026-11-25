import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ApiAuthService } from '../../services/api-auth.service';
import { ApiService } from '../../services/api.service';
import { Favourites } from './favourites';

describe('Favourites', () => {
  const savedFavourite = {
    _id: 'favourite-1',
    country: 'Canada',
    location_name: 'Vancouver',
    preferred: true,
  };
  let apiServiceSpy: {
    getFavourites: ReturnType<typeof vi.fn>;
    createFavourite: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiServiceSpy = {
      getFavourites: vi.fn().mockReturnValue(of({ favourites: [] })),
      createFavourite: vi.fn().mockReturnValue(of({ location: savedFavourite })),
    };
  });

  it('shows a warning popup for unauthenticated users', () => {
    TestBed.overrideProvider(ApiAuthService, {
      useValue: { isAuthenticated$: of(false), isLoading$: of(false), currentSession: null },
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

  it('loads and displays the authenticated user’s favourite locations', () => {
    apiServiceSpy.getFavourites.mockReturnValue(of({ favourites: [savedFavourite] }));
    const fixture = TestBed.createComponent(Favourites);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Favourites');
    expect(apiServiceSpy.getFavourites).toHaveBeenCalledWith('user-1');
    expect(fixture.nativeElement.textContent).toContain('Vancouver, Canada');
    expect(fixture.nativeElement.querySelector('#favourite-country')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#favourite-location')).not.toBeNull();
  });

  it('validates required fields and saves a favourite through the API', () => {
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

    expect(apiServiceSpy.createFavourite).toHaveBeenCalledWith('user-1', {
      country: 'Canada',
      location_name: 'Vancouver',
      preferred: true,
    });
    expect(fixture.nativeElement.querySelector('.form-feedback')?.textContent).toContain(
      'Favourite location saved.',
    );
    expect(fixture.nativeElement.textContent).toContain('Vancouver, Canada');
  });
});
