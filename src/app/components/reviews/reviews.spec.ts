import { TestBed } from '@angular/core/testing';
import { Reviews } from './reviews';

describe('Reviews', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Reviews] }).compileComponents();
  });

  it('explains that no global reviews are available in this preview', () => {
    const fixture = TestBed.createComponent(Reviews);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Reviews');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'No reviews are available in this preview',
    );
  });
});
