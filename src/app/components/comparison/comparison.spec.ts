import { TestBed } from '@angular/core/testing';
import { Comparison } from './comparison';

describe('Comparison', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Comparison] }).compileComponents();
  });

  it('explains that no weather records are selected for comparison', () => {
    const fixture = TestBed.createComponent(Comparison);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Comparison');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'No weather records are selected',
    );
  });

  it('keeps the comparison action disabled until records are selected', () => {
    const fixture = TestBed.createComponent(Comparison);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('Compare selected records');
  });
});
