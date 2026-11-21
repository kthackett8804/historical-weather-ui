import { TestBed } from '@angular/core/testing';
import { NearbyWeather } from './nearby-weather';

describe('NearbyWeather', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearbyWeather],
    }).compileComponents();
  });

  it('renders the nearby heading and unavailable-data notice', () => {
    const fixture = TestBed.createComponent(NearbyWeather);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Nearby Weather');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'Nearby weather is not connected',
    );
  });

  it('disables location and distance controls', () => {
    const fixture = TestBed.createComponent(NearbyWeather);
    fixture.detectChanges();

    const controls = fixture.nativeElement.querySelectorAll('input, button') as NodeListOf<
      HTMLInputElement | HTMLButtonElement
    >;

    expect(controls.length).toBeGreaterThan(0);
    expect(Array.from(controls).every((control) => control.disabled)).toBe(true);
  });
});
