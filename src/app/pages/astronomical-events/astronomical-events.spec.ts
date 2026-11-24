import { TestBed } from '@angular/core/testing';
import { AstronomicalEvents } from './astronomical-events';

describe('AstronomicalEvents', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AstronomicalEvents],
    }).compileComponents();
  });

  it('renders an empty state for astronomical events', () => {
    const fixture = TestBed.createComponent(AstronomicalEvents);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Astronomical Events');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'No astronomical events are available',
    );
  });

  it('validates a new event locally and does not claim it was saved', async () => {
    const fixture = TestBed.createComponent(AstronomicalEvents);
    fixture.detectChanges();

    const eventName = fixture.nativeElement.querySelector('#event-name') as HTMLInputElement;
    const time = fixture.nativeElement.querySelector('#event-time') as HTMLInputElement;
    const occurs = fixture.nativeElement.querySelector('#event-occurs') as HTMLSelectElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    expect(eventName.required).toBe(true);
    expect(time.required).toBe(false);
    expect(occurs.required).toBe(false);

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.form-feedback')?.textContent).toContain(
      'Enter an event name',
    );

    eventName.value = 'Sunrise';
    eventName.dispatchEvent(new Event('input', { bubbles: true }));
    time.value = '06:30';
    time.dispatchEvent(new Event('input', { bubbles: true }));
    occurs.value = 'true';
    occurs.dispatchEvent(new Event('change', { bubbles: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.form-feedback')?.textContent).toContain(
      'Your event was not saved',
    );
  });
});
