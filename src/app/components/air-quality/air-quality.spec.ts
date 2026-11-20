import { TestBed } from '@angular/core/testing';
import { AirQuality } from './air-quality';

describe('AirQuality', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirQuality],
    }).compileComponents();
  });

  it('renders an empty state for air-quality readings', () => {
    const fixture = TestBed.createComponent(AirQuality);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Air Quality');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'No air-quality readings are available',
    );
  });
});
