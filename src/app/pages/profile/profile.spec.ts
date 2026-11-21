import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Profile } from './profile';

describe('Profile', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ userId: 'me' }) },
          },
        },
      ],
    }).compileComponents();
  });

  it('explains that no account profile is loaded in this preview', () => {
    const fixture = TestBed.createComponent(Profile);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Profile');
    expect(fixture.nativeElement.textContent).toContain('Profile preview for user: me');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'No profile is loaded in this preview',
    );
  });
});
