import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ApiService } from '../../services/api.service';
import { AstronomicalEvents } from './astronomical-events';

describe('AstronomicalEvents', () => {
  let apiServiceSpy: {
    getAstronomicalEvents: ReturnType<typeof vi.fn>;
    createAstronomicalEvent: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    apiServiceSpy = {
      getAstronomicalEvents: vi.fn().mockReturnValue(of({
        astronomical_events: [{ _id: 'event-1', event: 'sunset', time: '2026-11-25T18:00:00Z', occurs: true }],
      })),
      createAstronomicalEvent: vi.fn().mockReturnValue(of({
        astronomical_event: { _id: 'event-2', event: 'sunrise', time: null, occurs: true },
      })),
    };

    await TestBed.configureTestingModule({
      imports: [AstronomicalEvents],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'weather-1' }) } },
        },
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    }).compileComponents();
  });

  it('loads events for the weather record', () => {
    const fixture = TestBed.createComponent(AstronomicalEvents);
    fixture.detectChanges();

    expect(apiServiceSpy.getAstronomicalEvents).toHaveBeenCalledWith('weather-1');
    expect(fixture.nativeElement.textContent).toContain('sunset');
  });

  it('validates input then creates and displays an event through the API', () => {
    const fixture = TestBed.createComponent(AstronomicalEvents);
    fixture.detectChanges();

    const eventName = fixture.nativeElement.querySelector('#event-name') as HTMLInputElement;
    const time = fixture.nativeElement.querySelector('#event-time') as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.form-feedback')?.textContent).toContain(
      'Enter an event name',
    );

    eventName.value = 'sunrise';
    eventName.dispatchEvent(new Event('input'));
    time.value = '06:30';
    time.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(apiServiceSpy.createAstronomicalEvent).toHaveBeenCalledWith('weather-1', {
      event: 'sunrise',
      time: '06:30',
    });
    expect(fixture.nativeElement.textContent).toContain('Event saved.');
    expect(fixture.nativeElement.textContent).toContain('sunrise');
  });
});
