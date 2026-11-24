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

  it('validates a new reading locally and does not claim it was saved', async () => {
    const fixture = TestBed.createComponent(AirQuality);
    fixture.detectChanges();

    const type = fixture.nativeElement.querySelector('#reading-type') as HTMLSelectElement;
    const name = fixture.nativeElement.querySelector('#reading-name') as HTMLInputElement;
    const value = fixture.nativeElement.querySelector('#reading-value') as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    expect(type.required).toBe(true);
    expect(name.required).toBe(true);
    expect(value.required).toBe(true);

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.form-feedback')?.textContent).toContain(
      'Enter a type, name, and valid non-negative value',
    );

    type.value = 'pollutant';
    type.dispatchEvent(new Event('change', { bubbles: true }));
    name.value = 'PM2.5';
    name.dispatchEvent(new Event('input', { bubbles: true }));
    value.value = '12.5';
    value.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.form-feedback')?.textContent).toContain(
      'Your reading was not saved',
    );
  });
});
