import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFound } from './not-found';

describe('NotFound', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('explains that the requested page was not found', () => {
    const fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Page not found');
    expect(fixture.nativeElement.textContent).toContain(
      'The page you requested could not be found.',
    );
  });

  it('provides a router link back to the dashboard', () => {
    const fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

    expect(link.textContent?.trim()).toBe('Back to dashboard');
    expect(link.getAttribute('href')).toBe('/');
  });
});
