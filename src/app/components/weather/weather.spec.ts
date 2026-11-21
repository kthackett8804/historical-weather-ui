import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Weather } from './weather';

describe('Weather', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Weather],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders sample weather records with links to their detail pages', () => {
    const fixture = TestBed.createComponent(Weather);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Weather Explorer');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'sample weather records',
    );
    const links = fixture.nativeElement.querySelectorAll(
      'a[href^="/weather/"]',
    ) as NodeListOf<HTMLAnchorElement>;
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]?.getAttribute('href')).toBe('/weather/weather-1');
  });

  it('filters sample records by location and country', () => {
    const fixture = TestBed.createComponent(Weather);
    fixture.detectChanges();

    const location = fixture.nativeElement.querySelector('#location') as HTMLInputElement;
    location.value = 'reyk';
    location.dispatchEvent(new Event('input'));
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Reykjavik');
    expect(fixture.nativeElement.textContent).not.toContain('Vancouver');

    location.value = '';
    location.dispatchEvent(new Event('input'));
    const country = fixture.nativeElement.querySelector('#country') as HTMLSelectElement;
    country.value = 'Portugal';
    country.dispatchEvent(new Event('change'));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Lisbon');
    expect(fixture.nativeElement.textContent).not.toContain('Reykjavik');
  });

  it('sorts matching records by date', () => {
    const fixture = TestBed.createComponent(Weather);
    fixture.detectChanges();

    const sort = fixture.nativeElement.querySelector('#sort') as HTMLSelectElement;
    sort.value = 'oldest';
    sort.dispatchEvent(new Event('change'));
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    const firstRecord = fixture.nativeElement.querySelector('li h3')?.textContent;
    expect(firstRecord).toContain('Lisbon');
  });
});
