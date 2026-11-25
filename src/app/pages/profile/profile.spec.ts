import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ApiAuthService } from '../../services/api-auth.service';
import { ApiService } from '../../services/api.service';
import { Profile } from './profile';

describe('Profile', () => {
  const account = {
    _id: 'user-1',
    username: 'weather-user',
    email: 'user@example.com',
    role: 'user' as const,
  };
  let apiServiceSpy: {
    getUser: ReturnType<typeof vi.fn>;
    updateUser: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    apiServiceSpy = {
      getUser: vi.fn().mockReturnValue(of({ user: account })),
      updateUser: vi.fn().mockReturnValue(of({ message: 'User details updated successfully' })),
    };

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ userId: 'user-1' }) } },
        },
        { provide: ApiAuthService, useValue: { currentSession: { user_id: 'user-1' } } },
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    }).compileComponents();
  });

  it('loads the current user profile from the API', () => {
    const fixture = TestBed.createComponent(Profile);
    fixture.detectChanges();

    expect(apiServiceSpy.getUser).toHaveBeenCalledWith('user-1');
    expect(fixture.nativeElement.textContent).toContain('weather-user');
    expect(fixture.nativeElement.textContent).toContain('user@example.com');
  });

  it('saves profile changes using the backend message response', () => {
    const fixture = TestBed.createComponent(Profile);
    fixture.detectChanges();

    const username = fixture.nativeElement.querySelector('#profile-username') as HTMLInputElement;
    username.value = 'new-name';
    username.dispatchEvent(new Event('input'));
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(apiServiceSpy.updateUser).toHaveBeenCalledWith('user-1', { username: 'new-name' });
    expect(fixture.nativeElement.textContent).toContain('Profile updated.');
  });
});
