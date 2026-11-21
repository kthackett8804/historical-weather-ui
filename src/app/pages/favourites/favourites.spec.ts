import { TestBed } from '@angular/core/testing';
import { Favourites } from './favourites';

describe('Favourites', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Favourites] }).compileComponents();
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
