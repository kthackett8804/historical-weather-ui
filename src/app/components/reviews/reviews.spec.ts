import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Reviews } from './reviews';

describe('Reviews', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reviews],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders sample reviews with links to their weather records', () => {
    const fixture = TestBed.createComponent(Reviews);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Reviews');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'sample reviews',
    );
    const links = fixture.nativeElement.querySelectorAll(
      'a[href^="/weather/"]',
    ) as NodeListOf<HTMLAnchorElement>;
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]?.getAttribute('href')).toBe('/weather/weather-1');
    expect(fixture.nativeElement.textContent).toContain('Maya Chen');
  });
});
