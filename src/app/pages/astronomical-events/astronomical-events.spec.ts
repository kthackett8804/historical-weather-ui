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
});
