import { TestBed } from '@angular/core/testing';
import { Home } from './home';

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Home] }).compileComponents();
  });

  it('explains that dashboard weather data is unavailable', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Dashboard');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'Weather data is not connected',
    );
  });

  it('shows empty states for summary, trends, and favourites without demo metrics', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const pageText = fixture.nativeElement.textContent as string;
    const sectionHeadings = Array.from(
      fixture.nativeElement.querySelectorAll('h2') as NodeListOf<HTMLHeadingElement>,
      (heading) => heading.textContent,
    );

    expect(sectionHeadings).toEqual(
      expect.arrayContaining(['Summary', 'Weather Trends', 'Favourites']),
    );
    expect(pageText).toContain('No summary data available');
    expect(pageText).toContain('No trend data available');
    expect(pageText).toContain('No favourite locations yet');
    expect(pageText).not.toMatch(/\d+(?:\.\d+)?\s?(?:°C|%|countries|locations)/i);
  });
});
