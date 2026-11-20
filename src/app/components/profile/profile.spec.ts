import { TestBed } from '@angular/core/testing';
import { Profile } from './profile';

describe('Profile', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Profile] }).compileComponents();
  });

  it('explains that no account profile is loaded in this preview', () => {
    const fixture = TestBed.createComponent(Profile);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Profile');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'No profile is loaded in this preview',
    );
  });
});
