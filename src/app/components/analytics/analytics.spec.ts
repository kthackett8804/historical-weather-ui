import { TestBed } from '@angular/core/testing';
import { Analytics } from './analytics';

describe('Analytics', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Analytics] }).compileComponents();
  });

  it('shows the analytics heading and explains that data is unavailable', () => {
    const fixture = TestBed.createComponent(Analytics);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Analytics');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'Weather data is not connected',
    );
  });

  it('shows empty states for every analytics section without interactive tabs', () => {
    const fixture = TestBed.createComponent(Analytics);
    fixture.detectChanges();
    const pageText = fixture.nativeElement.textContent as string;
    const sectionHeadings = Array.from(
      fixture.nativeElement.querySelectorAll('h2') as NodeListOf<HTMLHeadingElement>,
      (heading) => heading.textContent,
    );

    expect(sectionHeadings).toEqual(
      expect.arrayContaining(['Country Summary', 'Monthly Trends', 'Extreme Weather']),
    );
    expect(pageText).toContain('No country summary available');
    expect(pageText).toContain('No monthly trend data available');
    expect(pageText).toContain('No extreme weather data available');
    expect(fixture.nativeElement.querySelector('[role="tab"], button')).toBeNull();
    expect(pageText).not.toMatch(/\d+(?:\.\d+)?\s?(?:°C|%|countries|events)/i);
  });
});
