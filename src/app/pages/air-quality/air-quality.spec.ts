import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ApiService } from '../../services/api.service';
import { AirQuality } from './air-quality';

describe('AirQuality', () => {
  let apiServiceSpy: {
    getAirQualityReadings: ReturnType<typeof vi.fn>;
    createAirQualityReading: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    apiServiceSpy = {
      getAirQualityReadings: vi.fn().mockReturnValue(of({
        air_quality_readings: [{ _id: 'reading-1', type: 'pollutant', name: 'PM2.5', value: 12.5 }],
      })),
      createAirQualityReading: vi.fn().mockReturnValue(of({
        air_quality_reading: { _id: 'reading-2', type: 'index', name: 'us-epa-index', value: 2 },
      })),
    };

    await TestBed.configureTestingModule({
      imports: [AirQuality],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'weather-1' }) } },
        },
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    }).compileComponents();
  });

  it('loads readings for the weather record', () => {
    const fixture = TestBed.createComponent(AirQuality);
    fixture.detectChanges();

    expect(apiServiceSpy.getAirQualityReadings).toHaveBeenCalledWith('weather-1');
    expect(fixture.nativeElement.textContent).toContain('PM2.5');
    expect(fixture.nativeElement.textContent).toContain('12.5');
  });

  it('validates input then creates and displays a reading through the API', () => {
    const fixture = TestBed.createComponent(AirQuality);
    fixture.detectChanges();

    const type = fixture.nativeElement.querySelector('#reading-type') as HTMLSelectElement;
    const name = fixture.nativeElement.querySelector('#reading-name') as HTMLInputElement;
    const value = fixture.nativeElement.querySelector('#reading-value') as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.form-feedback')?.textContent).toContain(
      'Enter a type, name, and valid non-negative value',
    );

    type.value = 'index';
    type.dispatchEvent(new Event('change'));
    name.value = 'us-epa-index';
    name.dispatchEvent(new Event('input'));
    value.value = '2';
    value.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(apiServiceSpy.createAirQualityReading).toHaveBeenCalledWith('weather-1', {
      type: 'index',
      name: 'us-epa-index',
      value: 2,
    });
    expect(fixture.nativeElement.textContent).toContain('us-epa-index');
    expect(fixture.nativeElement.querySelector('.form-feedback')?.textContent).toContain(
      'Reading saved.',
    );
  });
});
