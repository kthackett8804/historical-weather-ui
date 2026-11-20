import { TestBed } from '@angular/core/testing';
import { Weather } from './weather';

describe('Weather', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Weather] }).compileComponents();
  });

  it('renders the Explorer heading and explains that data is unavailable', () => {
    const fixture = TestBed.createComponent(Weather);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Weather Explorer');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'Weather data is not connected',
    );
  });

  it('disables controls that depend on weather data', () => {
    const fixture = TestBed.createComponent(Weather);
    fixture.detectChanges();

    const controls = fixture.nativeElement.querySelectorAll('input, select, button') as NodeListOf<
      HTMLInputElement | HTMLSelectElement | HTMLButtonElement
    >;

    expect(controls.length).toBeGreaterThan(0);
    expect(Array.from(controls).every((control) => control.disabled)).toBe(true);
  });
});
